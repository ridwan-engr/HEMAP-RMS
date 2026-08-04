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
| Shared Coordinates
|--------------------------------------------------------------------------
*/

const coordinateSchema = {

    siteId: objectId.optional(),

    latitude: Joi.number()

        .min(-90)

        .max(90)

        .optional(),

    longitude: Joi.number()

        .min(-180)

        .max(180)

        .optional(),

    units: Joi.string()

        .valid(

            "metric",

            "imperial",

            "standard"

        )

        .default("metric"),

    lang: Joi.string()

        .length(2)

        .default("en")

};

/*
|--------------------------------------------------------------------------
| Current Weather
|--------------------------------------------------------------------------
*/

export const currentWeatherValidator = Joi.object({

    ...coordinateSchema

})

.and(

    "latitude",

    "longitude"

)

.or(

    "siteId",

    "latitude"

)

.unknown(false);

/*
|--------------------------------------------------------------------------
| Forecast
|--------------------------------------------------------------------------
*/

export const forecastValidator = Joi.object({

    ...coordinateSchema,

    days: Joi.number()

        .integer()

        .min(1)

        .max(7)

        .default(5)

})

.and(

    "latitude",

    "longitude"

)

.or(

    "siteId",

    "latitude"

)

.unknown(false);

/*
|--------------------------------------------------------------------------
| History
|--------------------------------------------------------------------------
*/

export const historyValidator = Joi.object({

    ...coordinateSchema,

    startDate: Joi.date()

        .iso()

        .max("now")

        .required(),

    endDate: Joi.date()

        .iso()

        .min(Joi.ref("startDate"))

        .max("now")

        .required()

})

.and(

    "latitude",

    "longitude"

)

.or(

    "siteId",

    "latitude"

)

.unknown(false);

/*
|--------------------------------------------------------------------------
| Solar Irradiance
|--------------------------------------------------------------------------
*/

export const irradianceValidator = Joi.object({

    ...coordinateSchema

})

.and(

    "latitude",

    "longitude"

)

.or(

    "siteId",

    "latitude"

)

.unknown(false);

/*
|--------------------------------------------------------------------------
| Wind
|--------------------------------------------------------------------------
*/

export const windValidator = Joi.object({

    ...coordinateSchema

})

.and(

    "latitude",

    "longitude"

)

.or(

    "siteId",

    "latitude"

)

.unknown(false);

/*
|--------------------------------------------------------------------------
| Weather Summary
|--------------------------------------------------------------------------
*/

export const weatherSummaryValidator = Joi.object({

    ...coordinateSchema

})

.and(

    "latitude",

    "longitude"

)

.or(

    "siteId",

    "latitude"

)

.unknown(false);

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default {

    currentWeatherValidator,

    forecastValidator,

    historyValidator,

    irradianceValidator,

    windValidator,

    weatherSummaryValidator

};