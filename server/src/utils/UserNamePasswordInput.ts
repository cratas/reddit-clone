import {
  Field,
  InputType
} from "type-graphql";

// import { EntityManager } from "@mikro-orm/postgresql";
@InputType()
export class UserNamePasswordInput {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
}
