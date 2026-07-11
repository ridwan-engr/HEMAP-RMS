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
| Solar PV
|--------------------------------------------------------------------------
*/

const solarSchema = Joi.object({

    capacity: Joi.number()
        .min(0)
        .required(),

    moduleCount: Joi.number()
        .integer()
        .min(0)
        .default(0),

    moduleRating: Joi.number()
        .min(0)
        .default(0),

    manufacturer: Joi.string()
        .trim()
        .allow(""),

    model: Joi.string()
        .trim()
        .allow("")

});

/*
|--------------------------------------------------------------------------
| Battery Bank
|--------------------------------------------------------------------------
*/

const batterySchema = Joi.object({

    chemistry: Joi.string()
        .valid(

            "Lithium",

            "Lead Acid",

            "AGM",

            "Gel",

            "LFP",

            "Other"

        )
        .required(),

    nominalVoltage: Joi.number()
        .min(0)
        .required(),

    capacityAh: Joi.number()
        .min(0)
        .required(),

    numberOfStrings: Joi.number()
        .integer()
        .min(1)
        .default(1),

    manufacturer: Joi.string()
        .trim()
        .allow(""),

    model: Joi.string()
        .trim()
        .allow("")

});

/*
|--------------------------------------------------------------------------
| Inverter
|--------------------------------------------------------------------------
*/

const inverterSchema = Joi.object({

    rating: Joi.number()
        .min(0)
        .required(),

    manufacturer: Joi.string()
        .trim()
        .allow(""),

    model: Joi.string()
        .trim()
        .allow(""),

    phase: Joi.string()
        .valid(

            "Single",

            "Three"

        )
        .default("Single")

});

/*
|--------------------------------------------------------------------------
| Generator
|--------------------------------------------------------------------------
*/

const generatorSchema = Joi.object({

    rating: Joi.number()
        .min(0)
        .required(),

    fuelType: Joi.string()
        .valid(

            "Diesel",

            "Gas",

            "Petrol"

        )
        .required(),

    manufacturer: Joi.string()
        .trim()
        .allow(""),

    model: Joi.string()
        .trim()
        .allow("")

});

/*
|--------------------------------------------------------------------------
| Rectifier
|--------------------------------------------------------------------------
*/

const rectifierSchema = Joi.object({

    rating: Joi.number()
        .min(0)
        .default(0),

    manufacturer: Joi.string()
        .trim()
        .allow(""),

    model: Joi.string()
        .trim()
        .allow("")

});

/*
|--------------------------------------------------------------------------
| Installation
|--------------------------------------------------------------------------
*/

export const createInstallationSchema = Joi.object({

    siteId: objectIdSchema,

    installationName: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .required(),

    installationType: Joi.string()
        .valid(

            "Hybrid",

            "Solar",

            "Grid",

            "Generator",

            "Battery",

            "OffGrid"

        )
        .required(),

    solar: solarSchema.optional(),

    battery: batterySchema.optional(),

    inverter: inverterSchema.optional(),

    generator: generatorSchema.optional(),

    rectifier: rectifierSchema.optional(),

    commissioningDate: Joi.date(),

    status: Joi.string()
        .valid(

            "Operational",

            "Maintenance",

            "Offline",

            "Fault"

        )
        .default("Operational"),

    remarks: Joi.string()
        .trim()
        .allow("")

});

/*
|--------------------------------------------------------------------------
| Update Installation
|--------------------------------------------------------------------------
*/

export const updateInstallationSchema = Joi.object({

    installationName: Joi.string()
        .trim()
        .min(2)
        .max(150),

    installationType: Joi.string()
        .valid(

            "Hybrid",

            "Solar",

            "Grid",

            "Generator",

            "Battery",

            "OffGrid"

        ),

    solar: solarSchema,

    battery: batterySchema,

    inverter: inverterSchema,

    generator: generatorSchema,

    rectifier: rectifierSchema,

    commissioningDate: Joi.date(),

    status: Joi.string()
        .valid(

            "Operational",

            "Maintenance",

            "Offline",

            "Fault"

        ),

    remarks: Joi.string()
        .trim()
        .allow("")

}).min(1);

/*
|--------------------------------------------------------------------------
| Route Parameters
|--------------------------------------------------------------------------
*/

export const installationIdSchema = Joi.object({

    installationId: objectIdSchema

});

/*
|--------------------------------------------------------------------------
| Query Parameters
|--------------------------------------------------------------------------
*/

export const installationQuerySchema = Joi.object({

    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(20),

    siteId: Joi.string()
        .hex()
        .length(24),

    installationType: Joi.string(),

    status: Joi.string(),

    search: Joi.string()
        .allow(""),

    sortBy: Joi.string()
        .default("createdAt"),

    order: Joi.string()
        .valid("asc", "desc")
        .default("desc")

});

/*
|--------------------------------------------------------------------------
| Update Installation Status
|--------------------------------------------------------------------------
*/

export const installationStatusSchema = Joi.object({

    status: Joi.string()
        .valid(

            "Operational",

            "Maintenance",

            "Offline",

            "Fault"

        )
        .required()

});

export default {

    createInstallationSchema,

    updateInstallationSchema,

    installationIdSchema,

    installationQuerySchema,

    installationStatusSchema

};