import Joi from "joi";

/*
|--------------------------------------------------------------------------
| Common Enums
|--------------------------------------------------------------------------
*/

const optimizationPeriod = Joi.string().valid(
    "HOURLY",
    "DAILY",
    "WEEKLY",
    "MONTHLY"
);

const runType = Joi.string().valid(
    "MANUAL",
    "AUTO",
    "SCHEDULED"
);

const scenario = Joi.string().valid(
    "NORMAL",
    "GRID_OUTAGE",
    "LOW_SOLAR",
    "PEAK_TARIFF",
    "BATTERY_ONLY",
    "GENERATOR_ONLY",
    "CUSTOM"
);

const solver = Joi.string().valid(
    "highs",
    "cbc",
    "glpk",
    "gurobi",
    "cplex"
);

/*
|--------------------------------------------------------------------------
| Objective Weights
|--------------------------------------------------------------------------
*/

const objectiveWeightsSchema = Joi.object({

    cost: Joi.number()
        .min(0)
        .max(1)
        .default(0.40),

    battery: Joi.number()
        .min(0)
        .max(1)
        .default(0.15),

    emission: Joi.number()
        .min(0)
        .max(1)
        .default(0.15),

    renewable: Joi.number()
        .min(0)
        .max(1)
        .default(0.15),

    reliability: Joi.number()
        .min(0)
        .max(1)
        .default(0.15)

});

/*
|--------------------------------------------------------------------------
| Objectives
|--------------------------------------------------------------------------
*/

const objectiveSchema = Joi.object({

    weights: objectiveWeightsSchema.required()

});

/*
|--------------------------------------------------------------------------
| Battery Constraints
|--------------------------------------------------------------------------
*/

const batterySchema = Joi.object({

    capacity: Joi.number().positive(),

    minimumSOC: Joi.number().min(0).max(100),

    maximumSOC: Joi.number().min(0).max(100),

    initialSOC: Joi.number().min(0).max(100),

    maximumChargePower: Joi.number().min(0),

    maximumDischargePower: Joi.number().min(0),

    chargingEfficiency: Joi.number()
        .min(0)
        .max(1),

    dischargingEfficiency: Joi.number()
        .min(0)
        .max(1)

});

/*
|--------------------------------------------------------------------------
| Generator Constraints
|--------------------------------------------------------------------------
*/

const generatorSchema = Joi.object({

    minimumPower: Joi.number().min(0),

    maximumPower: Joi.number().min(0),

    startupCost: Joi.number().min(0)

});

/*
|--------------------------------------------------------------------------
| Grid Constraints
|--------------------------------------------------------------------------
*/

const gridSchema = Joi.object({

    maximumImport: Joi.number().min(0),

    maximumExport: Joi.number().min(0)

});

/*
|--------------------------------------------------------------------------
| Constraints
|--------------------------------------------------------------------------
*/

const constraintSchema = Joi.object({

    battery: batterySchema,

    generator: generatorSchema,

    grid: gridSchema

});

/*
|--------------------------------------------------------------------------
| Solver
|--------------------------------------------------------------------------
*/

const solverSchema = Joi.object({

    name: solver.default("highs"),

    threads: Joi.number()
        .integer()
        .min(1)
        .max(32)
        .default(4),

    mipGap: Joi.number()
        .min(0)
        .max(1)
        .default(0.01),

    timeLimit: Joi.number()
        .min(10)
        .default(300)

});

/*
|--------------------------------------------------------------------------
| Create Optimization
|--------------------------------------------------------------------------
*/

export const createOptimizationSchema = Joi.object({

    site: Joi.string()
        .hex()
        .length(24)
        .required(),

    runType: runType.default("MANUAL"),

    scenario: scenario.default("NORMAL"),

    optimizationPeriod: optimizationPeriod.default("DAILY"),

    startDate: Joi.date().required(),

    endDate: Joi.date()
        .greater(Joi.ref("startDate"))
        .required(),

    solver: solverSchema.default(),

    objectives: objectiveSchema.default(),

    constraints: constraintSchema.default()

});


/*
|--------------------------------------------------------------------------
| Refresh Optimization
|--------------------------------------------------------------------------
*/

export const refreshOptimizationSchema = Joi.object({

    site: Joi.string()
        .hex()
        .length(24)
        .required(),

    scenario: scenario.default("NORMAL"),

    optimizationPeriod: optimizationPeriod.default("DAILY"),

    startDate: Joi.date().required(),

    endDate: Joi.date()
        .greater(Joi.ref("startDate"))
        .required()

});


/*
|--------------------------------------------------------------------------
| Optimization History
|--------------------------------------------------------------------------
*/

export const historySchema = Joi.object({

    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(20),

    site: Joi.string()
        .hex()
        .length(24),

    status: Joi.string().valid(

        "PENDING",

        "RUNNING",

        "COMPLETED",

        "FAILED",

        "CANCELLED"

    ),

    runType,

    scenario,

    optimizationPeriod

});


/*
|--------------------------------------------------------------------------
| Export Optimization
|--------------------------------------------------------------------------
*/

export const exportOptimizationSchema = Joi.object({

    format: Joi.string()

        .valid(

            "PDF",

            "CSV",

            "JSON",

            "EXCEL"

        )

        .default("PDF")

});


/*
|--------------------------------------------------------------------------
| Cancel Optimization
|--------------------------------------------------------------------------
*/

export const cancelOptimizationSchema = Joi.object({

    id: Joi.string()

        .hex()

        .length(24)

        .required()

});


/*
|--------------------------------------------------------------------------
| Get Optimization By ID
|--------------------------------------------------------------------------
*/

export const optimizationIdSchema = Joi.object({

    id: Joi.string()

        .hex()

        .length(24)

        .required()

});