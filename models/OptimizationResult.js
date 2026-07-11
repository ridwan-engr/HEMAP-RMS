import mongoose from "mongoose";

const optimizationResultSchema = new mongoose.Schema(
    {
        site: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Site",
            required: true
        },

        optimizationDate: {
            type: Date,
            default: Date.now
        },

        objectiveFunction: {
            type: String,
            default: "Minimum ENS"
        },

        optimizationMethod: {
            type: String,
            default: "Pyomo"
        },

        batteryDispatch: Number,

        generatorDispatch: Number,

        solarDispatch: Number,

        gridDispatch: Number,

        renewableFraction: Number,

        batteryEfficiency: Number,

        generatorRuntime: Number,

        fuelConsumption: Number,

        operatingCost: Number,

        co2Emission: Number,

        lolp: Number,

        ens: Number,

        saifi: Number,

        saidi: Number,

        resilienceIndex: Number,

        computationTime: Number,

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

optimizationResultSchema.index({
    site: 1,
    optimizationDate: -1
});

export default mongoose.model(
    "OptimizationResult",
    optimizationResultSchema
);