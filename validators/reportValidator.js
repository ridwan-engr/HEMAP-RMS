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
| Report Query
|--------------------------------------------------------------------------
*/

export const reportQueryValidator = Joi.object({

    siteId: objectId.optional(),

    generatedBy: objectId.optional(),

    type: Joi.string()

        .valid(

            "ENERGY",

            "TELEMETRY",

            "ALARM",

            "FAULT",

            "MAINTENANCE",

            "OPTIMIZATION",

            "RELIABILITY",

            "CUSTOM"

        )

        .optional(),

    status: Joi.string()

        .valid(

            "PENDING",

            "GENERATED",

            "FAILED"

        )

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
| Report Id
|--------------------------------------------------------------------------
*/

export const reportIdValidator = Joi.object({

    reportId: objectId.required()

});

/*
|--------------------------------------------------------------------------
| Generate Report
|--------------------------------------------------------------------------
*/

export const generateReportValidator = Joi.object({

    site: objectId.optional(),

    installation: objectId.optional(),

    type: Joi.string()

        .valid(

            "ENERGY",

            "TELEMETRY",

            "ALARM",

            "FAULT",

            "MAINTENANCE",

            "OPTIMIZATION",

            "RELIABILITY",

            "CUSTOM"

        )

        .required(),

    title: Joi.string()

        .trim()

        .min(3)

        .max(200)

        .required(),

    description: Joi.string()

        .trim()

        .allow("")

        .default(""),

    format: Joi.string()

        .valid(

            "PDF",

            "CSV",

            "XLSX",

            "JSON"

        )

        .default("PDF"),

    startDate: Joi.date()

        .iso()

        .required(),

    endDate: Joi.date()

        .iso()

        .min(Joi.ref("startDate"))

        .required(),

    includeCharts: Joi.boolean()

        .default(true),

    includeSummary: Joi.boolean()

        .default(true),

    includeRawData: Joi.boolean()

        .default(false),

    filters: Joi.object()

        .unknown(true)

        .default({})

})

.or("site", "installation");

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    reportQueryValidator,

    reportIdValidator,

    generateReportValidator

};