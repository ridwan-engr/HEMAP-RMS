import mongoose from "mongoose";

const SiteConfigurationSchema = new mongoose.Schema(
{
    site: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Site",
        required: true,
        unique: true
    },

    battery: {

        capacity: Number,

        minimumSOC: {
            type: Number,
            default: 20
        },

        maximumSOC: {
            type: Number,
            default: 95
        },

        maximumChargePower: Number,

        maximumDischargePower: Number,

        chargingEfficiency: {
            type: Number,
            default: 0.95
        },

        dischargingEfficiency: {
            type: Number,
            default: 0.95
        }
    },

    generator: {

        minimumPower: Number,

        maximumPower: Number,

        startupCost: Number
    },

    grid: {

        maximumImport: Number,

        maximumExport: Number
    }
},
{
    timestamps: true
});

export default mongoose.model(
    "SiteConfiguration",
    SiteConfigurationSchema
);