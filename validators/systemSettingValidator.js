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
| Setting Query
|--------------------------------------------------------------------------
*/

export const systemSettingQueryValidator = Joi.object({

    category: Joi.string()

        .valid(

            "SYSTEM",

            "DATABASE",

            "VRM",

            "SECURITY",

            "MAIL",

            "OPTIMIZATION",

            "NOTIFICATION"

        )

        .optional(),

    editable: Joi.boolean()

        .optional(),

    search: Joi.string()

        .trim()

        .allow("")

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
| Setting Id
|--------------------------------------------------------------------------
*/

export const systemSettingIdValidator = Joi.object({

    id: objectId.required()

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Create Setting
|--------------------------------------------------------------------------
*/

export const createSystemSettingValidator = Joi.object({

    key: Joi.string()

        .trim()

        .min(2)

        .max(100)

        .required(),

    value: Joi.any()

        .required(),

    description: Joi.string()

        .trim()

        .allow("")

        .default(""),

    category: Joi.string()

        .valid(

            "SYSTEM",

            "DATABASE",

            "VRM",

            "SECURITY",

            "MAIL",

            "OPTIMIZATION",

            "NOTIFICATION"

        )

        .default("SYSTEM"),

    editable: Joi.boolean()

        .default(true)

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Update Setting
|--------------------------------------------------------------------------
*/

export const updateSystemSettingValidator = Joi.object({

    key: Joi.string()

        .trim()

        .min(2)

        .max(100)

        .optional(),

    value: Joi.any()

        .optional(),

    description: Joi.string()

        .trim()

        .allow("")

        .optional(),

    category: Joi.string()

        .valid(

            "SYSTEM",

            "DATABASE",

            "VRM",

            "SECURITY",

            "MAIL",

            "OPTIMIZATION",

            "NOTIFICATION"

        )

        .optional(),

    editable: Joi.boolean()

        .optional()

})

.min(1)

.unknown(false);

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    systemSettingQueryValidator,

    systemSettingIdValidator,

    createSystemSettingValidator,

    updateSystemSettingValidator

};