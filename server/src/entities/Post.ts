import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType() // it makes it graphql type
@Entity()
export class Post {
  @Field() // graphql field keyword
  @PrimaryKey() // microorm keyword
  id!: number;  

  @Field(() => String)
  @Property({ type: "date"})
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text" })
  title!: string;
}
