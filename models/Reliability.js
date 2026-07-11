import mongoose from "mongoose";

const reliabilitySchema = new mongoose.Schema(

    {

        site: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Site",

            required: true,

            index: true

        },

        period: {

            type: String,

            enum: [

                "HOURLY",

                "DAILY",

                "MONTHLY",

                "YEARLY"

            ],

            default: "DAILY"

        },

        timestamp: {

            type: Date,

            default: Date.now,

            index: true

        },

        availability: {

            type: Number,

            default: 100

        },

        reliability: {

            type: Number,

            default: 100

        },

        resilience: {

            type: Number,

            default: 100

        },

        saidi: {

            type: Number,

            default: 0

        },

        saifi: {

            type: Number,

            default: 0

        },

        caidi: {

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

        lole: {

            type: Number,

            default: 0

        },

        eer: {

            type: Number,

            default: 0

        },

        renewableFraction: {

            type: Number,

            default: 0

        },

        mtbf: {

            type: Number,

            default: 0

        },

        mttr: {

            type: Number,

            default: 0

        }

    },

    {

        timestamps: true

    }

);

reliabilitySchema.index({

    site: 1,

    period: 1,

    timestamp: -1

});

export default mongoose.model(

    "Reliability",

    reliabilitySchema

);