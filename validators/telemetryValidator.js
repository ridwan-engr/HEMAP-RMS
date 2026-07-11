import Joi from "joi";

/*
|--------------------------------------------------------------------------
| Common Schemas
|--------------------------------------------------------------------------
*/

export const objectIdSchema = Joi.string()
    .trim()
    .length(24)
    .hex()
    .required();

const voltageSchema = Joi.number()
    .min(0)
    .max(1000);

const currentSchema = Joi.number()
    .min(-5000)
    .max(5000);

const powerSchema = Joi.number()
    .min(-500000)
    .max(500000);

const percentageSchema = Joi.number()
    .min(0)
    .max(100);

/*
|--------------------------------------------------------------------------
| Battery
|--------------------------------------------------------------------------
*/

const batterySchema = Joi.object({

    voltage: voltageSchema,

    current: currentSchema,

    power: powerSchema,

    soc: percentageSchema,

    soh: percentageSchema,

    temperature: Joi.number()
        .min(-40)
        .max(120),

    cycles: Joi.number()
        .integer()
        .min(0)

});

/*
|--------------------------------------------------------------------------
| Solar
|--------------------------------------------------------------------------
*/

const solarSchema = Joi.object({

    voltage: voltageSchema,

    current: currentSchema,

    power: powerSchema,

    energyToday: Joi.number().min(0),

    energyTotal: Joi.number().min(0),

    irradiance: Joi.number().min(0).max(2000)

});

/*
|--------------------------------------------------------------------------
| Inverter
|--------------------------------------------------------------------------
*/

const inverterSchema = Joi.object({

    inputVoltage: voltageSchema,

    outputVoltage: voltageSchema,

    outputCurrent: currentSchema,

    outputPower: powerSchema,

    frequency: Joi.number()
        .min(45)
        .max(65),

    efficiency: percentageSchema

});

/*
|--------------------------------------------------------------------------
| Generator
|--------------------------------------------------------------------------
*/

const generatorSchema = Joi.object({

    running: Joi.boolean(),

    voltage: voltageSchema,

    current: currentSchema,

    power: powerSchema,

    fuelLevel: percentageSchema,

    fuelRate: Joi.number().min(0),

    runtimeHours: Joi.number().min(0)

});

/*
|--------------------------------------------------------------------------
| Grid
|--------------------------------------------------------------------------
*/

const gridSchema = Joi.object({

    available: Joi.boolean(),

    voltage: voltageSchema,

    current: currentSchema,

    power: powerSchema,

    frequency: Joi.number()
        .min(45)
        .max(65)

});

/*
|--------------------------------------------------------------------------
| Environment
|--------------------------------------------------------------------------
*/

const environmentSchema = Joi.object({

    ambientTemperature: Joi.number()
        .min(-40)
        .max(80),

    cabinetTemperature: Joi.number()
        .min(-40)
        .max(120),

    humidity: percentageSchema

});

/*
|--------------------------------------------------------------------------
| Telemetry Payload
|--------------------------------------------------------------------------
*/

export const telemetrySchema = Joi.object({

    siteId: objectIdSchema,

    installationId: objectIdSchema,

    timestamp: Joi.date()
        .default(() => new Date()),

    battery: batterySchema,

    solar: solarSchema,

    inverter: inverterSchema,

    generator: generatorSchema,

    grid: gridSchema,

    environment: environmentSchema,

    alarms: Joi.array()
        .items(Joi.string()),

    source: Joi.string()
        .valid(

            "Victron",

            "VRM",

            "Huawei",

            "Modbus",

            "MQTT",

            "Manual",

            "API"

        )
        .required()

});

/*
|--------------------------------------------------------------------------
| Telemetry Query
|--------------------------------------------------------------------------
*/

export const telemetryQuerySchema = Joi.object({

    siteId: Joi.string()
        .hex()
        .length(24),

    installationId: Joi.string()
        .hex()
        .length(24),

    startDate: Joi.date(),

    endDate: Joi.date(),

    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(500)
        .default(100),

    sortBy: Joi.string()
        .default("timestamp"),

    order: Joi.string()
        .valid("asc", "desc")
        .default("desc")

});

/*
|--------------------------------------------------------------------------
| Route Parameters
|--------------------------------------------------------------------------
*/

export const telemetryIdSchema = Joi.object({

    telemetryId: objectIdSchema

});

export default {

    telemetrySchema,

    telemetryQuerySchema,

    telemetryIdSchema

};