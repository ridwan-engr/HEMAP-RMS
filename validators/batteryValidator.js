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
| Battery Query
|--------------------------------------------------------------------------
*/

export const batteryQueryValidator = Joi.object({

    siteId: objectId.optional(),

    installationId: objectId.optional(),

    manufacturer: Joi.string()

        .trim()

        .optional(),

    model: Joi.string()

        .trim()

        .optional(),

    chemistry: Joi.string()

        .valid(

            "LEAD_ACID",

            "AGM",

            "GEL",

            "LITHIUM_ION",

            "LFP",

            "NMC",

            "OTHER"

        )

        .optional(),

    status: Joi.string()

        .valid(

            "ONLINE",

            "OFFLINE",

            "FAULT",

            "MAINTENANCE"

        )

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

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Battery Id
|--------------------------------------------------------------------------
*/

export const batteryIdValidator = Joi.object({

    batteryId: objectId.required()

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Create Battery
|--------------------------------------------------------------------------
*/

export const createBatteryValidator = Joi.object({

    site: objectId.required(),

    installation: objectId.required(),

    name: Joi.string()

        .trim()

        .min(2)

        .max(150)

        .required(),

    manufacturer: Joi.string()

        .trim()

        .allow("")

        .default(""),

    model: Joi.string()

        .trim()

        .allow("")

        .default(""),

    serialNumber: Joi.string()

        .trim()

        .allow("")

        .default(""),

    chemistry: Joi.string()

        .valid(

            "LEAD_ACID",

            "AGM",

            "GEL",

            "LITHIUM_ION",

            "LFP",

            "NMC",

            "OTHER"

        )

        .required(),

    capacityAh: Joi.number()

        .positive()

        .required(),

    nominalVoltage: Joi.number()

        .positive()

        .required(),

    maximumVoltage: Joi.number()

        .positive()

        .optional(),

    minimumVoltage: Joi.number()

        .positive()

        .optional(),

    manufactureDate: Joi.date()

        .optional(),

    installationDate: Joi.date()

        .optional(),

    status: Joi.string()

        .valid(

            "ONLINE",

            "OFFLINE",

            "FAULT",

            "MAINTENANCE"

        )

        .default("ONLINE"),

    remarks: Joi.string()

        .trim()

        .allow("")

        .default("")

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Update Battery
|--------------------------------------------------------------------------
*/

export const updateBatteryValidator = Joi.object({

    name: Joi.string()

        .trim()

        .min(2)

        .max(150)

        .optional(),

    manufacturer: Joi.string()

        .trim()

        .allow("")

        .optional(),

    model: Joi.string()

        .trim()

        .allow("")

        .optional(),

    serialNumber: Joi.string()

        .trim()

        .allow("")

        .optional(),

    chemistry: Joi.string()

        .valid(

            "LEAD_ACID",

            "AGM",

            "GEL",

            "LITHIUM_ION",

            "LFP",

            "NMC",

            "OTHER"

        )

        .optional(),

    capacityAh: Joi.number()

        .positive()

        .optional(),

    nominalVoltage: Joi.number()

        .positive()

        .optional(),

    maximumVoltage: Joi.number()

        .positive()

        .optional(),

    minimumVoltage: Joi.number()

        .positive()

        .optional(),

    manufactureDate: Joi.date()

        .optional(),

    installationDate: Joi.date()

        .optional(),

    status: Joi.string()

        .valid(

            "ONLINE",

            "OFFLINE",

            "FAULT",

            "MAINTENANCE"

        )

        .optional(),

    remarks: Joi.string()

        .trim()

        .allow("")

        .optional()

})

.min(1)

.unknown(false);

/*
|--------------------------------------------------------------------------
| Battery Status Update
|--------------------------------------------------------------------------
*/

export const batteryStatusValidator = Joi.object({

    status: Joi.string()

        .valid(

            "ONLINE",

            "OFFLINE",

            "FAULT",

            "MAINTENANCE"

        )

        .required(),

    remarks: Joi.string()

        .trim()

        .allow("")

        .default("")

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    batteryQueryValidator,

    batteryIdValidator,

    createBatteryValidator,

    updateBatteryValidator,

    batteryStatusValidator

};