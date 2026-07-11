import mongoose from "mongoose";

const systemSettingSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        value: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },

        description: {
            type: String,
            trim: true
        },

        category: {
            type: String,
            enum: [
                "SYSTEM",
                "DATABASE",
                "VRM",
                "SECURITY",
                "MAIL",
                "OPTIMIZATION",
                "NOTIFICATION"
            ],
            default: "SYSTEM"
        },

        editable: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "SystemSetting",
    systemSettingSchema
);