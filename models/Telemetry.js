import mongoose from "mongoose";

const telemetrySchema = new mongoose.Schema(
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
            index: true
        },

        solarPower: Number,

        batterySOC: Number,

        batteryVoltage: Number,

        batteryCurrent: Number,

        batteryPower: Number,

        gridPower: Number,

        generatorPower: Number,

        loadPower: Number,

        inverterPower: Number,

        frequency: Number,

        temperature: Number
    },
    {
        timestamps: true
    }
);

telemetrySchema.index({
    site: 1,
    timestamp: -1
});

export default mongoose.model(
    "Telemetry",
    telemetrySchema
);