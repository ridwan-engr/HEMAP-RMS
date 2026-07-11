import mongoose from "mongoose";

const alarmSchema = new mongoose.Schema(
    {
        site: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Site",
            required: true,
            index: true
        },

        vrmAlarmId: {
            type: String,
            required: true,
            index: true
        },

        name: String,

        category: String,

        severity: {
            type: String,
            enum: [
                "INFO",
                "WARNING",
                "CRITICAL"
            ],
            default: "WARNING"
        },

        message: String,

        status: {
            type: String,
            enum: [
                "ACTIVE",
                "ACKNOWLEDGED",
                "RESOLVED"
            ],
            default: "ACTIVE"
        },

        startedAt: Date,

        resolvedAt: Date
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "Alarm",
    alarmSchema
);