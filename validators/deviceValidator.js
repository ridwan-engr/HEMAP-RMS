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
| Device Query
|--------------------------------------------------------------------------
*/

export const deviceQueryValidator = Joi.object({

    siteId: objectId.optional(),

    type: Joi.string()

        .valid(

            "GX",

            "INVERTER",

            "SOLAR_CHARGER",

            "BATTERY_MONITOR",

            "GENERATOR_CONTROLLER",

            "GRID_METER",

            "SENSOR",

            "OTHER"

        )

        .optional(),

    status: Joi.string()

        .valid(

            "ONLINE",

            "OFFLINE",

            "WARNING",

            "FAULT"

        )

        .optional(),

    manufacturer: Joi.string()

        .trim()

        .optional(),

    model: Joi.string()

        .trim()

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
| Device Id
|--------------------------------------------------------------------------
*/

export const deviceIdValidator = Joi.object({

    deviceId: objectId.required()

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Create Device
|--------------------------------------------------------------------------
*/

export const createDeviceValidator = Joi.object({

    site: objectId.required(),

    deviceId: Joi.string()

        .trim()

        .min(2)

        .max(100)

        .required(),

    serialNumber: Joi.string()

        .trim()

        .allow("")

        .default(""),

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

    firmwareVersion: Joi.string()

        .trim()

        .allow("")

        .default(""),

    hardwareVersion: Joi.string()

        .trim()

        .allow("")

        .default(""),

    type: Joi.string()

        .valid(

            "GX",

            "INVERTER",

            "SOLAR_CHARGER",

            "BATTERY_MONITOR",

            "GENERATOR_CONTROLLER",

            "GRID_METER",

            "SENSOR",

            "OTHER"

        )

        .required(),

    ipAddress: Joi.string()

        .ip({

            version: [

                "ipv4",

                "ipv6"

            ]

        })

        .allow("")

        .optional(),

    macAddress: Joi.string()

        .trim()

        .pattern(

            /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/

        )

        .allow("")

        .messages({

            "string.pattern.base": "Invalid MAC address."

        })

        .optional(),

    status: Joi.string()

        .valid(

            "ONLINE",

            "OFFLINE",

            "WARNING",

            "FAULT"

        )

        .default("ONLINE"),

    lastCommunication: Joi.date()

        .optional(),

    installationDate: Joi.date()

        .optional()

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Update Device
|--------------------------------------------------------------------------
*/

export const updateDeviceValidator = Joi.object({

    serialNumber: Joi.string()

        .trim()

        .allow("")

        .optional(),

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

    firmwareVersion: Joi.string()

        .trim()

        .allow("")

        .optional(),

    hardwareVersion: Joi.string()

        .trim()

        .allow("")

        .optional(),

    type: Joi.string()

        .valid(

            "GX",

            "INVERTER",

            "SOLAR_CHARGER",

            "BATTERY_MONITOR",

            "GENERATOR_CONTROLLER",

            "GRID_METER",

            "SENSOR",

            "OTHER"

        )

        .optional(),

    ipAddress: Joi.string()

        .ip({

            version: [

                "ipv4",

                "ipv6"

            ]

        })

        .allow("")

        .optional(),

    macAddress: Joi.string()

        .trim()

        .pattern(

            /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/

        )

        .allow("")

        .optional(),

    status: Joi.string()

        .valid(

            "ONLINE",

            "OFFLINE",

            "WARNING",

            "FAULT"

        )

        .optional(),

    lastCommunication: Joi.date()

        .optional(),

    installationDate: Joi.date()

        .optional()

})

.min(1)

.unknown(false);

/*
|--------------------------------------------------------------------------
| Device Status
|--------------------------------------------------------------------------
*/

export const deviceStatusValidator = Joi.object({

    status: Joi.string()

        .valid(

            "ONLINE",

            "OFFLINE",

            "WARNING",

            "FAULT"

        )

        .required()

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    deviceQueryValidator,

    deviceIdValidator,

    createDeviceValidator,

    updateDeviceValidator,

    deviceStatusValidator

};