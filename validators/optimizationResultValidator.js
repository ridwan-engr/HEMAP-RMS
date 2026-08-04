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
| Optimization Result Query
|--------------------------------------------------------------------------
*/

export const optimizationResultQueryValidator = Joi.object({

    siteId: objectId.optional(),

    status: Joi.string()

        .valid(

            "SUCCESS",

            "FAILED",

            "RUNNING"

        )

        .optional(),

    optimizationMethod: Joi.string()

        .trim()

        .optional(),

    objectiveFunction: Joi.string()

        .trim()

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

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Optimization Result Id
|--------------------------------------------------------------------------
*/

export const optimizationResultIdValidator = Joi.object({

    optimizationResultId: objectId.required()

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Create Optimization Result
|--------------------------------------------------------------------------
*/

export const createOptimizationResultValidator = Joi.object({

    site: objectId.required(),

    optimizationDate: Joi.date()

        .default(() => new Date()),

    objectiveFunction: Joi.string()

        .trim()

        .max(100)

        .default("Minimum ENS"),

    optimizationMethod: Joi.string()

        .trim()

        .max(100)

        .default("Pyomo"),

    batteryDispatch: Joi.number()

        .default(0),

    generatorDispatch: Joi.number()

        .default(0),

    solarDispatch: Joi.number()

        .default(0),

    gridDispatch: Joi.number()

        .default(0),

    renewableFraction: Joi.number()

        .min(0)

        .max(100)

        .default(0),

    batteryEfficiency: Joi.number()

        .min(0)

        .max(100)

        .default(0),

    generatorRuntime: Joi.number()

        .min(0)

        .default(0),

    fuelConsumption: Joi.number()

        .min(0)

        .default(0),

    operatingCost: Joi.number()

        .min(0)

        .default(0),

    co2Emission: Joi.number()

        .min(0)

        .default(0),

    lolp: Joi.number()

        .min(0)

        .default(0),

    ens: Joi.number()

        .min(0)

        .default(0),

    saifi: Joi.number()

        .min(0)

        .default(0),

    saidi: Joi.number()

        .min(0)

        .default(0),

    resilienceIndex: Joi.number()

        .min(0)

        .max(100)

        .default(0),

    computationTime: Joi.number()

        .min(0)

        .default(0),

    status: Joi.string()

        .valid(

            "SUCCESS",

            "FAILED",

            "RUNNING"

        )

        .default("SUCCESS")

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Update Optimization Result
|--------------------------------------------------------------------------
*/

export const updateOptimizationResultValidator = Joi.object({

    optimizationDate: Joi.date()

        .optional(),

    objectiveFunction: Joi.string()

        .trim()

        .max(100)

        .optional(),

    optimizationMethod: Joi.string()

        .trim()

        .max(100)

        .optional(),

    batteryDispatch: Joi.number()

        .optional(),

    generatorDispatch: Joi.number()

        .optional(),

    solarDispatch: Joi.number()

        .optional(),

    gridDispatch: Joi.number()

        .optional(),

    renewableFraction: Joi.number()

        .min(0)

        .max(100)

        .optional(),

    batteryEfficiency: Joi.number()

        .min(0)

        .max(100)

        .optional(),

    generatorRuntime: Joi.number()

        .min(0)

        .optional(),

    fuelConsumption: Joi.number()

        .min(0)

        .optional(),

    operatingCost: Joi.number()

        .min(0)

        .optional(),

    co2Emission: Joi.number()

        .min(0)

        .optional(),

    lolp: Joi.number()

        .min(0)

        .optional(),

    ens: Joi.number()

        .min(0)

        .optional(),

    saifi: Joi.number()

        .min(0)

        .optional(),

    saidi: Joi.number()

        .min(0)

        .optional(),

    resilienceIndex: Joi.number()

        .min(0)

        .max(100)

        .optional(),

    computationTime: Joi.number()

        .min(0)

        .optional(),

    status: Joi.string()

        .valid(

            "SUCCESS",

            "FAILED",

            "RUNNING"

        )

        .optional()

})

.min(1)

.unknown(false);

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    optimizationResultQueryValidator,

    optimizationResultIdValidator,

    createOptimizationResultValidator,

    updateOptimizationResultValidator

};