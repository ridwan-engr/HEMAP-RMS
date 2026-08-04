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
| Site Status
|--------------------------------------------------------------------------
*/

const siteStatus = Joi.string()

    .valid(

        "Active",

        "Inactive",

        "Maintenance",

        "Fault"

    );

/*
|--------------------------------------------------------------------------
| Site ID
|--------------------------------------------------------------------------
*/

export const siteIdValidator = Joi.object({

    id: objectId.required()

});

/*
|--------------------------------------------------------------------------
| Site Query
|--------------------------------------------------------------------------
*/

export const siteQueryValidator = Joi.object({

    customer: Joi.string()

        .trim()

        .optional(),

    region: Joi.string()

        .trim()

        .max(100)

        .optional(),

    state: Joi.string()

        .trim()

        .max(100)

        .optional(),

    status: siteStatus.optional(),

    isActive: Joi.boolean()

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

            "code",

            "-code",

            "createdAt",

            "-createdAt"

        )

        .default("name")

});

/*
|--------------------------------------------------------------------------
| Create Site
|--------------------------------------------------------------------------
*/

export const createSiteValidator = Joi.object({

    code: Joi.string()

        .trim()

        .uppercase()

        .pattern(/^[A-Z0-9_-]+$/)

        .max(50)

        .required(),

    name: Joi.string()

        .trim()

        .min(2)

        .max(150)

        .required(),

    customer: Joi.string()

        .trim()

        .allow("")

        .optional(),

    region: Joi.string()

        .trim()

        .max(100)

        .allow("")

        .optional(),

    state: Joi.string()

        .trim()

        .max(100)

        .allow("")

        .optional(),

    address: Joi.string()

        .trim()

        .max(500)

        .allow("")

        .optional(),

    latitude: Joi.number()

        .min(-90)

        .max(90)

        .optional(),

    longitude: Joi.number()

        .min(-180)

        .max(180)

        .optional(),

    installation: objectId.optional(),

    status: siteStatus.default("Active"),

    isActive: Joi.boolean()

        .default(true)

})

.and("latitude", "longitude");

/*
|--------------------------------------------------------------------------
| Update Site
|--------------------------------------------------------------------------
*/

export const updateSiteValidator = Joi.object({

    code: Joi.string()

        .trim()

        .uppercase()

        .pattern(/^[A-Z0-9_-]+$/)

        .max(50)

        .optional(),

    name: Joi.string()

        .trim()

        .min(2)

        .max(150)

        .optional(),

    customer: Joi.string()

        .trim()

        .allow("")

        .optional(),

    region: Joi.string()

        .trim()

        .max(100)

        .allow("")

        .optional(),

    state: Joi.string()

        .trim()

        .max(100)

        .allow("")

        .optional(),

    address: Joi.string()

        .trim()

        .max(500)

        .allow("")

        .optional(),

    latitude: Joi.number()

        .min(-90)

        .max(90)

        .optional(),

    longitude: Joi.number()

        .min(-180)

        .max(180)

        .optional(),

    installation: objectId.optional(),

    status: siteStatus.optional(),

    isActive: Joi.boolean()

        .optional()

})

.and("latitude", "longitude")

.min(1);

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    siteIdValidator,

    siteQueryValidator,

    createSiteValidator,

    updateSiteValidator

};