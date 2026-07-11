import mongoose from "mongoose";

const solarSchema = new mongoose.Schema(
    {
        site: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Site",
            required: true,
            index: true
        },

        arrayName: {
            type: String,
            default: "PV Array"
        },

        manufacturer: String,

        moduleType: String,

        installedCapacity: Number,

        inverterCapacity: Number,

        stringCount: Number,

        modulesPerString: Number,

        currentPower: Number,

        dailyEnergy: Number,

        monthlyEnergy: Number,

        yearlyEnergy: Number,

        irradiance: Number,

        panelTemperature: Number,

        inverterEfficiency: Number,

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
    "Solar",
    solarSchema
);