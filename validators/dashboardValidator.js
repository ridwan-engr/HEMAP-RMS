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
| Dashboard Query
|--------------------------------------------------------------------------
*/

export const dashboardQuerySchema = Joi.object({

    siteId: objectId.optional(),

    installationId: objectId.optional(),

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

        .default("day")

});

/*
|--------------------------------------------------------------------------
| Dashboard Cards
|--------------------------------------------------------------------------
*/

export const dashboardCardSchema = Joi.object({

    siteId: objectId.optional(),

    includeFinancial: Joi.boolean()

        .default(false),

    includeReliability: Joi.boolean()

        .default(true),

    includeForecast: Joi.boolean()

        .default(true)

});

/*
|--------------------------------------------------------------------------
| KPI Query
|--------------------------------------------------------------------------
*/

export const kpiSchema = Joi.object({

    siteId: objectId.optional(),

    installationId: objectId.optional(),

    startDate: Joi.date()

        .iso()

        .required(),

    endDate: Joi.date()

        .iso()

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
| Dashboard Map
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

            "ACTIVE",

            "INACTIVE",

            "MAINTENANCE",

            "FAULT"

        )

        .optional()

});

/*
|--------------------------------------------------------------------------
| Refresh Dashboard
|--------------------------------------------------------------------------
*/

export const refreshDashboardSchema = Joi.object({

    refresh: Joi.boolean()

        .default(true)

});

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    dashboardQuerySchema,

    dashboardCardSchema,

    executiveDashboardSchema,

    kpiSchema,

    mapViewSchema,

    refreshDashboardSchema

};