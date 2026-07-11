import mongoose from "mongoose";

const batterySchema = new mongoose.Schema(
    {
        site: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Site",
            required: true,
            index: true
        },

        name: {
            type: String,
            default: "Battery Bank"
        },

        manufacturer: String,

        model: String,

        chemistry: {
            type: String,
            enum: [
                "Lithium-Ion",
                "LiFePO4",
                "Lead Acid",
                "AGM",
                "Gel",
                "Other"
            ],
            default: "LiFePO4"
        },

        capacityAh: Number,

        nominalVoltage: Number,

        nominalEnergy: Number,

        maximumChargeCurrent: Number,

        maximumDischargeCurrent: Number,

        chargeEfficiency: {
            type: Number,
            default: 0.95
        },

        dischargeEfficiency: {
            type: Number,
            default: 0.95
        },

        stateOfHealth: {
            type: Number,
            default: 100
        },

        minimumSOC: {
            type: Number,
            default: 20
        },

        maximumSOC: {
            type: Number,
            default: 100
        },

        currentSOC: Number,

        temperature: Number,

        status: {
            type: String,
            enum: [
                "ONLINE",
                "OFFLINE",
                "CHARGING",
                "DISCHARGING",
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
    "Battery",
    batterySchema
);