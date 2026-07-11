import Joi from "joi";

/*
|--------------------------------------------------------------------------
| Common Schemas
|--------------------------------------------------------------------------
*/

export const objectIdSchema = Joi.string()
    .trim()
    .length(24)
    .hex()
    .required();

export const paginationSchema = Joi.object({

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

    sortBy: Joi.string()
        .trim()
        .default("createdAt"),

    order: Joi.string()
        .valid("asc", "desc")
        .default("desc")

});


/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/

export const createUserSchema = Joi.object({

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

    password: Joi.string()
        .min(8)
        .max(128)
        .required(),

    phoneNumber: Joi.string()
        .trim()
        .allow("")
        .optional(),

    role: Joi.string()
        .trim()
        .optional(),

    department: Joi.string()
        .trim()
        .allow("")
        .optional(),

    designation: Joi.string()
        .trim()
        .allow("")
        .optional(),

    isActive: Joi.boolean()
        .default(true)

});


/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/

export const updateUserSchema = Joi.object({

    firstName: Joi.string()
        .trim()
        .min(2)
        .max(100),

    lastName: Joi.string()
        .trim()
        .min(2)
        .max(100),

    phoneNumber: Joi.string()
        .trim()
        .allow(""),

    department: Joi.string()
        .trim()
        .allow(""),

    designation: Joi.string()
        .trim()
        .allow(""),

    profileImage: Joi.string()
        .uri()
        .allow(""),

    isActive: Joi.boolean()

}).min(1);


/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

export const updateProfileSchema = Joi.object({

    firstName: Joi.string()
        .trim()
        .min(2)
        .max(100),

    lastName: Joi.string()
        .trim()
        .min(2)
        .max(100),

    phoneNumber: Joi.string()
        .trim()
        .allow(""),

    profileImage: Joi.string()
        .uri()
        .allow("")

}).min(1);


/*
|--------------------------------------------------------------------------
| Assign Role
|--------------------------------------------------------------------------
*/

export const assignRoleSchema = Joi.object({

    role: Joi.string()
        .trim()
        .required()

});


/*
|--------------------------------------------------------------------------
| Activate / Deactivate User
|--------------------------------------------------------------------------
*/

export const statusSchema = Joi.object({

    isActive: Joi.boolean()
        .required()

});


/*
|--------------------------------------------------------------------------
| Route Parameters
|--------------------------------------------------------------------------
*/

export const userIdSchema = Joi.object({

    userId: objectIdSchema

});


export default {

    objectIdSchema,

    paginationSchema,

    createUserSchema,

    updateUserSchema,

    updateProfileSchema,

    assignRoleSchema,

    statusSchema,

    userIdSchema

};