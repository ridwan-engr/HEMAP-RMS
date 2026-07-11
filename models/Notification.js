import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        site: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Site",
            required: true,
            index: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: [
                "INFO",
                "WARNING",
                "CRITICAL",
                "SUCCESS"
            ],
            default: "INFO"
        },

        channel: {
            type: String,
            enum: [
                "SYSTEM",
                "EMAIL",
                "SMS",
                "PUSH"
            ],
            default: "SYSTEM"
        },

        isRead: {
            type: Boolean,
            default: false
        },

        sentAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

notificationSchema.index({
    site: 1,
    isRead: 1
});

export default mongoose.model(
    "Notification",
    notificationSchema
);