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
| Coordinates
|--------------------------------------------------------------------------
*/

const locationSchema = Joi.object({
    address: Joi.string().trim().allow("").optional(),
    city: Joi.string().trim().allow("").optional(),
    state: Joi.string().trim().allow("").optional(),
    country: Joi.string().trim().allow("").optional(),
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional()
});

/*
|--------------------------------------------------------------------------
| Installation ID
|--------------------------------------------------------------------------
*/

export const installationIdValidator = Joi.object({
    id: objectId.required()
});

/*
|--------------------------------------------------------------------------
| Installation Query
|--------------------------------------------------------------------------
*/

export const installationQueryValidator = Joi.object({

    siteId: objectId.optional(),

    installationId: Joi.number()
        .integer()
        .positive()
        .optional(),

    identifier: Joi.string()
        .trim()
        .optional(),

    systemType: Joi.string()
        .valid(
            "Grid",
            "Solar",
            "Hybrid",
            "Off-Grid"
        )
        .optional(),

    status: Joi.string()
        .valid(
            "ONLINE",
            "OFFLINE",
            "WARNING",
            "FAULT"
        )
        .optional(),

    isActive: Joi.boolean().optional(),

    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(20)

});

/*
|--------------------------------------------------------------------------
| Create Installation
|--------------------------------------------------------------------------
*/

export const createInstallationValidator = Joi.object({

    site: objectId.required(),

    installationId: Joi.number()
        .integer()
        .positive()
        .required(),

    identifier: Joi.string()
        .trim()
        .max(100)
        .required(),

    name: Joi.string()
        .trim()
        .max(150)
        .required(),

    portalId: Joi.string()
        .trim()
        .allow("")
        .optional(),

    systemType: Joi.string()
        .valid(
            "Grid",
            "Solar",
            "Hybrid",
            "Off-Grid"
        )
        .default("Hybrid"),

    firmwareVersion: Joi.string()
        .trim()
        .allow("")
        .optional(),

    vrmUrl: Joi.string()
        .uri()
        .allow("")
        .optional(),

    location: locationSchema.optional(),

    timezone: Joi.string()
        .trim()
        .default("Africa/Lagos"),

    status: Joi.string()
        .valid(
            "ONLINE",
            "OFFLINE",
            "WARNING",
            "FAULT"
        )
        .default("ONLINE"),

    lastSync: Joi.date().optional(),

    lastTelemetry: Joi.date().optional(),

    isActive: Joi.boolean()
        .default(true),

    notes: Joi.string()
        .trim()
        .allow("")
        .optional()

});

/*
|--------------------------------------------------------------------------
| Update Installation
|--------------------------------------------------------------------------
*/

export const updateInstallationValidator = Joi.object({

    site: objectId.optional(),

    installationId: Joi.number()
        .integer()
        .positive()
        .optional(),

    identifier: Joi.string()
        .trim()
        .max(100)
        .optional(),

    name: Joi.string()
        .trim()
        .max(150)
        .optional(),

    portalId: Joi.string()
        .trim()
        .allow("")
        .optional(),

    systemType: Joi.string()
        .valid(
            "Grid",
            "Solar",
            "Hybrid",
            "Off-Grid"
        )
        .optional(),

    firmwareVersion: Joi.string()
        .trim()
        .allow("")
        .optional(),

    vrmUrl: Joi.string()
        .uri()
        .allow("")
        .optional(),

    location: locationSchema.optional(),

    timezone: Joi.string()
        .trim()
        .optional(),

    status: Joi.string()
        .valid(
            "ONLINE",
            "OFFLINE",
            "WARNING",
            "FAULT"
        )
        .optional(),

    lastSync: Joi.date().optional(),

    lastTelemetry: Joi.date().optional(),

    isActive: Joi.boolean().optional(),

    notes: Joi.string()
        .trim()
        .allow("")
        .optional()

}).min(1);

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default {

    installationIdValidator,

    installationQueryValidator,

    createInstallationValidator,

    updateInstallationValidator

};