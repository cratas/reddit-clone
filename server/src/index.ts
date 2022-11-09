import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cors from "cors";
import { DataSource } from "typeorm";

// graphQL resolvers
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
// constants
import { COOKIE_NAME, __prod__ } from "./constants";

import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export const ormConnection = new DataSource({
  type: "postgres",
  database: "redditv2",
  username: "postgres",
  password: "Admin123",
  logging: true,
  synchronize: true,
  entities: [Post, User],
});

const main = async () => {

  // init type orm connection
  ormConnection.initialize();

  const app = express();

  let redisStore = connectRedis(session);
  var redis = new Redis();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  redis.connect().catch(console.error);

  app.use(
    session({
      name: COOKIE_NAME,
      store: new redisStore({
        client: redis as any,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: __prod__, // cokie only works in https
        sameSite: "lax", //csrf
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
    context: ({ req, res }) => ({ req, res, redis }), // passing objects, something like props
  });

  // startin' graphQL server
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  // startin server on port 4000
  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
