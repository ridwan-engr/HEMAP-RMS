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
| Email
|--------------------------------------------------------------------------
*/

export const sendEmailSchema = Joi.object({

    to: Joi.array()
        .items(Joi.string().email())
        .min(1)
        .required(),

    cc: Joi.array()
        .items(Joi.string().email())
        .default([]),

    bcc: Joi.array()
        .items(Joi.string().email())
        .default([]),

    subject: Joi.string()
        .trim()
        .max(255)
        .required(),

    text: Joi.string()
        .allow("")
        .optional(),

    html: Joi.string()
        .allow("")
        .optional(),

    attachments: Joi.array()
        .items(Joi.object())
        .default([])

}).or("text", "html");

/*
|--------------------------------------------------------------------------
| SMS
|--------------------------------------------------------------------------
*/

export const sendSMSSchema = Joi.object({

    to: Joi.array()
        .items(Joi.string())
        .min(1)
        .required(),

    message: Joi.string()
        .max(1000)
        .required()

});

/*
|--------------------------------------------------------------------------
| OTP
|--------------------------------------------------------------------------
*/

export const sendOTPSchema = Joi.object({

    phoneNumber: Joi.string()
        .trim()
        .required()

});

export const verifyOTPSchema = Joi.object({

    phoneNumber: Joi.string()
        .trim()
        .required(),

    code: Joi.string()
        .trim()
        .required()

});

/*
|--------------------------------------------------------------------------
| Alarm Notification
|--------------------------------------------------------------------------
*/

export const alarmNotificationSchema = Joi.object({

    siteId: objectIdSchema,

    installationId: Joi.string()
        .hex()
        .length(24)
        .optional(),

    severity: Joi.string()
        .valid(

            "info",

            "warning",

            "critical"

        )
        .required(),

    alarmType: Joi.string()
        .required(),

    title: Joi.string()
        .required(),

    message: Joi.string()
        .required(),

    timestamp: Joi.date()
        .default(() => new Date())

});

/*
|--------------------------------------------------------------------------
| Maintenance Notification
|--------------------------------------------------------------------------
*/

export const maintenanceNotificationSchema = Joi.object({

    siteId: objectIdSchema,

    title: Joi.string()
        .required(),

    message: Joi.string()
        .required(),

    scheduledDate: Joi.date()
        .required()

});

/*
|--------------------------------------------------------------------------
| Push Notification
|--------------------------------------------------------------------------
*/

export const pushNotificationSchema = Joi.object({

    title: Joi.string()
        .required(),

    message: Joi.string()
        .required(),

    topic: Joi.string()
        .allow("")
        .optional(),

    tokens: Joi.array()
        .items(Joi.string())
        .default([]),

    data: Joi.object()
        .default({})

});

/*
|--------------------------------------------------------------------------
| Notification Preferences
|--------------------------------------------------------------------------
*/

export const notificationPreferenceSchema = Joi.object({

    email: Joi.boolean(),

    sms: Joi.boolean(),

    push: Joi.boolean(),

    criticalOnly: Joi.boolean(),

    dailySummary: Joi.boolean(),

    weeklyReport: Joi.boolean()

}).min(1);

/*
|--------------------------------------------------------------------------
| Notification Template
|--------------------------------------------------------------------------
*/

export const notificationTemplateSchema = Joi.object({

    name: Joi.string()
        .required(),

    subject: Joi.string()
        .allow("")
        .optional(),

    body: Joi.string()
        .required(),

    channel: Joi.string()
        .valid(

            "email",

            "sms",

            "push"

        )
        .required()

});

/*
|--------------------------------------------------------------------------
| Escalation Rules
|--------------------------------------------------------------------------
*/

export const escalationRuleSchema = Joi.object({

    severity: Joi.string()
        .valid(

            "info",

            "warning",

            "critical"

        )
        .required(),

    delayMinutes: Joi.number()
        .min(0)
        .required(),

    recipients: Joi.array()
        .items(Joi.string())
        .min(1)
        .required()

});

/*
|--------------------------------------------------------------------------
| Route Parameters
|--------------------------------------------------------------------------
*/

export const notificationIdSchema = Joi.object({

    notificationId: objectIdSchema

});

export const userIdSchema = Joi.object({

    userId: objectIdSchema

});

export const templateIdSchema = Joi.object({

    templateId: objectIdSchema

});

export default {

    sendEmailSchema,

    sendSMSSchema,

    sendOTPSchema,

    verifyOTPSchema,

    alarmNotificationSchema,

    maintenanceNotificationSchema,

    pushNotificationSchema,

    notificationPreferenceSchema,

    notificationTemplateSchema,

    escalationRuleSchema,

    notificationIdSchema,

    userIdSchema,

    templateIdSchema

};