import Joi from "joi";

/*
|--------------------------------------------------------------------------
| Password Policy
|--------------------------------------------------------------------------
*/

const passwordSchema = Joi.string()

    .min(8)

    .max(64)

    .pattern(

        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/

    )

    .messages({

        "string.pattern.base":

            "Password must contain uppercase, lowercase, number and special character."

    });

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

export const registerValidator = Joi.object({

    firstName: Joi.string()

        .trim()

        .min(2)

        .max(100)

        .required(),

    lastName: Joi.string()

        .trim()

        .min(2)

        .max(100)

        .required(),

    email: Joi.string()

        .email()

        .lowercase()

        .required(),

    password: passwordSchema.required(),

    confirmPassword: Joi.string()

        .valid(Joi.ref("password"))

        .required()

        .messages({

            "any.only": "Passwords do not match."

        }),

    phone: Joi.string()

        .trim()

        .allow("", null),

    role: Joi.string()

        .valid(

            "ADMIN",

            "SUPERVISOR",

            "ENGINEER",

            "VIEWER"

        )

        .required()

});

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export const loginValidator = Joi.object({

    email: Joi.string()

        .email()

        .lowercase()

        .required(),

    password: Joi.string()

        .required()

});

/*
|--------------------------------------------------------------------------
| Forgot Password
|--------------------------------------------------------------------------
*/

export const forgotPasswordValidator = Joi.object({

    email: Joi.string()

        .email()

        .lowercase()

        .required()

});

/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
*/

export const resetPasswordValidator = Joi.object({

    token: Joi.string()

        .required(),

    password: passwordSchema.required(),

    confirmPassword: Joi.string()

        .valid(Joi.ref("password"))

        .required()

        .messages({

            "any.only": "Passwords do not match."

        })

});

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

export const changePasswordValidator = Joi.object({

    currentPassword: Joi.string()

        .required(),

    newPassword: passwordSchema.required(),

    confirmPassword: Joi.string()

        .valid(Joi.ref("newPassword"))

        .required()

        .messages({

            "any.only": "Passwords do not match."

        })

});

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    loginValidator,

    registerValidator,

    forgotPasswordValidator,

    resetPasswordValidator,

    changePasswordValidator

};