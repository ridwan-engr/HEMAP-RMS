import mongoose from "mongoose";

const optimizationResultSchema = new mongoose.Schema(
    {
        /*
        |------------------------------------------------------------------
        | Site
        |------------------------------------------------------------------
        */

        site: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Site",
            required: true,
            index: true
        },

        /*
        |------------------------------------------------------------------
        | Optimization Metadata
        |------------------------------------------------------------------
        */

        optimizationDate: {
            type: Date,
            default: Date.now,
            index: true
        },

        objectiveFunction: {
            type: String,
            default: "Minimum ENS"
        },

        objectiveValue: {
            type: Number,
            default: 0
        },

        optimizationMethod: {
            type: String,
            default: "Pyomo"
        },

        /*
        |------------------------------------------------------------------
        | Dispatch Results
        |------------------------------------------------------------------
        */

        batteryDispatch: {
            type: Number,
            default: 0
        },

        generatorDispatch: {
            type: Number,
            default: 0
        },

        solarDispatch: {
            type: Number,
            default: 0
        },

        gridDispatch: {
            type: Number,
            default: 0
        },

        /*
        |------------------------------------------------------------------
        | Optimization Metrics
        |------------------------------------------------------------------
        */

        renewableFraction: {
            type: Number,
            default: 0
        },

        batteryEfficiency: {
            type: Number,
            default: 0
        },

        generatorRuntime: {
            type: Number,
            default: 0
        },

        fuelConsumption: {
            type: Number,
            default: 0
        },

        operatingCost: {
            type: Number,
            default: 0
        },

        co2Emission: {
            type: Number,
            default: 0
        },

        /*
        |------------------------------------------------------------------
        | Reliability Metrics
        |------------------------------------------------------------------
        */

        lolp: {
            type: Number,
            default: 0
        },

        ens: {
            type: Number,
            default: 0
        },

        saifi: {
            type: Number,
            default: 0
        },

        saidi: {
            type: Number,
            default: 0
        },

        resilienceIndex: {
            type: Number,
            default: 0
        },

        /*
        |------------------------------------------------------------------
        | Computation
        |------------------------------------------------------------------
        */

        computationTime: {
            type: Number,
            default: 0
        },

        /*
        |------------------------------------------------------------------
        | Optimization Constraints
        |------------------------------------------------------------------
        */

        constraints: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        /*
        |------------------------------------------------------------------
        | Status
        |------------------------------------------------------------------
        */

        status: {
            type: String,

            enum: [
                "SUCCESS",
                "FAILED",
                "RUNNING"
            ],

            default: "SUCCESS"
        }
    },

    {
        timestamps: true
    }
);

/*
|----------------------------------------------------------------------
| Index
|----------------------------------------------------------------------
*/

optimizationResultSchema.index({
    site: 1,
    optimizationDate: -1
});

export default mongoose.model(
    "OptimizationResult",
    optimizationResultSchema
);