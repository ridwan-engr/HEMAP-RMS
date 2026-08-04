import axios from "axios";

import Site from "../../models/Site.js";

import { env } from "../../config/env.js";

/*
|--------------------------------------------------------------------------
| Weather API Client
|--------------------------------------------------------------------------
*/

const weatherClient = axios.create({

    baseURL: env.weatherApiUrl,

    timeout: 15000,

    params: {

        appid: env.weatherApiKey,

        units: "metric"

    }

});

/*
|--------------------------------------------------------------------------
| Resolve Coordinates
|--------------------------------------------------------------------------
*/

async function resolveCoordinates(filters = {}) {

    if (filters.latitude && filters.longitude) {

        return {

            latitude: Number(filters.latitude),

            longitude: Number(filters.longitude)

        };

    }

    if (filters.siteId) {

        const site = await Site.findById(filters.siteId)

            .select("latitude longitude")

            .lean();

        if (!site) {

            throw new Error("Site not found.");

        }

        return {

            latitude: site.latitude,

            longitude: site.longitude

        };

    }

    throw new Error(

        "Latitude/Longitude or SiteId is required."

    );

}

/*
|--------------------------------------------------------------------------
| Current Weather
|--------------------------------------------------------------------------
*/

export async function getCurrentWeather(filters = {}) {

    const {

        latitude,

        longitude

    } = await resolveCoordinates(filters);

    const { data } = await weatherClient.get(

        "/weather",

        {

            params: {

                lat: latitude,

                lon: longitude

            }

        }

    );

    return data;

}

/*
|--------------------------------------------------------------------------
| Forecast
|--------------------------------------------------------------------------
*/

export async function getForecast(filters = {}) {

    const {

        latitude,

        longitude

    } = await resolveCoordinates(filters);

    const { data } = await weatherClient.get(

        "/forecast",

        {

            params: {

                lat: latitude,

                lon: longitude

            }

        }

    );

    return data;

}

/*
|--------------------------------------------------------------------------
| Historical Weather
|--------------------------------------------------------------------------
*/

export async function getHistory(filters = {}) {

    return {

        message:

            "Historical weather is not supported by the configured API.",

        data: []

    };

}

/*
|--------------------------------------------------------------------------
| Solar Irradiance
|--------------------------------------------------------------------------
*/

export async function getSolarIrradiance(filters = {}) {

    const weather = await getCurrentWeather(filters);

    return {

        cloudCover:

            weather.clouds?.all ?? 0,

        sunrise:

            weather.sys?.sunrise,

        sunset:

            weather.sys?.sunset,

        uvIndex:

            weather.uvi ?? null,

        estimatedIrradiance:

            Math.max(

                0,

                1000 -

                ((weather.clouds?.all ?? 0) * 10)

            )

    };

}

/*
|--------------------------------------------------------------------------
| Wind Data
|--------------------------------------------------------------------------
*/

export async function getWindData(filters = {}) {

    const weather = await getCurrentWeather(filters);

    return {

        speed:

            weather.wind?.speed ?? 0,

        gust:

            weather.wind?.gust ?? 0,

        direction:

            weather.wind?.deg ?? 0

    };

}

/*
|--------------------------------------------------------------------------
| Weather Summary
|--------------------------------------------------------------------------
*/

export async function getWeatherSummary(filters = {}) {

    const [

        current,

        forecast

    ] = await Promise.all([

        getCurrentWeather(filters),

        getForecast(filters)

    ]);

    return {

        current,

        forecast

    };

}

export default {

    getCurrentWeather,

    getForecast,

    getHistory,

    getSolarIrradiance,

    getWindData,

    getWeatherSummary

};