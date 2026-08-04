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
| Common Alarm Query
|--------------------------------------------------------------------------
*/

const alarmQuery = Joi.object({

    siteId: objectId.optional(),

    installationId: objectId.optional(),

    severity: Joi.string()

        .valid(

            "CRITICAL",

            "MAJOR",

            "MINOR",

            "WARNING",

            "INFO"

        )

        .optional(),

    status: Joi.string()

        .valid(

            "ACTIVE",

            "ACKNOWLEDGED",

            "RESOLVED"

        )

        .optional(),

    category: Joi.string()

        .trim()

        .allow("")

        .optional(),

    startDate: Joi.date()

        .optional(),

    endDate: Joi.date()

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
| Active Alarm Query
|--------------------------------------------------------------------------
*/

export const activeAlarmValidator = alarmQuery.keys({

    status: Joi.string()

        .valid("ACTIVE")

        .default("ACTIVE")

});

/*
|--------------------------------------------------------------------------
| Alarm History
|--------------------------------------------------------------------------
*/

export const alarmHistoryValidator = alarmQuery;

/*
|--------------------------------------------------------------------------
| Alarm Statistics
|--------------------------------------------------------------------------
*/

export const alarmStatisticsValidator = Joi.object({

    siteId: objectId.optional(),

    installationId: objectId.optional(),

    startDate: Joi.date()

        .optional(),

    endDate: Joi.date()

        .min(Joi.ref("startDate"))

        .optional()

});

/*
|--------------------------------------------------------------------------
| Alarm ID
|--------------------------------------------------------------------------
*/

export const alarmIdValidator = Joi.object({

    alarmId: objectId.required()

});

/*
|--------------------------------------------------------------------------
| Acknowledge Alarm
|--------------------------------------------------------------------------
*/

export const acknowledgeAlarmValidator = Joi.object({

    acknowledgementComment: Joi.string()

        .trim()

        .max(1000)

        .allow("")

        .default("")

});

/*
|--------------------------------------------------------------------------
| Resolve Alarm
|--------------------------------------------------------------------------
*/

export const resolveAlarmValidator = Joi.object({

    resolutionComment: Joi.string()

        .trim()

        .max(1000)

        .allow("")

        .default("")

});

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    activeAlarmValidator,

    alarmHistoryValidator,

    alarmStatisticsValidator,

    alarmIdValidator,

    acknowledgeAlarmValidator,

    resolveAlarmValidator

};