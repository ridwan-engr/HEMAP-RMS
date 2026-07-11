import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
{
    site: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Site",
        required: true,
        index: true
    },

    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device"
    },

    title: {
        type: String,
        required: true
    },

    description: String,

    maintenanceType: {
        type: String,
        enum: [
            "PREVENTIVE",
            "CORRECTIVE",
            "PREDICTIVE",
            "EMERGENCY"
        ],
        default: "PREVENTIVE"
    },

    priority: {
        type: String,
        enum: [
            "LOW",
            "MEDIUM",
            "HIGH",
            "URGENT"
        ],
        default: "MEDIUM"
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    scheduledDate: Date,

    completedDate: Date,

    estimatedHours: Number,

    actualHours: Number,

    cost: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: [
            "SCHEDULED",
            "IN_PROGRESS",
            "COMPLETED",
            "CANCELLED"
        ],
        default: "SCHEDULED"
    },

    remarks: String
},
{
    timestamps: true
}
);

maintenanceSchema.index({
    site: 1,
    scheduledDate: -1
});

export default mongoose.model(
    "Maintenance",
    maintenanceSchema
);