import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import Redis from "ioredis";
import { createUpdootLoader } from "./utils/createUpdootLoader";
import { createUserLoader } from "./utils/createUserLoader";

export type MyContext = {
  req: Request & {
    session: Session & Partial<SessionData> & { userId?: number };
  };
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>; // give us return value of the function
  updootLoader: ReturnType<typeof createUpdootLoader>; // give us return value of the function
};
