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
| Fault Query
|--------------------------------------------------------------------------
*/

export const faultQueryValidator = Joi.object({

    siteId: objectId.optional(),

    installationId: objectId.optional(),

    deviceId: objectId.optional(),

    assignedTo: objectId.optional(),

    status: Joi.string()

        .valid(

            "OPEN",

            "ACKNOWLEDGED",

            "IN_PROGRESS",

            "RESOLVED"

        )

        .optional(),

    severity: Joi.string()

        .valid(

            "LOW",

            "MEDIUM",

            "HIGH",

            "CRITICAL"

        )

        .optional(),

    startDate: Joi.date()

        .iso()

        .optional(),

    endDate: Joi.date()

        .iso()

        .min(Joi.ref("startDate"))

        .optional(),

    page: Joi.number()

        .integer()

        .min(1)

        .default(1),

    limit: Joi.number()

        .integer()

        .min(1)

        .max(500)

        .default(100)

});

/*
|--------------------------------------------------------------------------
| Fault Id
|--------------------------------------------------------------------------
*/

export const faultIdValidator = Joi.object({

    faultId: objectId.required()

});

/*
|--------------------------------------------------------------------------
| Create Fault
|--------------------------------------------------------------------------
*/

export const createFaultValidator = Joi.object({

    site: objectId.required(),

    installation: objectId.required(),

    device: objectId.optional(),

    assignedTo: objectId.optional(),

    title: Joi.string()

        .trim()

        .min(3)

        .max(200)

        .required(),

    description: Joi.string()

        .trim()

        .allow("")

        .default(""),

    category: Joi.string()

        .trim()

        .required(),

    severity: Joi.string()

        .valid(

            "LOW",

            "MEDIUM",

            "HIGH",

            "CRITICAL"

        )

        .default("MEDIUM"),

    status: Joi.string()

        .valid(

            "OPEN",

            "ACKNOWLEDGED",

            "IN_PROGRESS",

            "RESOLVED"

        )

        .default("OPEN"),

    detectedAt: Joi.date()

        .iso()

        .default(() => new Date()),

    remarks: Joi.string()

        .trim()

        .allow("")

        .default("")

});

/*
|--------------------------------------------------------------------------
| Update Fault
|--------------------------------------------------------------------------
*/

export const updateFaultValidator = Joi.object({

    assignedTo: objectId.optional(),

    title: Joi.string()

        .trim()

        .min(3)

        .max(200)

        .optional(),

    description: Joi.string()

        .trim()

        .allow("")

        .default(""),

    category: Joi.string()

        .trim()

        .optional(),

    severity: Joi.string()

        .valid(

            "LOW",

            "MEDIUM",

            "HIGH",

            "CRITICAL"

        )

        .optional(),

    status: Joi.string()

        .valid(

            "OPEN",

            "ACKNOWLEDGED",

            "IN_PROGRESS",

            "RESOLVED"

        )

        .optional(),

    remarks: Joi.string()

        .trim()

        .allow("")

        .optional()

}).min(1);

/*
|--------------------------------------------------------------------------
| Resolve Fault
|--------------------------------------------------------------------------
*/

export const resolveFaultValidator = Joi.object({

    resolution: Joi.string()

        .trim()

        .required(),

    rootCause: Joi.string()

        .trim()

        .allow("")

        .default(""),

    correctiveAction: Joi.string()

        .trim()

        .allow("")

        .default(""),

    preventiveAction: Joi.string()

        .trim()

        .allow("")

        .default(""),

    downtime: Joi.number()

        .integer()

        .min(0)

        .optional(),

    remarks: Joi.string()

        .trim()

        .allow("")

        .default("")

});

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    faultQueryValidator,

    faultIdValidator,

    createFaultValidator,

    updateFaultValidator,

    resolveFaultValidator

};