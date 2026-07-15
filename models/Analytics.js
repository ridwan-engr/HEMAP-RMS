import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| Energy Summary
|--------------------------------------------------------------------------
*/

const energySchema = new mongoose.Schema(
    {
        solarEnergy: {
            type: Number,
            default: 0
        },

        gridEnergy: {
            type: Number,
            default: 0
        },

        generatorEnergy: {
            type: Number,
            default: 0
        },

        batteryChargeEnergy: {
            type: Number,
            default: 0
        },

        batteryDischargeEnergy: {
            type: Number,
            default: 0
        },

        loadEnergy: {
            type: Number,
            default: 0
        },

        renewableFraction: {
            type: Number,
            default: 0
        },

        systemEfficiency: {
            type: Number,
            default: 0
        },

        energyCost: {
            type: Number,
            default: 0
        },

        carbonEmission: {
            type: Number,
            default: 0
        }
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| Battery
|--------------------------------------------------------------------------
*/

const batterySchema = new mongoose.Schema(
    {
        averageSOC: Number,

        minimumSOC: Number,

        maximumSOC: Number,

        averageSOH: Number,

        batteryTemperature: Number,

        chargeEfficiency: Number,

        dischargeEfficiency: Number,

        cycles: Number,

        remainingLife: Number
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| Generator
|--------------------------------------------------------------------------
*/

const generatorSchema = new mongoose.Schema(
    {
        runtimeHours: Number,

        startCount: Number,

        fuelConsumption: Number,

        fuelCost: Number,

        averageLoad: Number,

        efficiency: Number
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| Reliability
|--------------------------------------------------------------------------
*/

const reliabilitySchema = new mongoose.Schema(
    {
        saidi: Number,

        saifi: Number,

        caidi: Number,

        asai: Number,

        asui: Number,

        ens: Number,

        eens: Number,

        lolp: Number,

        lole: Number,

        availability: Number,

        reliability: Number,

        maintainability: Number,

        mtbf: Number,

        mttr: Number
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| Forecast
|--------------------------------------------------------------------------
*/

const forecastSchema = new mongoose.Schema(
    {
        next24Hours: [
            Number
        ],

        next7Days: [
            Number
        ],

        predictedPeakLoad: Number,

        predictedMinimumLoad: Number,

        predictedSolarGeneration: Number,

        predictedBatterySOC: Number
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| Optimization
|--------------------------------------------------------------------------
*/

const optimizationSchema = new mongoose.Schema(
    {
        recommendedDispatch: {
            solar: Number,

            battery: Number,

            grid: Number,

            generator: Number
        },

        expectedCostSaving: Number,

        expectedFuelSaving: Number,

        renewableImprovement: Number,

        emissionReduction: Number,

        optimizationScore: Number
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| Weather
|--------------------------------------------------------------------------
*/

const weatherSchema = new mongoose.Schema(
    {
        temperature: Number,

        humidity: Number,

        irradiance: Number,

        windSpeed: Number,

        cloudCover: Number,

        rainfall: Number
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| AI Insights
|--------------------------------------------------------------------------
*/

const insightSchema = new mongoose.Schema(
    {
        severity: {
            type: String,
            enum: [

                "LOW",

                "MEDIUM",

                "HIGH",

                "CRITICAL"

            ]
        },

        category: String,

        title: String,

        message: String,

        recommendation: String
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| Analytics
|--------------------------------------------------------------------------
*/

const analyticsSchema = new mongoose.Schema(
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

                "WEEKLY",

                "MONTHLY",

                "YEARLY"

            ],
            required: true
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        energy: energySchema,

        battery: batterySchema,

        generator: generatorSchema,

        reliability: reliabilitySchema,

        forecast: forecastSchema,

        optimization: optimizationSchema,

        weather: weatherSchema,

        insights: [

            insightSchema

        ],

        generatedAt: {
            type: Date,
            default: Date.now
        },

        generatedBy: {
            type: String,
            default: "analyticsScheduler"
        }
    },
    {
        timestamps: true
    }
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

analyticsSchema.index({

    site: 1,

    period: 1,

    startDate: -1

});

analyticsSchema.index({

    generatedAt: -1

});

analyticsSchema.index({

    "reliability.saidi": 1

});

analyticsSchema.index({

    "battery.averageSOC": 1

});

analyticsSchema.index({

    "energy.renewableFraction": 1

});

export default mongoose.model(
    "Analytics",
    analyticsSchema
);