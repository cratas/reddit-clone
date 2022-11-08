import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";

@Resolver() //graphql resolver keyword
export class PostResolver {
  // graphql query for selecting ALL posts
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find();
  }

  // graphql query -> [Post] is an array and Post is a SINGLE object
  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number): Promise<Post | null> {
    return Post.findOne({ where: { id } });
  }

  // graphql query with mutation, used for INSERTING new post
  @Mutation(() => Post)
  async createPost(@Arg("title") title: string): Promise<Post> {
    // 2 sql queries
    return Post.create({ title }).save();
  }

  // graphql query with mutation, used for UPDATING post
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string // when we want to set something nullable, we gotta set the type explicitly
  ): Promise<Post | null> {
    const post = await Post.findOne({ where: { id } });

    if (!post) return null; // if there is no post, return null

    if (typeof title !== "undefined") {
      // if title was set, update post
      await Post.update({ id }, { title });
    }

    return post;
  }

  // graphql query with mutation, used for UPDATING post
  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<Boolean> {
    await Post.delete(id);
    return false;
  }
}
