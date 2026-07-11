import mongoose from "mongoose";

const energyForecastSchema = new mongoose.Schema(
    {
        site: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Site",
            required: true,
            index: true
        },

        forecastDate: {
            type: Date,
            required: true
        },

        predictedLoad: {
            type: Number,
            default: 0
        },

        predictedSolar: {
            type: Number,
            default: 0
        },

        predictedBatterySOC: {
            type: Number,
            default: 0
        },

        predictedGridAvailability: {
            type: Number,
            default: 0
        },

        predictedWind: {
            type: Number,
            default: 0
        },

        predictedTemperature: {
            type: Number,
            default: 0
        },

        predictedIrradiance: {
            type: Number,
            default: 0
        },

        confidence: {
            type: Number,
            default: 0
        },

        modelVersion: {
            type: String,
            default: "1.0"
        }
    },
    {
        timestamps: true
    }
);

energyForecastSchema.index({
    site: 1,
    forecastDate: -1
});

export default mongoose.model(
    "EnergyForecast",
    energyForecastSchema
);