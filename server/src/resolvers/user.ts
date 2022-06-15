import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { UserNamePasswordInput } from "../utils/UserNamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";

// object for abstract error type
@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

// returning objects for login function that return error object or user
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver() // resolver keyword
export class UserResolver {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { em, redis }: MyContext
  ) {
    const user = await em.findOne(User, { email });
    if (!user) {
      // the email is not in database
      return true;
    }

    // generate random token
    const token = v4();

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "EX",
      1000 * 60 * 60 * 24 * 3
    ); // 3 days

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
    );

    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    // check if user is logged in

    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UserNamePasswordInput, // options passed as objects created on top
    @Ctx() { req, em }: MyContext
  ): Promise<UserResponse> {
    // validation of input
    const response = validateRegister(options);
    if (response) {
      return response;
    }

    const hashedPassword = await argon2.hash(options.password); // creating new hash key by argon2 hashing alg
    const user = em.create(User, {
      userName: options.username,
      password: hashedPassword,
      email: options.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      await em.persistAndFlush(user);
    } catch (err) {
      // if username is duplicated
      if (err.code === "23505" || err.detail.includes("already exists")) {
        return {
          errors: [
            {
              field: "username",
              message: "Username already taken.",
            },
          ],
        };
      }
    }

    // store user id session and log in user
    req.session.userId = user.id;

    return { user };
  }

  // login function
  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string, // options passed as objects created on top
    @Arg("password") password: string, // options passed as objects created on top
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    let user;
    try {
      user = await em.findOneOrFail(
        User,
        usernameOrEmail.includes("@")
          ? { email: usernameOrEmail }
          : { userName: usernameOrEmail }
      );
    } catch (err) {
      console.log(err);
    }

    // if user does not exist return correct error object
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "This username/email does not exist.",
          },
        ],
      };
    }

    // verify hashed password
    const valid: boolean = await argon2.verify(user.password, password);
    // if pass is not valid, returns object error object
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}
