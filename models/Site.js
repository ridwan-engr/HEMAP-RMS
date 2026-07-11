import mongoose from "mongoose";

const siteSchema = new mongoose.Schema(
    {
        installationId: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true
        },

        siteCode: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            address: String,
            city: String,
            state: String,
            country: String,

            latitude: Number,
            longitude: Number
        },

        timezone: {
            type: String,
            default: "Africa/Lagos"
        },

        systemType: {
            type: String,
            default: "Hybrid"
        },

        firmwareVersion: String,

        lastSync: Date,

        status: {
            type: String,
            enum: [
                "ONLINE",
                "OFFLINE",
                "WARNING",
                "FAULT"
            ],
            default: "ONLINE"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "Site",
    siteSchema
);