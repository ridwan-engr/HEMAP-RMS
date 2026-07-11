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

export const dateRangeSchema = Joi.object({

    startDate: Joi.date()
        .required(),

    endDate: Joi.date()
        .min(Joi.ref("startDate"))
        .required()

});

export const paginationSchema = Joi.object({

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
| Dashboard Query
|--------------------------------------------------------------------------
*/

export const dashboardQuerySchema = Joi.object({

    siteId: objectIdSchema.optional(),

    installationId: Joi.string()
        .trim()
        .length(24)
        .hex()
        .optional(),

    startDate: Joi.date(),

    endDate: Joi.date(),

    interval: Joi.string()
        .valid(

            "hour",

            "day",

            "week",

            "month",

            "year"

        )
        .default("day")

});

/*
|--------------------------------------------------------------------------
| Statistics Query
|--------------------------------------------------------------------------
*/

export const statisticsQuerySchema = Joi.object({

    siteId: objectIdSchema.required(),

    startDate: Joi.date().required(),

    endDate: Joi.date()
        .min(Joi.ref("startDate"))
        .required(),

    metric: Joi.string()
        .valid(

            "energy",

            "battery",

            "solar",

            "generator",

            "grid",

            "fuel",

            "power"

        )
        .optional()

});

/*
|--------------------------------------------------------------------------
| Forecast Request
|--------------------------------------------------------------------------
*/

export const forecastSchema = Joi.object({

    siteId: objectIdSchema.required(),

    forecastType: Joi.string()
        .valid(

            "load",

            "solar",

            "battery",

            "generator",

            "energy",

            "weather"

        )
        .required(),

    horizon: Joi.number()
        .integer()
        .min(1)
        .max(365)
        .default(24),

    unit: Joi.string()
        .valid(

            "hour",

            "day"

        )
        .default("hour")

});

/*
|--------------------------------------------------------------------------
| Optimization Request
|--------------------------------------------------------------------------
*/

export const optimizationSchema = Joi.object({

    siteId: objectIdSchema.required(),

    objective: Joi.string()
        .valid(

            "minimum_cost",

            "minimum_fuel",

            "minimum_emission",

            "maximum_renewable",

            "maximum_reliability"

        )
        .required(),

    constraints: Joi.object({

        minimumSOC: Joi.number()
            .min(0)
            .max(100),

        maximumGeneratorPower: Joi.number()
            .min(0),

        reserveMargin: Joi.number()
            .min(0),

        gridAvailable: Joi.boolean()

    }).default({})

});

/*
|--------------------------------------------------------------------------
| Reliability Analysis
|--------------------------------------------------------------------------
*/

export const reliabilitySchema = Joi.object({

    siteId: objectIdSchema.required(),

    startDate: Joi.date().required(),

    endDate: Joi.date()
        .min(Joi.ref("startDate"))
        .required(),

    indices: Joi.array()

        .items(

            Joi.string().valid(

                "SAIDI",

                "SAIFI",

                "CAIDI",

                "ENS",

                "LOLP",

                "Availability",

                "MTBF",

                "MTTR"

            )

        )

        .default([

            "SAIDI",

            "SAIFI",

            "ENS"

        ])

});

/*
|--------------------------------------------------------------------------
| Operational Insights
|--------------------------------------------------------------------------
*/

export const insightsSchema = Joi.object({

    siteId: objectIdSchema.required(),

    startDate: Joi.date(),

    endDate: Joi.date(),

    includeRecommendations: Joi.boolean()
        .default(true),

    includeForecast: Joi.boolean()
        .default(true),

    includeReliability: Joi.boolean()
        .default(true)

});

export default {

    dashboardQuerySchema,

    statisticsQuerySchema,

    forecastSchema,

    optimizationSchema,

    reliabilitySchema,

    insightsSchema,

    paginationSchema,

    dateRangeSchema

};