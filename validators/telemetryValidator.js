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
| Common Query
|--------------------------------------------------------------------------
*/

const telemetryQuery = {

    installationId: Joi.number()

        .integer()

        .positive()

        .optional(),

    site: objectId.optional(),

    startDate: Joi.date()

        .iso()

        .optional(),

    endDate: Joi.date()

        .iso()

        .min(Joi.ref("startDate"))

        .optional(),

    interval: Joi.string()

        .valid(

            "15mins",

            "30mins",

            "hour",

            "6hours",

            "12hours",

            "day",

            "week",

            "month"

        )

        .default("15mins"),

    page: Joi.number()

        .integer()

        .min(1)

        .default(1),

    limit: Joi.number()

        .integer()

        .min(1)

        .max(1000)

        .default(200),

    sort: Joi.string()

        .valid(

            "asc",

            "desc"

        )

        .default("desc")

};

/*
|--------------------------------------------------------------------------
| Telemetry Query
|--------------------------------------------------------------------------
*/

export const telemetryQueryValidator = Joi.object({

    ...telemetryQuery

}).unknown(false);

/*
|--------------------------------------------------------------------------
| Telemetry History
|--------------------------------------------------------------------------
*/

export const telemetryHistoryValidator = Joi.object({

    installationId: Joi.number()

        .integer()

        .positive()

        .required(),

    startDate: Joi.date()

        .iso()

        .required(),

    endDate: Joi.date()

        .iso()

        .min(Joi.ref("startDate"))

        .required(),

    interval: Joi.string()

        .valid(

            "15mins",

            "30mins",

            "hour",

            "6hours",

            "12hours",

            "day",

            "week",

            "month"

        )

        .default("15mins"),

    page: Joi.number()

        .integer()

        .min(1)

        .default(1),

    limit: Joi.number()

        .integer()

        .min(1)

        .max(1000)

        .default(200),

    sort: Joi.string()

        .valid(

            "asc",

            "desc"

        )

        .default("desc")

}).unknown(false);

/*
|--------------------------------------------------------------------------
| Installation Parameter
|--------------------------------------------------------------------------
*/

export const installationTelemetryValidator = Joi.object({

    installationId: Joi.number()

        .integer()

        .positive()

        .required()

}).unknown(false);

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    telemetryQueryValidator,

    telemetryHistoryValidator,

    installationTelemetryValidator

};