import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
    {
        address: String,
        city: String,
        state: String,
        country: {
            type: String,
            default: "Nigeria"
        },
        latitude: Number,
        longitude: Number
    },
    { _id: false }
);

const siteSchema = new mongoose.Schema(
    {

        installationId: {
            type: String,
            trim: true,
           // sparse: true,
            //unique: true
        },

        siteCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        customer: {
            type: String,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        siteType: {
            type: String,
            enum: [
                "Telecom",
                "Commercial",
                "Industrial",
                "Residential",
                "Utility",
                "Other"
            ],
            default: "Telecom"
        },

        location: locationSchema,

        timezone: {
            type: String,
            default: "Africa/Lagos"
        },

        installedCapacity: {
            type: Number,
            default: 0,
            min: 0
        },

        commissioningDate: Date,

        tags: [
            String
        ],

        systemType: {
            type: String,
            enum: [
                "Hybrid",
                "Solar",
                "Grid",
                "Generator",
                "Battery"
            ],
            default: "Hybrid"
        },

        firmwareVersion: String,

        lastSync: Date,

        assignedEngineer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

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

export default mongoose.model("Site", siteSchema);