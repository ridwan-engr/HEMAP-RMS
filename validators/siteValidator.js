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
| Location
|--------------------------------------------------------------------------
*/

export const coordinateSchema = Joi.object({

    latitude: Joi.number()
        .min(-90)
        .max(90)
        .required(),

    longitude: Joi.number()
        .min(-180)
        .max(180)
        .required(),

    address: Joi.string()
        .trim()
        .max(255)
        .allow("")
        .optional(),

    city: Joi.string()
        .trim()
        .max(100)
        .allow("")
        .optional(),

    state: Joi.string()
        .trim()
        .max(100)
        .allow("")
        .optional(),

    country: Joi.string()
        .trim()
        .max(100)
        .default("Nigeria")

});

/*
|--------------------------------------------------------------------------
| Site Information
|--------------------------------------------------------------------------
*/

export const createSiteSchema = Joi.object({

    siteName: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .required(),

    siteCode: Joi.string()
        .trim()
        .max(50)
        .required(),

    customer: Joi.string()
        .trim()
        .max(150)
        .allow("")
        .optional(),

    description: Joi.string()
        .trim()
        .allow("")
        .optional(),

    location: coordinateSchema.required(),

    siteType: Joi.string()
        .valid(

            "Telecom",

            "Commercial",

            "Industrial",

            "Residential",

            "MiniGrid",

            "Utility",

            "DataCenter"

        )
        .required(),

    status: Joi.string()
        .valid(

            "Active",

            "Inactive",

            "Maintenance",

            "Fault"

        )
        .default("Active"),

    timezone: Joi.string()
        .default("Africa/Lagos"),

    installedCapacity: Joi.number()
        .min(0)
        .default(0),

    commissioningDate: Joi.date()
        .optional(),

    tags: Joi.array()
        .items(Joi.string().trim())
        .default([])

});

/*
|--------------------------------------------------------------------------
| Update Site
|--------------------------------------------------------------------------
*/

export const updateSiteSchema = Joi.object({

    siteName: Joi.string()
        .trim()
        .min(2)
        .max(150),

    customer: Joi.string()
        .trim(),

    description: Joi.string()
        .trim()
        .allow(""),

    location: coordinateSchema,

    siteType: Joi.string()
        .valid(

            "Telecom",

            "Commercial",

            "Industrial",

            "Residential",

            "MiniGrid",

            "Utility",

            "DataCenter"

        ),

    status: Joi.string()
        .valid(

            "Active",

            "Inactive",

            "Maintenance",

            "Fault"

        ),

    timezone: Joi.string(),

    installedCapacity: Joi.number()
        .min(0),

    commissioningDate: Joi.date(),

    tags: Joi.array()
        .items(Joi.string())

}).min(1);

/*
|--------------------------------------------------------------------------
| Site Parameters
|--------------------------------------------------------------------------
*/

export const siteIdSchema = Joi.object({

    siteId: objectIdSchema

});

/*
|--------------------------------------------------------------------------
| Query Parameters
|--------------------------------------------------------------------------
*/

export const siteQuerySchema = Joi.object({

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

    customer: Joi.string()
        .trim()
        .allow(""),

    siteType: Joi.string(),

    status: Joi.string(),

    state: Joi.string()
        .trim()
        .allow(""),

    city: Joi.string()
        .trim()
        .allow(""),

    sortBy: Joi.string()
        .default("createdAt"),

    order: Joi.string()
        .valid("asc", "desc")
        .default("desc")

});

/*
|--------------------------------------------------------------------------
| Change Site Status
|--------------------------------------------------------------------------
*/

export const siteStatusSchema = Joi.object({

    status: Joi.string()
        .valid(

            "Active",

            "Inactive",

            "Maintenance",

            "Fault"

        )
        .required()

});

/*
|--------------------------------------------------------------------------
| Assign Engineer
|--------------------------------------------------------------------------
*/

export const assignEngineerSchema = Joi.object({

    siteId: objectIdSchema,

    engineerId: objectIdSchema

});

/*
|--------------------------------------------------------------------------
| Operational Status
|--------------------------------------------------------------------------
*/

export const operationalStatusSchema = Joi.object({

    operationalStatus: Joi.string()
        .valid(

            "ONLINE",

            "OFFLINE",

            "MAINTENANCE",

            "FAULT",

            "WARNING"

        )
        .required(),

    remarks: Joi.string()
        .trim()
        .max(500)
        .allow("")
        .optional()

});

export default {

    createSiteSchema,

    updateSiteSchema,

    siteIdSchema,

    siteQuerySchema,

    siteStatusSchema,

    assignEngineerSchema,

    coordinateSchema,

    operationalStatusSchema

};