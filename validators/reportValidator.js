import Joi from "joi";

/*
|--------------------------------------------------------------------------
| Common Schema
|--------------------------------------------------------------------------
*/

export const objectIdSchema = Joi.string()
    .trim()
    .length(24)
    .hex()
    .required();

/*
|--------------------------------------------------------------------------
| Date Range
|--------------------------------------------------------------------------
*/

export const dateRangeSchema = Joi.object({

    startDate: Joi.date()
        .required(),

    endDate: Joi.date()
        .greater(Joi.ref("startDate"))
        .required()

});

/*
|--------------------------------------------------------------------------
| Report Generation
|--------------------------------------------------------------------------
*/

export const generateReportSchema = Joi.object({

    siteId: objectIdSchema.optional(),

    installationId: Joi.string()
        .trim()
        .length(24)
        .hex()
        .optional(),

    reportType: Joi.string()

        .valid(

            "executive",

            "telemetry",

            "energy",

            "battery",

            "solar",

            "generator",

            "fuel",

            "alarm",

            "maintenance",

            "reliability",

            "analytics",

            "financial"

        )

        .required(),

    format: Joi.string()

        .valid(

            "pdf",

            "xlsx",

            "csv",

            "json"

        )

        .default("pdf"),

    startDate: Joi.date()
        .required(),

    endDate: Joi.date()
        .greater(Joi.ref("startDate"))
        .required(),

    includeCharts: Joi.boolean()
        .default(true),

    includeRawData: Joi.boolean()
        .default(false)

});

/*
|--------------------------------------------------------------------------
| Export Report
|--------------------------------------------------------------------------
*/

export const exportReportSchema = Joi.object({

    reportId: objectIdSchema,

    format: Joi.string()

        .valid(

            "pdf",

            "xlsx",

            "csv",

            "json"

        )

        .required()

});

/*
|--------------------------------------------------------------------------
| Scheduled Reports
|--------------------------------------------------------------------------
*/

export const scheduledReportSchema = Joi.object({

    reportName: Joi.string()

        .trim()

        .min(3)

        .max(150)

        .required(),

    reportType: Joi.string()

        .required(),

    frequency: Joi.string()

        .valid(

            "daily",

            "weekly",

            "monthly"

        )

        .required(),

    recipients: Joi.array()

        .items(

            Joi.string().email()

        )

        .min(1)

        .required(),

    format: Joi.string()

        .valid(

            "pdf",

            "xlsx",

            "csv"

        )

        .default("pdf"),

    enabled: Joi.boolean()

        .default(true)

});

/*
|--------------------------------------------------------------------------
| Report Query
|--------------------------------------------------------------------------
*/

export const reportQuerySchema = Joi.object({

    page: Joi.number()

        .integer()

        .min(1)

        .default(1),

    limit: Joi.number()

        .integer()

        .min(1)

        .max(100)

        .default(20),

    reportType: Joi.string(),

    format: Joi.string(),

    search: Joi.string()

        .trim()

        .allow(""),

    sortBy: Joi.string()

        .default("createdAt"),

    order: Joi.string()

        .valid(

            "asc",

            "desc"

        )

        .default("desc")

});

/*
|--------------------------------------------------------------------------
| Report Filter
|--------------------------------------------------------------------------
*/

export const reportFilterSchema = Joi.object({

    site: Joi.string()
        .trim()
        .length(24)
        .hex(),

    reportType: Joi.string()
        .valid(

            "ENERGY",

            "BATTERY",

            "SOLAR",

            "GRID",

            "GENERATOR",

            "ALARM",

            "MAINTENANCE",

            "RELIABILITY",

            "EXECUTIVE",

            "CUSTOM"

        ),

    startDate: Joi.date(),

    endDate: Joi.date()

        .min(Joi.ref("startDate")),

    format: Joi.string()

        .valid(

            "JSON",

            "CSV",

            "PDF",

            "EXCEL"

        )

});

/*
|--------------------------------------------------------------------------
| Permission
|--------------------------------------------------------------------------
*/

export const permissionSchema = Joi.object({

    permission: Joi.string()

        .valid(

            "VIEW_REPORT",

            "GENERATE_REPORT",

            "EXPORT_REPORT",

            "DELETE_REPORT"

        )

        .required()

});

/*
|--------------------------------------------------------------------------
| Route Parameters
|--------------------------------------------------------------------------
*/

export const reportIdSchema = Joi.object({

    reportId: objectIdSchema

});

export default {

    generateReportSchema,

    exportReportSchema,

    scheduledReportSchema,

    reportQuerySchema,

    reportIdSchema,

    dateRangeSchema,

    reportFilterSchema,

    permissionSchema

};