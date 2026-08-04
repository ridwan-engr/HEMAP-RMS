import Joi from "joi";

/*
|--------------------------------------------------------------------------
| Common ObjectId
|--------------------------------------------------------------------------
*/

const objectId = Joi.string()

    .trim()

    .length(24)

    .hex();

/*
|--------------------------------------------------------------------------
| Forecast Query
|--------------------------------------------------------------------------
*/

export const energyForecastQueryValidator = Joi.object({

    siteId: objectId.optional(),

    startDate: Joi.date()

        .iso()

        .optional(),

    endDate: Joi.date()

        .iso()

        .min(Joi.ref("startDate"))

        .optional(),

    modelVersion: Joi.string()

        .trim()

        .optional(),

    page: Joi.number()

        .integer()

        .min(1)

        .default(1),

    limit: Joi.number()

        .integer()

        .min(1)

        .max(500)

        .default(100)

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Forecast Id
|--------------------------------------------------------------------------
*/

export const energyForecastIdValidator = Joi.object({

    forecastId: objectId.required()

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Create Forecast
|--------------------------------------------------------------------------
*/

export const createEnergyForecastValidator = Joi.object({

    site: objectId.required(),

    forecastDate: Joi.date()

        .required(),

    predictedLoad: Joi.number()

        .min(0)

        .default(0),

    predictedSolar: Joi.number()

        .min(0)

        .default(0),

    predictedBatterySOC: Joi.number()

        .min(0)

        .max(100)

        .default(0),

    predictedGridAvailability: Joi.number()

        .min(0)

        .max(100)

        .default(0),

    predictedWind: Joi.number()

        .min(0)

        .default(0),

    predictedTemperature: Joi.number()

        .default(0),

    predictedIrradiance: Joi.number()

        .min(0)

        .default(0),

    confidence: Joi.number()

        .min(0)

        .max(100)

        .default(0),

    modelVersion: Joi.string()

        .trim()

        .max(30)

        .default("1.0")

})

.unknown(false);

/*
|--------------------------------------------------------------------------
| Update Forecast
|--------------------------------------------------------------------------
*/

export const updateEnergyForecastValidator = Joi.object({

    forecastDate: Joi.date()

        .optional(),

    predictedLoad: Joi.number()

        .min(0)

        .optional(),

    predictedSolar: Joi.number()

        .min(0)

        .optional(),

    predictedBatterySOC: Joi.number()

        .min(0)

        .max(100)

        .optional(),

    predictedGridAvailability: Joi.number()

        .min(0)

        .max(100)

        .optional(),

    predictedWind: Joi.number()

        .min(0)

        .optional(),

    predictedTemperature: Joi.number()

        .optional(),

    predictedIrradiance: Joi.number()

        .min(0)

        .optional(),

    confidence: Joi.number()

        .min(0)

        .max(100)

        .optional(),

    modelVersion: Joi.string()

        .trim()

        .max(30)

        .optional()

})

.min(1)

.unknown(false);

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    energyForecastQueryValidator,

    energyForecastIdValidator,

    createEnergyForecastValidator,

    updateEnergyForecastValidator

};