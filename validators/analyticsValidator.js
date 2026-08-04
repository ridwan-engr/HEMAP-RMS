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
| Common Analytics Query
|--------------------------------------------------------------------------
*/

const analyticsQuery = Joi.object({

    siteId: objectId.optional(),

    installationId: objectId.optional(),

    customer: Joi.string()

        .trim()

        .allow("")

        .optional(),

    startDate: Joi.date()

        .optional(),

    endDate: Joi.date()

        .min(Joi.ref("startDate"))

        .optional(),

    interval: Joi.string()

        .valid(

            "hour",

            "day",

            "week",

            "month",

            "year"

        )

        .default("day"),

    includeForecast: Joi.boolean()

        .default(false),

    includeOptimization: Joi.boolean()

        .default(false),

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
| Dashboard Analytics
|--------------------------------------------------------------------------
*/

export const dashboardAnalyticsValidator = analyticsQuery;

/*
|--------------------------------------------------------------------------
| Energy Analytics
|--------------------------------------------------------------------------
*/

export const energyAnalyticsValidator = analyticsQuery.keys({

    energySource: Joi.string()

        .valid(

            "GRID",

            "SOLAR",

            "GENERATOR",

            "BATTERY",

            "ALL"

        )

        .default("ALL")

});

/*
|--------------------------------------------------------------------------
| Battery Analytics
|--------------------------------------------------------------------------
*/

export const batteryAnalyticsValidator = analyticsQuery.keys({

    batteryId: objectId.optional()

});

/*
|--------------------------------------------------------------------------
| Solar Analytics
|--------------------------------------------------------------------------
*/

export const solarAnalyticsValidator = analyticsQuery.keys({

    arrayId: objectId.optional()

});

/*
|--------------------------------------------------------------------------
| Generator Analytics
|--------------------------------------------------------------------------
*/

export const generatorAnalyticsValidator = analyticsQuery.keys({

    generatorId: objectId.optional()

});

/*
|--------------------------------------------------------------------------
| Grid Analytics
|--------------------------------------------------------------------------
*/

export const gridAnalyticsValidator = analyticsQuery.keys({

    feeder: Joi.string()

        .trim()

        .allow("")

        .optional()

});

/*
|--------------------------------------------------------------------------
| Reliability Analytics
|--------------------------------------------------------------------------
*/

export const reliabilityAnalyticsValidator = analyticsQuery.keys({

    metric: Joi.string()

        .valid(

            "SAIDI",

            "SAIFI",

            "MTBF",

            "MTTR",

            "AVAILABILITY",

            "ALL"

        )

        .default("ALL")

});

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    dashboardAnalyticsValidator,

    energyAnalyticsValidator,

    batteryAnalyticsValidator,

    solarAnalyticsValidator,

    generatorAnalyticsValidator,

    gridAnalyticsValidator,

    reliabilityAnalyticsValidator

};