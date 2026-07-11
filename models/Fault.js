import mongoose from "mongoose";

const faultSchema = new mongoose.Schema(
{
    site: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Site",
        required: true,
        index: true
    },

    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device"
    },

    faultCode: {
        type: String,
        required: true
    },

    title: String,

    description: String,

    category: {
        type: String,
        enum: [
            "SOLAR",
            "BATTERY",
            "GENERATOR",
            "GRID",
            "INVERTER",
            "COMMUNICATION",
            "SYSTEM"
        ],
        default: "SYSTEM"
    },

    severity: {
        type: String,
        enum: [
            "LOW",
            "MEDIUM",
            "HIGH",
            "CRITICAL"
        ],
        default: "MEDIUM"
    },

    status: {
        type: String,
        enum: [
            "OPEN",
            "ASSIGNED",
            "IN_PROGRESS",
            "RESOLVED",
            "CLOSED"
        ],
        default: "OPEN"
    },

    detectedAt: {
        type: Date,
        default: Date.now
    },

    resolvedAt: Date,

    rootCause: String,

    correctiveAction: String,

    downtimeMinutes: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
}
);

faultSchema.index({
    site: 1,
    status: 1
});

export default mongoose.model(
    "Fault",
    faultSchema
);