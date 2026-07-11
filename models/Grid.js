import mongoose from "mongoose";

const gridSchema = new mongoose.Schema(
    {
        site: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Site",
            required: true,
            index: true
        },

        utilityName: String,

        voltage: Number,

        current: Number,

        frequency: Number,

        power: Number,

        importedEnergy: Number,

        exportedEnergy: Number,

        availability: Number,

        outageCount: {
            type: Number,
            default: 0
        },

        outageDuration: {
            type: Number,
            default: 0
        },

        SAIDI: {
            type: Number,
            default: 0
        },

        SAIFI: {
            type: Number,
            default: 0
        },

        ENS: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: [
                "AVAILABLE",
                "OUTAGE",
                "UNSTABLE"
            ],
            default: "AVAILABLE"
        },

        lastAvailable: Date,

        lastOutage: Date
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "Grid",
    gridSchema
);