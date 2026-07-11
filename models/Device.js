import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
{
    site: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Site",
        required: true,
        index: true
    },

    deviceId: {
        type: String,
        required: true,
        unique: true
    },

    serialNumber: String,

    name: String,

    manufacturer: String,

    model: String,

    firmwareVersion: String,

    hardwareVersion: String,

    type: {
        type: String,
        enum: [
            "GX",
            "INVERTER",
            "SOLAR_CHARGER",
            "BATTERY_MONITOR",
            "GENERATOR_CONTROLLER",
            "GRID_METER",
            "SENSOR",
            "OTHER"
        ],
        required: true
    },

    ipAddress: String,

    macAddress: String,

    status: {
        type: String,
        enum: [
            "ONLINE",
            "OFFLINE",
            "WARNING",
            "FAULT"
        ],
        default: "ONLINE"
    },

    lastCommunication: Date,

    installationDate: Date
},
{
    timestamps: true
}
);

deviceSchema.index({
    site: 1,
    deviceId: 1
});

export default mongoose.model(
    "Device",
    deviceSchema
);