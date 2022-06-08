import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";

@InputType()
class UserNamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

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

// register function
@Resolver() // resolver keyword
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UserNamePasswordInput, // options passed as objects created on top
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    // checking if username has correct format
    if (options.username.length < 5) {
      return {
        errors: [
          {
            field: "username",
            message: "Length of username must be greated than 4.",
          },
        ],
      };
    }

    //checking if password has correct format
    if (options.username.length < 5) {
      return {
        errors: [
          {
            field: "username",
            message: "Length of password must be greated than 4.",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password); // creating new hash key by argon2 hashing alg
    const user = em.create(User, {
      userName: options.username,
      password: hashedPassword,
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
    return { user };
  }

  // login function
  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UserNamePasswordInput, // options passed as objects created on top
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOneOrFail(User, { userName: options.username });
    // if user does not exist return correct error object
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "could not find the user",
          },
        ],
      };
    }

    // verify hashed password
    const valid: boolean = await argon2.verify(user.password, options.password);
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

    // if everything is ok, return user
    return {
      user,
    };
  }

  
}
