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
| Common Statistics Query
|--------------------------------------------------------------------------
*/

const statisticsQuery = Joi.object({

    siteId: objectId.optional(),

    installationId: objectId.optional(),

    customer: Joi.string()

        .trim()

        .max(150)

        .allow("")

        .optional(),

    startDate: Joi.date()

        .iso()

        .optional(),

    endDate: Joi.date()

        .iso()

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

    page: Joi.number()

        .integer()

        .min(1)

        .default(1),

    limit: Joi.number()

        .integer()

        .min(1)

        .max(500)

        .default(100),

    sort: Joi.string()

        .valid(

            "asc",

            "desc"

        )

        .default("desc")

}).unknown(false);

/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

export const dashboardStatisticsValidator = statisticsQuery;

/*
|--------------------------------------------------------------------------
| Energy Statistics
|--------------------------------------------------------------------------
*/

export const energyStatisticsValidator = statisticsQuery.keys({

    source: Joi.string()

        .valid(

            "GRID",

            "SOLAR",

            "BATTERY",

            "GENERATOR",

            "ALL"

        )

        .default("ALL")

});

/*
|--------------------------------------------------------------------------
| Battery Statistics
|--------------------------------------------------------------------------
*/

export const batteryStatisticsValidator = statisticsQuery.keys({

    batteryId: objectId.optional()

});

/*
|--------------------------------------------------------------------------
| Solar Statistics
|--------------------------------------------------------------------------
*/

export const solarStatisticsValidator = statisticsQuery.keys({

    arrayId: objectId.optional()

});

/*
|--------------------------------------------------------------------------
| Generator Statistics
|--------------------------------------------------------------------------
*/

export const generatorStatisticsValidator = statisticsQuery.keys({

    generatorId: objectId.optional()

});

/*
|--------------------------------------------------------------------------
| Grid Statistics
|--------------------------------------------------------------------------
*/

export const gridStatisticsValidator = statisticsQuery.keys({

    feeder: Joi.string()

        .trim()

        .max(100)

        .allow("")

        .optional()

});

/*
|--------------------------------------------------------------------------
| KPI Statistics
|--------------------------------------------------------------------------
*/

export const kpiStatisticsValidator = statisticsQuery.keys({

    includeFinancial: Joi.boolean()

        .default(false),

    includeReliability: Joi.boolean()

        .default(true),

    includeForecast: Joi.boolean()

        .default(false)

});

/*
|--------------------------------------------------------------------------
| Site Locations
|--------------------------------------------------------------------------
*/

export const siteLocationValidator = Joi.object({

    customer: Joi.string()

        .trim()

        .max(150)

        .allow("")

        .optional(),

    state: Joi.string()

        .trim()

        .max(100)

        .allow("")

        .optional(),

    status: Joi.string()

        .valid(

            "Active",

            "Inactive",

            "Maintenance",

            "Fault"

        )

        .optional()

});

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    dashboardStatisticsValidator,

    energyStatisticsValidator,

    batteryStatisticsValidator,

    solarStatisticsValidator,

    generatorStatisticsValidator,

    gridStatisticsValidator,

    kpiStatisticsValidator,

    siteLocationValidator

};