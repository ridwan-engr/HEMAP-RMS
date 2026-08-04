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
| Installation ID
|--------------------------------------------------------------------------
*/

export const installationIdValidator = Joi.object({

    id: objectId.required()

});

/*
|--------------------------------------------------------------------------
| Installation Query
|--------------------------------------------------------------------------
*/

export const installationQueryValidator = Joi.object({

    siteId: objectId.optional(),

    customer: Joi.string()

        .trim()

        .optional(),

    type: Joi.string()

        .trim()

        .optional(),

    status: Joi.string()

        .valid(

            "ONLINE",

            "OFFLINE",

            "WARNING",

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

        .max(100)

        .default(20)

});

/*
|--------------------------------------------------------------------------
| Create Installation
|--------------------------------------------------------------------------
*/

export const createInstallationValidator = Joi.object({

    code: Joi.string()

        .trim()

        .max(50)

        .required(),

    name: Joi.string()

        .trim()

        .max(150)

        .required(),

    site: objectId.required(),

    customer: Joi.string()

        .trim()

        .allow("")

        .default(""),

    type: Joi.string()

        .trim()

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

    vrmInstallationId: Joi.string()

        .trim()

        .allow("")

        .default(""),

    status: Joi.string()

        .valid(

            "ONLINE",

            "OFFLINE",

            "WARNING",

            "FAULT",

            "MAINTENANCE"

        )

        .default("ONLINE"),

    commissionedDate: Joi.date()

        .iso()

        .optional(),

    description: Joi.string()

        .trim()

        .allow("")

        .default("")

});

/*
|--------------------------------------------------------------------------
| Update Installation
|--------------------------------------------------------------------------
*/

export const updateInstallationValidator = Joi.object({

    code: Joi.string()

        .trim()

        .max(50)

        .optional(),

    name: Joi.string()

        .trim()

        .max(150)

        .optional(),

    site: objectId.optional(),

    customer: Joi.string()

        .trim()

        .allow("")

        .optional(),

    type: Joi.string()

        .trim()

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

    vrmInstallationId: Joi.string()

        .trim()

        .allow("")

        .optional(),

    status: Joi.string()

        .valid(

            "ONLINE",

            "OFFLINE",

            "WARNING",

            "FAULT",

            "MAINTENANCE"

        )

        .optional(),

    commissionedDate: Joi.date()

        .iso()

        .optional(),

    description: Joi.string()

        .trim()

        .allow("")

        .optional()

}).min(1);

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    installationIdValidator,

    installationQueryValidator,

    createInstallationValidator,

    updateInstallationValidator

};