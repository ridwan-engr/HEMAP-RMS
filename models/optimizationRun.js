import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| Dispatch Schedule
|--------------------------------------------------------------------------
*/

const dispatchSchema = new mongoose.Schema(
    {
        timestamp: {
            type: Date,
            required: true
        },

        solar: {
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

        generator: {
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

        load: {
            type: Number,
            default: 0
        },

        batterySOC: {
            type: Number,
            default: 0
        },

        dispatchSchedule: {
            type: Array,
            default: []
        },
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| Objective Results
|--------------------------------------------------------------------------
*/

const objectiveSchema = new mongoose.Schema(
    {
        operatingCost: {
            type: Number,
            default: 0
        },

        fuelCost: {
            type: Number,
            default: 0
        },

        gridCost: {
            type: Number,
            default: 0
        },

        batteryCost: {
            type: Number,
            default: 0
        },

        emissionCost: {
            type: Number,
            default: 0
        },

        totalCost: {
            type: Number,
            default: 0
        }
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| Reliability Results
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
| Solver Information
|--------------------------------------------------------------------------
*/

const solverSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: "HiGHS"
        },

        status: String,

        terminationCondition: String,

        runtime: Number,

        iterations: Number,

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
        weatherForecast: mongoose.Schema.Types.Mixed,

        loadForecast: mongoose.Schema.Types.Mixed,

        batteryParameters: mongoose.Schema.Types.Mixed,

        generatorParameters: mongoose.Schema.Types.Mixed,

        tariff: mongoose.Schema.Types.Mixed,

        constraints: mongoose.Schema.Types.Mixed
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

                "SCHEDULED",

                "AUTO"

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

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        inputs: inputSchema,

        dispatchSchedule: [

            dispatchSchema

        ],

        objectives: objectiveSchema,

        reliability: reliabilitySchema,

        solver: solverSchema,

        energy: {
            type: mongoose.Schema.Types.Mixed
        },


        status: {
            type: String,
            enum: [

                "PENDING",

                "RUNNING",

                "COMPLETED",

                "FAILED",

                "CANCELLED"

            ],
            default: "PENDING"
        },

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

export default mongoose.model(

    "OptimizationRun",

    optimizationRunSchema

);