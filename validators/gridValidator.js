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
| Grid Query
|--------------------------------------------------------------------------
*/

export const gridQueryValidator = Joi.object({

    siteId: objectId.optional(),

    utilityName: Joi.string()

        .trim()

        .optional(),

    status: Joi.string()

        .valid(

            "AVAILABLE",

            "OUTAGE",

            "UNSTABLE"

        )

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

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Grid Id
|--------------------------------------------------------------------------
*/

export const gridIdValidator = Joi.object({

    gridId: objectId.required()

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Create Grid
|--------------------------------------------------------------------------
*/

export const createGridValidator = Joi.object({

    site: objectId.required(),

    utilityName: Joi.string()

        .trim()

        .allow("")

        .default(""),

    voltage: Joi.number()

        .min(0)

        .optional(),

    current: Joi.number()

        .min(0)

        .optional(),

    frequency: Joi.number()

        .min(0)

        .optional(),

    power: Joi.number()

        .optional(),

    importedEnergy: Joi.number()

        .min(0)

        .default(0),

    exportedEnergy: Joi.number()

        .min(0)

        .default(0),

    availability: Joi.number()

        .min(0)

        .max(100)

        .default(100),

    outageCount: Joi.number()

        .integer()

        .min(0)

        .default(0),

    outageDuration: Joi.number()

        .min(0)

        .default(0),

    SAIDI: Joi.number()

        .min(0)

        .default(0),

    SAIFI: Joi.number()

        .min(0)

        .default(0),

    ENS: Joi.number()

        .min(0)

        .default(0),

    status: Joi.string()

        .valid(

            "AVAILABLE",

            "OUTAGE",

            "UNSTABLE"

        )

        .default("AVAILABLE"),

    lastAvailable: Joi.date()

        .optional(),

    lastOutage: Joi.date()

        .optional()

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Update Grid
|--------------------------------------------------------------------------
*/

export const updateGridValidator = Joi.object({

    utilityName: Joi.string()

        .trim()

        .allow("")

        .optional(),

    voltage: Joi.number()

        .min(0)

        .optional(),

    current: Joi.number()

        .min(0)

        .optional(),

    frequency: Joi.number()

        .min(0)

        .optional(),

    power: Joi.number()

        .optional(),

    importedEnergy: Joi.number()

        .min(0)

        .optional(),

    exportedEnergy: Joi.number()

        .min(0)

        .optional(),

    availability: Joi.number()

        .min(0)

        .max(100)

        .optional(),

    outageCount: Joi.number()

        .integer()

        .min(0)

        .optional(),

    outageDuration: Joi.number()

        .min(0)

        .optional(),

    SAIDI: Joi.number()

        .min(0)

        .optional(),

    SAIFI: Joi.number()

        .min(0)

        .optional(),

    ENS: Joi.number()

        .min(0)

        .optional(),

    status: Joi.string()

        .valid(

            "AVAILABLE",

            "OUTAGE",

            "UNSTABLE"

        )

        .optional(),

    lastAvailable: Joi.date()

        .optional(),

    lastOutage: Joi.date()

        .optional()

})

.min(1)

.unknown(false);

/*
|--------------------------------------------------------------------------
| Grid Status
|--------------------------------------------------------------------------
*/

export const gridStatusValidator = Joi.object({

    status: Joi.string()

        .valid(

            "AVAILABLE",

            "OUTAGE",

            "UNSTABLE"

        )

        .required()

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    gridQueryValidator,

    gridIdValidator,

    createGridValidator,

    updateGridValidator,

    gridStatusValidator

};