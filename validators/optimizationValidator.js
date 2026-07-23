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
    "SCHEDULED",
    "AUTO"
);

const solver = Joi.string().valid(
    "HIGHS",
    "CBC",
    "GLPK",
    "GUROBI",
    "CPLEX"
);

/*
|--------------------------------------------------------------------------
| Objective Function
|--------------------------------------------------------------------------
*/

const objectiveSchema = Joi.object({

    minimizeCost: Joi.boolean().default(true),

    minimizeFuel: Joi.boolean().default(false),

    minimizeEmission: Joi.boolean().default(false),

    maximizeRenewable: Joi.boolean().default(false),

    maximizeBatteryLife: Joi.boolean().default(false),

    maximizeReliability: Joi.boolean().default(false)

});

/*
|--------------------------------------------------------------------------
| Constraints
|--------------------------------------------------------------------------
*/

const constraintSchema = Joi.object({

    minimumSOC: Joi.number().min(0).max(100),

    maximumSOC: Joi.number().min(0).max(100),

    reserveSOC: Joi.number().min(0).max(100),

    maximumGeneratorPower: Joi.number().min(0),

    maximumGridImport: Joi.number().min(0),

    maximumGridExport: Joi.number().min(0),

    renewableTarget: Joi.number().min(0).max(100),

    maximumENS: Joi.number().min(0),

    maximumLOLP: Joi.number().min(0),

    maximumCO2: Joi.number().min(0)

});

/*
|--------------------------------------------------------------------------
| Create Optimization Run
|--------------------------------------------------------------------------
*/

export const createOptimizationSchema = Joi.object({

    site: Joi.string()
        .hex()
        .length(24)
        .required(),

    runType: runType.default("MANUAL"),

    optimizationPeriod: optimizationPeriod.required(),

    startDate: Joi.date().required(),

    endDate: Joi.date()
        .greater(Joi.ref("startDate"))
        .required(),

    solver: solver.default("HIGHS"),

    objectives: objectiveSchema.required(),

    constraints: constraintSchema.required()

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

    optimizationPeriod: optimizationPeriod.required(),

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

    optimizationPeriod,

    runType,

    solver

});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export const exportOptimizationSchema = Joi.object({

    optimizationId: Joi.string()
        .hex()
        .length(24)
        .required(),

    format: Joi.string()
        .valid(
            "PDF",
            "EXCEL",
            "CSV",
            "JSON"
        )
        .default("PDF")

});

/*
|--------------------------------------------------------------------------
| Cancel Run
|--------------------------------------------------------------------------
*/

export const cancelOptimizationSchema = Joi.object({

    optimizationId: Joi.string()
        .hex()
        .length(24)
        .required()

});