import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  // migrations runs automatically
  await orm.getMigrator().up();

  // await orm.em.nativeInsert(Post, {title: 'nevim', createdAt: new Date(), updatedAt: new Date()})

  const app = express();


  // creating apollo graphQL server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),  // passing objects, something like props
  });

  // startin' graphQL server
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  // startin server on port 4000
  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
