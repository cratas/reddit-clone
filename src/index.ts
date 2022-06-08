import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

// graphQL resolvers
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
// constants
import { __prod__ } from "./constants";

import * as redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from "./types";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  // migrations runs automatically
  await orm.getMigrator().up();

  // await orm.em.nativeInsert(Post, {title: 'nevim', createdAt: new Date(), updatedAt: new Date()})

  const app = express();

  let redisStore = connectRedis(session);
  let redisClient = redis.createClient();

  redisClient.connect().catch(console.error);

  app.use(
    session({
      name: "qid",
      store: new redisStore({
        client: redisClient as any,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: __prod__, // cokie only works in https
        sameSite: 'lax',  //csrf
      },
      saveUninitialized: false,
      secret: "sdfasdfqqfqfqfqwfqsdf",
      resave: false,
    })
  );

  // creating apollo graphQL server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({req, res}): MyContext => ({ em: orm.em, req, res }), // passing objects, something like props
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
