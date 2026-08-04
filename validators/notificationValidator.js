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
| Notification Query
|--------------------------------------------------------------------------
*/

export const notificationQueryValidator = Joi.object({

    type: Joi.string()

        .valid(

            "INFO",

            "WARNING",

            "SUCCESS",

            "ERROR",

            "SYSTEM"

        )

        .optional(),

    priority: Joi.string()

        .valid(

            "LOW",

            "MEDIUM",

            "HIGH",

            "CRITICAL"

        )

        .optional(),

    read: Joi.boolean()

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
| Notification Id
|--------------------------------------------------------------------------
*/

export const notificationIdValidator = Joi.object({

    notificationId: objectId.required()

});

/*
|--------------------------------------------------------------------------
| Create Notification
|--------------------------------------------------------------------------
*/

export const createNotificationValidator = Joi.object({

    recipient: objectId.required(),

    title: Joi.string()

        .trim()

        .min(3)

        .max(200)

        .required(),

    message: Joi.string()

        .trim()

        .min(3)

        .required(),

    type: Joi.string()

        .valid(

            "INFO",

            "WARNING",

            "SUCCESS",

            "ERROR",

            "SYSTEM"

        )

        .default("INFO"),

    priority: Joi.string()

        .valid(

            "LOW",

            "MEDIUM",

            "HIGH",

            "CRITICAL"

        )

        .default("MEDIUM"),

    actionUrl: Joi.string()

        .uri()

        .allow("")

        .default(""),

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

    notificationQueryValidator,

    notificationIdValidator,

    createNotificationValidator

};