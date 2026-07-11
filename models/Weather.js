import mongoose from "mongoose";

const weatherSchema = new mongoose.Schema(
{
    site: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Site",
        required: true,
        index: true
    },

    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },

    temperature: Number,

    humidity: Number,

    pressure: Number,

    windSpeed: Number,

    windDirection: Number,

    solarIrradiance: Number,

    cloudCover: Number,

    rainfall: Number,

    visibility: Number,

    uvIndex: Number,

    weatherCondition: {
        type: String,
        enum: [
            "SUNNY",
            "PARTLY_CLOUDY",
            "CLOUDY",
            "RAIN",
            "STORM",
            "FOG",
            "UNKNOWN"
        ],
        default: "UNKNOWN"
    }
},
{
    timestamps: true
}
);

weatherSchema.index({
    site: 1,
    timestamp: -1
});

export default mongoose.model(
    "Weather",
    weatherSchema
);