import { Query, Resolver } from "type-graphql";

@Resolver() // resolver keyword
export class HelloResolver {
  // graphql query resolver with specific type
  @Query(() => String)
  hello() {
    return "hello word"; // what it returns
  }
}
