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
| Audit Log Query
|--------------------------------------------------------------------------
*/

export const auditLogQuerySchema = Joi.object({

    user: objectId.optional(),

    site: objectId.optional(),

    action: Joi.string()

        .trim()

        .max(100)

        .optional(),

    module: Joi.string()

        .trim()

        .max(100)

        .optional(),

    level: Joi.string()

        .valid(

            "INFO",

            "WARNING",

            "ERROR",

            "CRITICAL"

        )

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

        .default(100),

    sort: Joi.string()

        .valid(

            "asc",

            "desc"

        )

        .default("desc")

});

/*
|--------------------------------------------------------------------------
| Audit Log Id
|--------------------------------------------------------------------------
*/

export const auditLogIdSchema = Joi.object({

    auditLogId: objectId.required()

});

/*
|--------------------------------------------------------------------------
| Create Audit Log
|--------------------------------------------------------------------------
*/

export const createAuditLogSchema = Joi.object({

    user: objectId.required(),

    site: objectId.optional(),

    action: Joi.string()

        .trim()

        .max(100)

        .required(),

    module: Joi.string()

        .trim()

        .max(100)

        .required(),

    description: Joi.string()

        .trim()

        .allow("")

        .default(""),

    level: Joi.string()

        .valid(

            "INFO",

            "WARNING",

            "ERROR",

            "CRITICAL"

        )

        .default("INFO"),

    metadata: Joi.object()

        .unknown(true)

        .default({})

});

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    auditLogQuerySchema,

    auditLogIdSchema,

    createAuditLogSchema

};