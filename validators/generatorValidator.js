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
| Generator Query
|--------------------------------------------------------------------------
*/

export const generatorQueryValidator = Joi.object({

    siteId: objectId.optional(),

    status: Joi.string()

        .valid(

            "RUNNING",

            "STOPPED",

            "FAULT",

            "MAINTENANCE"

        )

        .optional(),

    fuelType: Joi.string()

        .valid(

            "Diesel",

            "Petrol",

            "Gas"

        )

        .optional(),

    manufacturer: Joi.string()

        .trim()

        .optional(),

    model: Joi.string()

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
| Generator Id
|--------------------------------------------------------------------------
*/

export const generatorIdValidator = Joi.object({

    generatorId: objectId.required()

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Create Generator
|--------------------------------------------------------------------------
*/

export const createGeneratorValidator = Joi.object({

    site: objectId.required(),

    name: Joi.string()

        .trim()

        .min(2)

        .max(150)

        .default("Diesel Generator"),

    manufacturer: Joi.string()

        .trim()

        .allow("")

        .default(""),

    model: Joi.string()

        .trim()

        .allow("")

        .default(""),

    ratedPower: Joi.number()

        .positive()

        .optional(),

    ratedVoltage: Joi.number()

        .positive()

        .optional(),

    ratedFrequency: Joi.number()

        .positive()

        .optional(),

    fuelType: Joi.string()

        .valid(

            "Diesel",

            "Petrol",

            "Gas"

        )

        .default("Diesel"),

    fuelLevel: Joi.number()

        .min(0)

        .max(100)

        .optional(),

    fuelConsumptionRate: Joi.number()

        .min(0)

        .optional(),

    runtimeHours: Joi.number()

        .min(0)

        .default(0),

    todayRuntime: Joi.number()

        .min(0)

        .default(0),

    startCount: Joi.number()

        .integer()

        .min(0)

        .default(0),

    outputPower: Joi.number()

        .min(0)

        .optional(),

    outputVoltage: Joi.number()

        .min(0)

        .optional(),

    outputFrequency: Joi.number()

        .min(0)

        .optional(),

    oilPressure: Joi.number()

        .min(0)

        .optional(),

    coolantTemperature: Joi.number()

        .optional(),

    batteryVoltage: Joi.number()

        .min(0)

        .optional(),

    status: Joi.string()

        .valid(

            "RUNNING",

            "STOPPED",

            "FAULT",

            "MAINTENANCE"

        )

        .default("STOPPED"),

    lastStarted: Joi.date()

        .optional(),

    lastStopped: Joi.date()

        .optional(),

    nextServiceHours: Joi.number()

        .min(0)

        .optional()

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Update Generator
|--------------------------------------------------------------------------
*/

export const updateGeneratorValidator = Joi.object({

    name: Joi.string()

        .trim()

        .min(2)

        .max(150)

        .optional(),

    manufacturer: Joi.string()

        .trim()

        .allow("")

        .optional(),

    model: Joi.string()

        .trim()

        .allow("")

        .optional(),

    ratedPower: Joi.number()

        .positive()

        .optional(),

    ratedVoltage: Joi.number()

        .positive()

        .optional(),

    ratedFrequency: Joi.number()

        .positive()

        .optional(),

    fuelType: Joi.string()

        .valid(

            "Diesel",

            "Petrol",

            "Gas"

        )

        .optional(),

    fuelLevel: Joi.number()

        .min(0)

        .max(100)

        .optional(),

    fuelConsumptionRate: Joi.number()

        .min(0)

        .optional(),

    runtimeHours: Joi.number()

        .min(0)

        .optional(),

    todayRuntime: Joi.number()

        .min(0)

        .optional(),

    startCount: Joi.number()

        .integer()

        .min(0)

        .optional(),

    outputPower: Joi.number()

        .min(0)

        .optional(),

    outputVoltage: Joi.number()

        .min(0)

        .optional(),

    outputFrequency: Joi.number()

        .min(0)

        .optional(),

    oilPressure: Joi.number()

        .min(0)

        .optional(),

    coolantTemperature: Joi.number()

        .optional(),

    batteryVoltage: Joi.number()

        .min(0)

        .optional(),

    status: Joi.string()

        .valid(

            "RUNNING",

            "STOPPED",

            "FAULT",

            "MAINTENANCE"

        )

        .optional(),

    lastStarted: Joi.date()

        .optional(),

    lastStopped: Joi.date()

        .optional(),

    nextServiceHours: Joi.number()

        .min(0)

        .optional()

})

.min(1)

.unknown(false);

/*
|--------------------------------------------------------------------------
| Generator Status
|--------------------------------------------------------------------------
*/

export const generatorStatusValidator = Joi.object({

    status: Joi.string()

        .valid(

            "RUNNING",

            "STOPPED",

            "FAULT",

            "MAINTENANCE"

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

    generatorQueryValidator,

    generatorIdValidator,

    createGeneratorValidator,

    updateGeneratorValidator,

    generatorStatusValidator

};