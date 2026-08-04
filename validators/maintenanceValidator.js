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

const maintenanceQuery = Joi.object({

    siteId: objectId.optional(),

    installationId: objectId.optional(),

    assignedTo: objectId.optional(),

    status: Joi.string()

        .valid(

            "SCHEDULED",

            "IN_PROGRESS",

            "COMPLETED",

            "CANCELLED"

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
| Schedule
|--------------------------------------------------------------------------
*/

export const maintenanceScheduleValidator = maintenanceQuery;

/*
|--------------------------------------------------------------------------
| History
|--------------------------------------------------------------------------
*/

export const maintenanceHistoryValidator = maintenanceQuery;

/*
|--------------------------------------------------------------------------
| Maintenance Id
|--------------------------------------------------------------------------
*/

export const maintenanceIdValidator = Joi.object({

    maintenanceId: objectId.required()

});

/*
|--------------------------------------------------------------------------
| Create Maintenance
|--------------------------------------------------------------------------
*/

export const createMaintenanceValidator = Joi.object({

    site: objectId.required(),

    installation: objectId.required(),

    assignedTo: objectId.optional(),

    title: Joi.string()

        .trim()

        .min(3)

        .max(200)

        .required(),

    description: Joi.string()

        .trim()

        .allow("")

        .default(""),

    category: Joi.string()

        .trim()

        .required(),

    priority: Joi.string()

        .valid(

            "LOW",

            "MEDIUM",

            "HIGH",

            "CRITICAL"

        )

        .default("MEDIUM"),

    scheduledDate: Joi.date()

        .iso()

        .required(),

    estimatedDuration: Joi.number()

        .integer()

        .positive()

        .optional(),

    workPerformed: Joi.string()

        .trim()

        .allow("")

        .default(""),

    remarks: Joi.string()

        .trim()

        .allow("")

        .default("")

});

/*
|--------------------------------------------------------------------------
| Update Maintenance
|--------------------------------------------------------------------------
*/

export const updateMaintenanceValidator = Joi.object({

    assignedTo: objectId.optional(),

    title: Joi.string()

        .trim()

        .min(3)

        .max(200)

        .optional(),

    description: Joi.string()

        .trim()

        .allow("")

        .default(""),

    category: Joi.string()

        .trim()

        .optional(),

    priority: Joi.string()

        .valid(

            "LOW",

            "MEDIUM",

            "HIGH",

            "CRITICAL"

        )

        .optional(),

    status: Joi.string()

        .valid(

            "SCHEDULED",

            "IN_PROGRESS",

            "COMPLETED",

            "CANCELLED"

        )

        .optional(),

    scheduledDate: Joi.date()

        .iso()

        .optional(),

    estimatedDuration: Joi.number()

        .integer()

        .positive()

        .optional(),

    workPerformed: Joi.string()

        .trim()

        .allow("")

        .default(""),

    remarks: Joi.string()

        .trim()

        .allow("")

        .optional()

}).min(1);

/*
|--------------------------------------------------------------------------
| Complete Maintenance
|--------------------------------------------------------------------------
*/

export const completeMaintenanceValidator = Joi.object({

    workPerformed: Joi.string()

        .trim()

        .required(),

    completionRemark: Joi.string()

        .trim()

        .allow("")

        .default(""),

    duration: Joi.number()

        .integer()

        .positive()

        .optional(),

    partsUsed: Joi.array()

        .items(

            Joi.string().trim()

        )

        .default([])

});

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    maintenanceScheduleValidator,

    maintenanceHistoryValidator,

    maintenanceIdValidator,

    createMaintenanceValidator,

    updateMaintenanceValidator,

    completeMaintenanceValidator

};