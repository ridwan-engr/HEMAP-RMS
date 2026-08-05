import mongoose from "mongoose";

const statisticsSchema = new mongoose.Schema(
    {
        site: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Site",
            required: true,
            index: true
        },

        installation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Installation",
            required: true
        },

        installationId: Number,

        period: {
            type: String,
            enum: [
                "HOURLY",
                "DAILY",
                "MONTHLY",
                "YEARLY"
            ],
            required: true
        },

        timestamp: {
            type: Date,
            required: true
        },

        energyGenerated: {
            type: Number,
            default: 0
        },

        energyConsumed: {
            type: Number,
            default: 0
        },

        gridAvailability: {
            type: Number,
            default: 0
        },

        batteryEfficiency: {
            type: Number,
            default: 0
        },

        renewableFraction: {
            type: Number,
            default: 0
        },

        generatorRuntime: {
            type: Number,
            default: 0
        },

        saidi: {
            type: Number,
            default: 0
        },

        saifi: {
            type: Number,
            default: 0
        },

        ens: {
            type: Number,
            default: 0
        },

        lolp: {
            type: Number,
            default: 0
        },

        resilience: {
            type: Number,
            default: 0
        },

        batterySOC: Number,
        batteryVoltage: Number,
        batteryCurrent: Number,
        solarPower: Number,
        loadPower: Number,
        gridPower: Number,
        generatorPower: Number,
        inverterPower: Number
    },
    {
        timestamps: true
    }
);

statisticsSchema.index({
    site: 1,
    period: 1,
    timestamp: -1
});

export default mongoose.model(
    "Statistics",
    statisticsSchema
);