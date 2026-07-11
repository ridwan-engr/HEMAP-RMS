import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        site: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Site"
        },

        action: {
            type: String,
            required: true
        },

        module: {
            type: String,
            required: true
        },

        description: String,

        ipAddress: String,

        userAgent: String,

        metadata: {
            type: mongoose.Schema.Types.Mixed
        }
    },
    {
        timestamps: true
    }
);

auditLogSchema.index({
    user: 1,
    createdAt: -1
});

export default mongoose.model(
    "AuditLog",
    auditLogSchema
);