import { UserNamePasswordInput } from "./UserNamePasswordInput";

export const validateRegister = (options: UserNamePasswordInput) => {
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
  if (options.username.includes("@")) {
    return {
      errors: [
        {
          field: "username",
          message: "Cnnot include an @.",
        },
      ],
    };
  }

  //checking if email has correct format
  if (!options.email.includes("@")) {
    return {
      errors: [
        {
          field: "email",
          message: "Invalid email.",
        },
      ],
    };
  }

  //checking if password has correct format
  if (options.password.length < 5) {
    return {
      errors: [
        {
          field: "password",
          message: "Length of password must be greated than 4.",
        },
      ],
    };
  }

  return null;
};
