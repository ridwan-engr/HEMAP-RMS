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

const siteStatus = Joi.string().valid(
    "ONLINE",
    "OFFLINE",
    "WARNING",
    "FAULT"
);

/*
|--------------------------------------------------------------------------
| Site Type
|--------------------------------------------------------------------------
*/

const siteType = Joi.string().valid(
    "Telecom",
    "Commercial",
    "Industrial",
    "Residential",
    "Utility",
    "Other"
);

/*
|--------------------------------------------------------------------------
| System Type
|--------------------------------------------------------------------------
*/

const systemType = Joi.string().valid(
    "Hybrid",
    "Solar",
    "Grid",
    "Generator",
    "Battery"
);

/*
|--------------------------------------------------------------------------
| Location
|--------------------------------------------------------------------------
*/

const locationSchema = Joi.object({
    address: Joi.string().trim().allow(""),
    city: Joi.string().trim().allow(""),
    state: Joi.string().trim().allow(""),
    country: Joi.string().trim().default("Nigeria"),

    latitude: Joi.number()
        .min(-90)
        .max(90),

    longitude: Joi.number()
        .min(-180)
        .max(180)
}).and("latitude", "longitude");

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

    siteType: siteType.optional(),

    systemType: systemType.optional(),

    status: siteStatus.optional(),

    assignedEngineer: objectId.optional(),

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
            "siteCode",
            "-siteCode",
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

    installationId: Joi.string()
        .trim()
        .optional(),

    siteCode: Joi.string()
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

    description: Joi.string()
        .trim()
        .allow("")
        .optional(),

    siteType: siteType.default("Telecom"),

    location: locationSchema.optional(),

    timezone: Joi.string()
        .trim()
        .default("Africa/Lagos"),

    installedCapacity: Joi.number()
        .min(0)
        .default(0),

    commissioningDate: Joi.date()
        .optional(),

    tags: Joi.array()
        .items(Joi.string())
        .default([]),

    systemType: systemType.default("Hybrid"),

    firmwareVersion: Joi.string()
        .trim()
        .allow("")
        .optional(),

    assignedEngineer: objectId.optional(),

    status: siteStatus.default("ONLINE")
});

/*
|--------------------------------------------------------------------------
| Update Site
|--------------------------------------------------------------------------
*/

export const updateSiteValidator = Joi.object({

    installationId: Joi.string()
        .trim()
        .optional(),

    siteCode: Joi.string()
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

    description: Joi.string()
        .trim()
        .allow("")
        .optional(),

    siteType: siteType.optional(),

    location: locationSchema.optional(),

    timezone: Joi.string()
        .trim()
        .optional(),

    installedCapacity: Joi.number()
        .min(0)
        .optional(),

    commissioningDate: Joi.date()
        .optional(),

    tags: Joi.array()
        .items(Joi.string())
        .optional(),

    systemType: systemType.optional(),

    firmwareVersion: Joi.string()
        .trim()
        .allow("")
        .optional(),

    assignedEngineer: objectId.optional(),

    status: siteStatus.optional()

}).min(1);

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default {

    siteIdValidator,

    siteQueryValidator,

    createSiteValidator,

    updateSiteValidator

};