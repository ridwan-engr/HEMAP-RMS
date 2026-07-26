import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| Dispatch Interval
|--------------------------------------------------------------------------
*/

const dispatchSchema = new mongoose.Schema(
    {
        time: {
            type: Number,
            required: true
        },

        timestamp: Date,

        load: {
            type: Number,
            default: 0
        },

        solarUsed: {
            type: Number,
            default: 0
        },

        generatorPower: {
            type: Number,
            default: 0
        },

        gridImport: {
            type: Number,
            default: 0
        },

        gridExport: {
            type: Number,
            default: 0
        },

        batteryCharge: {
            type: Number,
            default: 0
        },

        batteryDischarge: {
            type: Number,
            default: 0
        },

        batterySOC: {
            type: Number,
            default: 0
        },

        generatorStatus: {
            type: Boolean,
            default: false
        }
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| Objective Summary
|--------------------------------------------------------------------------
*/

const objectiveSchema = new mongoose.Schema(
    {
        totalCost: Number,

        gridCost: Number,

        dieselCost: Number,

        batteryCost: Number,

        carbonCost: Number,

        exportRevenue: Number,

        renewablePenalty: Number
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| Energy Summary
|--------------------------------------------------------------------------
*/

const energySchema = new mongoose.Schema(
    {
        load: Number,

        solar: Number,

        generator: Number,

        gridImport: Number,

        gridExport: Number,

        batteryCharge: Number,

        batteryDischarge: Number,

        renewableFraction: Number
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| Emissions
|--------------------------------------------------------------------------
*/

const emissionSchema = new mongoose.Schema(
    {
        co2: Number
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| Reliability
|--------------------------------------------------------------------------
*/

const reliabilitySchema = new mongoose.Schema(
    {
        ens: Number,

        eens: Number,

        lolp: Number,

        lole: Number,

        saidi: Number,

        saifi: Number,

        availability: Number,

        renewableFraction: Number
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| Solver
|--------------------------------------------------------------------------
*/

const solverSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: "highs"
        },

        status: String,

        terminationCondition: String,

        solveTime: Number,

        iterations: Number,

        mipGap: Number,

        objectiveValue: Number
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| Optimization Inputs
|--------------------------------------------------------------------------
*/

const inputSchema = new mongoose.Schema(
    {
        telemetry: mongoose.Schema.Types.Mixed,

        forecast: mongoose.Schema.Types.Mixed,

        tariff: mongoose.Schema.Types.Mixed,

        constraints: mongoose.Schema.Types.Mixed,

        objectives: mongoose.Schema.Types.Mixed,

        solver: mongoose.Schema.Types.Mixed
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| Optimization Run
|--------------------------------------------------------------------------
*/

const optimizationRunSchema = new mongoose.Schema(
    
    {
    
        site: {
    
            type: mongoose.Schema.Types.ObjectId,
    
            ref: "Site",
    
            required: true,
    
            index: true
    
        },

    
        createdBy: {
    
            type: mongoose.Schema.Types.ObjectId,
    
    
            ref: "User"
        },

        runType: {
    
            type: String,
    
            enum: [
    
                "MANUAL",
    
                "AUTO",
    
                "SCHEDULED"
    
            ],
    
            default: "MANUAL"
    
        },

        optimizationPeriod: {
    
            type: String,
    
            enum: [
    
                "HOURLY",
    
                "DAILY",
    
                "WEEKLY",
    
                "MONTHLY"
    
            ],
    
            default: "DAILY"
    
        },

        startDate: Date,

        endDate: Date,

    
        status: {
    
            type: String,
    
            enum: [
    
                "PENDING",
    
                "RUNNING",
    
                "COMPLETED",
    
                "FAILED",
    
                "CANCELLED"
    
            ],
    
            default: "PENDING",
    
            index: true
    
        },

        inputs: inputSchema,

        rawSolverResponse: mongoose.Schema.Types.Mixed,

        dispatchSchedule: [dispatchSchema],

        objectives: objectiveSchema,

        energy: energySchema,

        emissions: emissionSchema,

        reliability: reliabilitySchema,

        solver: solverSchema,

        errorMessage: String
    },
    
    {
    
        timestamps: true
    
    }

);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/


optimizationRunSchema.index({

    site: 1,

    createdAt: -1

});


optimizationRunSchema.index({

    status: 1

});


optimizationRunSchema.index({

    optimizationPeriod: 1

});


optimizationRunSchema.index({

    "solver.status": 1

});


optimizationRunSchema.index({

    createdBy: 1

});


export default mongoose.model(

    "OptimizationRun",

    optimizationRunSchema

);