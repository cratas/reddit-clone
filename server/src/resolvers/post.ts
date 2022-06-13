import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";


@Resolver() //graphql resolver keyword
export class PostResolver {
  // graphql query for selecting ALL posts
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  // graphql query -> [Post] is an array and Post is a SINGLE object
  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  // graphql query with mutation, used for INSERTING new post
  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, {
      title,
      updatedAt: new Date(),
      createdAt: new Date(),
    });
    await em.persistAndFlush(post);
    return post;
  }

  // graphql query with mutation, used for UPDATING post
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string, // when we want to set something nullable, we gotta set the type explicitly
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });

    if (!post) return null; // if there is no post, return null

    if (typeof title !== "undefined") {
      // if title was set, update post
      post.title = title;
      await em.persistAndFlush(post);
    }

    return post;
  }

  // graphql query with mutation, used for UPDATING post
  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    try {
      await em.nativeDelete(Post, { id });
      return true;
    } catch {
      return false;
    }
  }
}
