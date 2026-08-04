import Joi from "joi";

/*
|--------------------------------------------------------------------------
| Common ObjectId
|--------------------------------------------------------------------------
*/

const objectId = Joi.string()

    .trim()

    .length(24)

    .hex();

/*
|--------------------------------------------------------------------------
| Permission
|--------------------------------------------------------------------------
*/

const permission = Joi.string()

    .trim()

    .min(3)

    .max(100);

/*
|--------------------------------------------------------------------------
| Role ID
|--------------------------------------------------------------------------
*/

export const roleIdValidator = Joi.object({

    id: objectId.required()

});

/*
|--------------------------------------------------------------------------
| Role Query
|--------------------------------------------------------------------------
*/

export const roleQueryValidator = Joi.object({

    name: Joi.string()

        .trim()

        .optional(),

    permission: Joi.string()

        .trim()

        .optional(),

    page: Joi.number()

        .integer()

        .min(1)

        .default(1),

    limit: Joi.number()

        .integer()

        .min(1)

        .max(100)

        .default(20),

    sort: Joi.string()

        .valid(

            "name",

            "-name",

            "createdAt",

            "-createdAt"

        )

        .default("name")

});

/*
|--------------------------------------------------------------------------
| Create Role
|--------------------------------------------------------------------------
*/

export const createRoleValidator = Joi.object({

    name: Joi.string()

        .trim()

        .uppercase()

        .pattern(/^[A-Z_]+$/)

        .min(2)

        .max(50)

        .required(),

    description: Joi.string()

        .trim()

        .allow("")

        .default(""),

    permissions: Joi.array()

        .items(permission)

        .unique()

        .default([])

});

/*
|--------------------------------------------------------------------------
| Update Role
|--------------------------------------------------------------------------
*/

export const updateRoleValidator = Joi.object({

    name: Joi.string()

        .trim()

        .uppercase()

        .pattern(/^[A-Z_]+$/)

        .min(2)

        .max(50)

        .optional(),

    description: Joi.string()

        .trim()

        .allow("")

        .optional(),

    permissions: Joi.array()

        .items(permission)

        .unique()

        .optional()

}).min(1);

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    roleIdValidator,

    roleQueryValidator,

    createRoleValidator,

    updateRoleValidator

};