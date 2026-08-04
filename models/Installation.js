import mongoose from "mongoose";

const installationSchema = new mongoose.Schema(

    {

        /*
        |--------------------------------------------------------------------------
        | Site Relationship
        |--------------------------------------------------------------------------
        */

        site: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Site",

            required: true,

            index: true

        },

        /*
        |--------------------------------------------------------------------------
        | Victron VRM
        |--------------------------------------------------------------------------
        */

        installationId: {

            type: Number,

            required: true,

            unique: true,

            index: true

        },

        identifier: {

            type: String,

            required: true,

            unique: true,

            trim: true

        },

        name: {

            type: String,

            required: true,

            trim: true

        },

        portalId: {

            type: String,

            trim: true

        },

        /*
        |--------------------------------------------------------------------------
        | Installation Information
        |--------------------------------------------------------------------------
        */

        systemType: {

            type: String,

            enum: [

                "Grid",

                "Solar",

                "Hybrid",

                "Off-Grid"

            ],

            default: "Hybrid"

        },

        firmwareVersion: {

            type: String,

            trim: true

        },

        vrmUrl: {

            type: String,

            trim: true

        },

        /*
        |--------------------------------------------------------------------------
        | Location
        |--------------------------------------------------------------------------
        */

        location: {

            address: String,

            city: String,

            state: String,

            country: String,

            latitude: Number,

            longitude: Number

        },

        timezone: {

            type: String,

            default: "Africa/Lagos"

        },

        /*
        |--------------------------------------------------------------------------
        | Synchronization
        |--------------------------------------------------------------------------
        */

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

        lastSync: {

            type: Date

        },

        lastTelemetry: {

            type: Date

        },

        /*
        |--------------------------------------------------------------------------
        | Metadata
        |--------------------------------------------------------------------------
        */

        isActive: {

            type: Boolean,

            default: true

        },

        notes: {

            type: String,

            trim: true

        }

    },

    {

        timestamps: true

    }

);

/*installationSchema.index({

    installationId: 1,

    status: 1

});*/

export default mongoose.model(

    "Installation",

    installationSchema

);