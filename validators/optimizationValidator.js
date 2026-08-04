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
| Optimization Query
|--------------------------------------------------------------------------
*/

export const optimizationQueryValidator = Joi.object({

    siteId: objectId.optional(),

    installationId: objectId.optional(),

    optimizedBy: objectId.optional(),

    status: Joi.string()

        .valid(

            "PENDING",

            "RUNNING",

            "COMPLETED",

            "FAILED"

        )

        .optional(),

    algorithm: Joi.string()

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

});

/*
|--------------------------------------------------------------------------
| Optimization Id
|--------------------------------------------------------------------------
*/

export const optimizationIdValidator = Joi.object({

    optimizationId: objectId.required()

});

/*
|--------------------------------------------------------------------------
| Execute Optimization
|--------------------------------------------------------------------------
*/

export const optimizeValidator = Joi.object({

    site: objectId.required(),

    installation: objectId.required(),

    algorithm: Joi.string()

        .valid(

            "LINEAR_PROGRAMMING",

            "MILP",

            "GENETIC_ALGORITHM",

            "PSO",

            "GREEDY",

            "CUSTOM"

        )

        .required(),

    objective: Joi.string()

        .valid(

            "MIN_COST",

            "MIN_FUEL",

            "MIN_CO2",

            "MAX_EFFICIENCY",

            "MAX_RENEWABLE",

            "CUSTOM"

        )

        .required(),

    constraints: Joi.object()

        .unknown(true)

        .default({}),

    weatherForecast: Joi.boolean()

        .default(true),

    loadForecast: Joi.boolean()

        .default(true),

    batteryOptimization: Joi.boolean()

        .default(true),

    generatorOptimization: Joi.boolean()

        .default(true),

    solarOptimization: Joi.boolean()

        .default(true),

    dispatchInterval: Joi.string()

        .valid(

            "15min",

            "30min",

            "1hour",

            "6hours",

            "24hours"

        )

        .default("1hour"),

    optimizationPeriod: Joi.number()

        .integer()

        .min(1)

        .max(365)

        .default(1),

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

    optimizationQueryValidator,

    optimizationIdValidator,

    optimizeValidator

};