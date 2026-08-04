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
| Solar Query
|--------------------------------------------------------------------------
*/

export const solarQueryValidator = Joi.object({

    siteId: objectId.optional(),

    status: Joi.string()

        .valid(

            "ONLINE",

            "OFFLINE",

            "WARNING",

            "FAULT"

        )

        .optional(),

    manufacturer: Joi.string()

        .trim()

        .optional(),

    moduleType: Joi.string()

        .trim()

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
| Solar Id
|--------------------------------------------------------------------------
*/

export const solarIdValidator = Joi.object({

    solarId: objectId.required()

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Create Solar Array
|--------------------------------------------------------------------------
*/

export const createSolarValidator = Joi.object({

    site: objectId.required(),

    arrayName: Joi.string()

        .trim()

        .min(2)

        .max(150)

        .default("PV Array"),

    manufacturer: Joi.string()

        .trim()

        .allow("")

        .default(""),

    moduleType: Joi.string()

        .trim()

        .allow("")

        .default(""),

    installedCapacity: Joi.number()

        .positive()

        .optional(),

    inverterCapacity: Joi.number()

        .positive()

        .optional(),

    stringCount: Joi.number()

        .integer()

        .min(0)

        .optional(),

    modulesPerString: Joi.number()

        .integer()

        .min(0)

        .optional(),

    currentPower: Joi.number()

        .min(0)

        .optional(),

    dailyEnergy: Joi.number()

        .min(0)

        .optional(),

    monthlyEnergy: Joi.number()

        .min(0)

        .optional(),

    yearlyEnergy: Joi.number()

        .min(0)

        .optional(),

    irradiance: Joi.number()

        .min(0)

        .optional(),

    panelTemperature: Joi.number()

        .optional(),

    inverterEfficiency: Joi.number()

        .min(0)

        .max(100)

        .optional(),

    status: Joi.string()

        .valid(

            "ONLINE",

            "OFFLINE",

            "WARNING",

            "FAULT"

        )

        .default("ONLINE")

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Update Solar Array
|--------------------------------------------------------------------------
*/

export const updateSolarValidator = Joi.object({

    arrayName: Joi.string()

        .trim()

        .min(2)

        .max(150)

        .optional(),

    manufacturer: Joi.string()

        .trim()

        .allow("")

        .optional(),

    moduleType: Joi.string()

        .trim()

        .allow("")

        .optional(),

    installedCapacity: Joi.number()

        .positive()

        .optional(),

    inverterCapacity: Joi.number()

        .positive()

        .optional(),

    stringCount: Joi.number()

        .integer()

        .min(0)

        .optional(),

    modulesPerString: Joi.number()

        .integer()

        .min(0)

        .optional(),

    currentPower: Joi.number()

        .min(0)

        .optional(),

    dailyEnergy: Joi.number()

        .min(0)

        .optional(),

    monthlyEnergy: Joi.number()

        .min(0)

        .optional(),

    yearlyEnergy: Joi.number()

        .min(0)

        .optional(),

    irradiance: Joi.number()

        .min(0)

        .optional(),

    panelTemperature: Joi.number()

        .optional(),

    inverterEfficiency: Joi.number()

        .min(0)

        .max(100)

        .optional(),

    status: Joi.string()

        .valid(

            "ONLINE",

            "OFFLINE",

            "WARNING",

            "FAULT"

        )

        .optional()

})

.min(1)

.unknown(false);

/*
|--------------------------------------------------------------------------
| Update Solar Status
|--------------------------------------------------------------------------
*/

export const solarStatusValidator = Joi.object({

    status: Joi.string()

        .valid(

            "ONLINE",

            "OFFLINE",

            "WARNING",

            "FAULT"

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

    solarQueryValidator,

    solarIdValidator,

    createSolarValidator,

    updateSolarValidator,

    solarStatusValidator

};