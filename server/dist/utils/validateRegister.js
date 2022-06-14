"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (options) => {
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
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map