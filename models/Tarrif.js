import mongoose from "mongoose";

const TariffSchema = new mongoose.Schema(
{
    gridImportTariff: {
        type: Number,
        default: 0.25
    },

    gridExportTariff: {
        type: Number,
        default: 0.08
    },

    dieselPrice: {
        type: Number,
        default: 1.35
    },

    batteryCycleCost: {
        type: Number,
        default: 0.02
    },

    carbonCost: {
        type: Number,
        default: 0.01
    },

    currency: {
        type: String,
        default: "USD"
    },

    active: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
});

export default mongoose.model("Tariff", TariffSchema);