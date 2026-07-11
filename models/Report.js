import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        site: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Site",
            required: true,
            index: true
        },

        generatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        reportType: {
            type: String,
            enum: [
                "DAILY",
                "WEEKLY",
                "MONTHLY",
                "YEARLY",
                "CUSTOM"
            ],
            required: true
        },

        periodStart: {
            type: Date,
            required: true
        },

        periodEnd: {
            type: Date,
            required: true
        },

        summary: {
            totalSolarEnergy: {
                type: Number,
                default: 0
            },

            totalGridEnergy: {
                type: Number,
                default: 0
            },

            totalGeneratorEnergy: {
                type: Number,
                default: 0
            },

            batteryEfficiency: {
                type: Number,
                default: 0
            },

            renewableFraction: {
                type: Number,
                default: 0
            },

            generatorRuntime: {
                type: Number,
                default: 0
            },

            alarms: {
                type: Number,
                default: 0
            },

            saidi: {
                type: Number,
                default: 0
            },

            saifi: {
                type: Number,
                default: 0
            },

            ens: {
                type: Number,
                default: 0
            },

            lolp: {
                type: Number,
                default: 0
            },

            resilience: {
                type: Number,
                default: 0
            }
        },

        filePath: String,

        status: {
            type: String,
            enum: [
                "GENERATING",
                "COMPLETED",
                "FAILED"
            ],
            default: "GENERATING"
        }
    },
    {
        timestamps: true
    }
);

reportSchema.index({
    site: 1,
    reportType: 1,
    periodStart: -1
});

export default mongoose.model(
    "Report",
    reportSchema
);