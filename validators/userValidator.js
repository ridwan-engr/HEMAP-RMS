import Joi from "joi";

/*
|--------------------------------------------------------------------------
| Common ObjectId
|--------------------------------------------------------------------------
*/

const objectId = Joi.string()

    .trim()

    .length(24)

    .hex()

    .required();

/*
|--------------------------------------------------------------------------
| Password Policy
|--------------------------------------------------------------------------
*/

const password = Joi.string()

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
| User Query
|--------------------------------------------------------------------------
*/

export const userQuerySchema = Joi.object({

    page: Joi.number()

        .integer()

        .min(1)

        .default(1),

    limit: Joi.number()

        .integer()

        .min(1)

        .max(100)

        .default(20),

    search: Joi.string()

        .trim()

        .allow("")

        .optional(),

    role: objectId.optional(),

    status: Joi.string()

        .valid(

            "ACTIVE",

            "INACTIVE"

        )

        .optional(),

    sort: Joi.string()

        .valid(

            "asc",

            "desc"

        )

        .default("asc")

}).unknown(false);

/*
|--------------------------------------------------------------------------
| User ID
|--------------------------------------------------------------------------
*/

export const userIdSchema = Joi.object({

    id: objectId

}).unknown(false);

/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/

export const createUserSchema = Joi.object({

    firstName: Joi.string()

        .trim()

        .min(2)

        .max(50)

        .required(),

    lastName: Joi.string()

        .trim()

        .min(2)

        .max(50)

        .required(),

    email: Joi.string()

        .trim()

        .email()

        .lowercase()

        .required(),

    phone: Joi.string()

        .trim()

        .pattern(/^[+]?[0-9]{7,20}$/)

        .allow("")

        .optional(),

    password: password.required(),

    role: objectId,

    isActive: Joi.boolean()

        .default(true)

}).unknown(false);

/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/

export const updateUserSchema = Joi.object({

    firstName: Joi.string()

        .trim()

        .min(2)

        .max(50),

    lastName: Joi.string()

        .trim()

        .min(2)

        .max(50),

    email: Joi.string()

        .trim()

        .email()

        .lowercase(),

    phone: Joi.string()

        .trim()

        .pattern(/^[+]?[0-9]{7,20}$/)

        .allow(""),

    password,

    role: objectId.optional(),

    isActive: Joi.boolean()

}).min(1).unknown(false);

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    userQuerySchema,

    userIdSchema,

    createUserSchema,

    updateUserSchema

};