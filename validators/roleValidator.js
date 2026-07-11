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

/*
|--------------------------------------------------------------------------
| Create Role
|--------------------------------------------------------------------------
*/

export const createRoleSchema = Joi.object({

    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),

    displayName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    description: Joi.string()
        .trim()
        .max(500)
        .allow("")
        .optional(),

    permissions: Joi.array()
        .items(Joi.string().trim())
        .default([]),

    isSystem: Joi.boolean()
        .default(false),

    isActive: Joi.boolean()
        .default(true)

});

/*
|--------------------------------------------------------------------------
| Update Role
|--------------------------------------------------------------------------
*/

export const updateRoleSchema = Joi.object({

    displayName: Joi.string()
        .trim()
        .min(2)
        .max(100),

    description: Joi.string()
        .trim()
        .max(500)
        .allow(""),

    permissions: Joi.array()
        .items(Joi.string().trim()),

    isActive: Joi.boolean()

}).min(1);

/*
|--------------------------------------------------------------------------
| Assign Permissions
|--------------------------------------------------------------------------
*/

export const permissionsSchema = Joi.object({

    permissions: Joi.array()
        .items(Joi.string().trim())
        .min(1)
        .required()

});

/*
|--------------------------------------------------------------------------
| Role Parameters
|--------------------------------------------------------------------------
*/

export const roleIdSchema = Joi.object({

    roleId: objectIdSchema

});

/*
|--------------------------------------------------------------------------
| Pagination / Search
|--------------------------------------------------------------------------
*/

export const roleQuerySchema = Joi.object({

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
        .allow(""),

    sortBy: Joi.string()
        .default("createdAt"),

    order: Joi.string()
        .valid("asc", "desc")
        .default("desc"),

    isActive: Joi.boolean()

});

export default {

    createRoleSchema,

    updateRoleSchema,

    permissionsSchema,

    roleIdSchema,

    roleQuerySchema

};