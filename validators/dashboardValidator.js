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

/*
|--------------------------------------------------------------------------
| Dashboard Query
|--------------------------------------------------------------------------
*/

export const dashboardQuerySchema = Joi.object({

    siteId: Joi.string()
        .hex()
        .length(24)
        .optional(),

    installationId: Joi.string()
        .hex()
        .length(24)
        .optional(),

    startDate: Joi.date(),

    endDate: Joi.date()
        .min(Joi.ref("startDate")),

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
| Dashboard Cards
|--------------------------------------------------------------------------
*/

export const dashboardCardSchema = Joi.object({

    siteId: Joi.string()
        .hex()
        .length(24)
        .optional(),

    includeFinancial: Joi.boolean()

        .default(false),

    includeReliability: Joi.boolean()

        .default(true),

    includeForecast: Joi.boolean()

        .default(true)

});

/*
|--------------------------------------------------------------------------
| KPI Request
|--------------------------------------------------------------------------
*/

export const kpiSchema = Joi.object({

    siteId: Joi.string()
        .hex()
        .length(24)
        .optional(),

    startDate: Joi.date()
        .required(),

    endDate: Joi.date()

        .min(Joi.ref("startDate"))

        .required()

});

/*
|--------------------------------------------------------------------------
| Executive Dashboard
|--------------------------------------------------------------------------
*/

export const executiveDashboardSchema = Joi.object({

    customer: Joi.string()

        .trim()

        .allow("")

        .optional(),

    region: Joi.string()

        .trim()

        .allow("")

        .optional(),

    includeSites: Joi.boolean()

        .default(true),

    includeAlarms: Joi.boolean()

        .default(true),

    includeEnergy: Joi.boolean()

        .default(true),

    includeReliability: Joi.boolean()

        .default(true)

});

/*
|--------------------------------------------------------------------------
| Map View
|--------------------------------------------------------------------------
*/

export const mapViewSchema = Joi.object({

    customer: Joi.string()

        .trim()

        .allow("")

        .optional(),

    state: Joi.string()

        .trim()

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
| Dashboard Refresh
|--------------------------------------------------------------------------
*/

export const refreshDashboardSchema = Joi.object({

    refresh: Joi.boolean()

        .default(true)

});

export default {

    objectIdSchema,

    refreshDashboardSchema,

    dashboardQuerySchema,

    dashboardCardSchema,

    kpiSchema,

    executiveDashboardSchema,

    mapViewSchema

};