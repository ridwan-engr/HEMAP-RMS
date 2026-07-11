import mongoose from "mongoose";

const generatorSchema = new mongoose.Schema(
    {
        site: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Site",
            required: true,
            index: true
        },

        name: {
            type: String,
            default: "Diesel Generator"
        },

        manufacturer: String,

        model: String,

        ratedPower: Number,

        ratedVoltage: Number,

        ratedFrequency: Number,

        fuelType: {
            type: String,
            enum: [
                "Diesel",
                "Petrol",
                "Gas"
            ],
            default: "Diesel"
        },

        fuelLevel: Number,

        fuelConsumptionRate: Number,

        runtimeHours: Number,

        todayRuntime: Number,

        startCount: {
            type: Number,
            default: 0
        },

        outputPower: Number,

        outputVoltage: Number,

        outputFrequency: Number,

        oilPressure: Number,

        coolantTemperature: Number,

        batteryVoltage: Number,

        status: {
            type: String,
            enum: [
                "RUNNING",
                "STOPPED",
                "FAULT",
                "MAINTENANCE"
            ],
            default: "STOPPED"
        },

        lastStarted: Date,

        lastStopped: Date,

        nextServiceHours: Number
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "Generator",
    generatorSchema
);