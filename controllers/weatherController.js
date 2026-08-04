import asyncHandler from "../utils/asyncHandler.js";

import * as weatherService from "../services/weather/weatherService.js";

/*
|--------------------------------------------------------------------------
| Current Weather
|--------------------------------------------------------------------------
*/

export const getCurrentWeather = asyncHandler(async (req, res) => {

    const weather = await weatherService.getCurrentWeather(req.query);

    return res.status(200).json({

        success: true,

        message: "Current weather retrieved successfully.",

        data: weather

    });

});

/*
|--------------------------------------------------------------------------
| Weather Forecast
|--------------------------------------------------------------------------
*/

export const getForecast = asyncHandler(async (req, res) => {

    const forecast = await weatherService.getForecast(req.query);

    return res.status(200).json({

        success: true,

        message: "Weather forecast retrieved successfully.",

        data: forecast

    });

});

/*
|--------------------------------------------------------------------------
| Historical Weather
|--------------------------------------------------------------------------
*/

export const getHistory = asyncHandler(async (req, res) => {

    const history = await weatherService.getHistory(req.query);

    return res.status(200).json({

        success: true,

        message: "Historical weather retrieved successfully.",

        data: history

    });

});

/*
|--------------------------------------------------------------------------
| Solar Irradiance
|--------------------------------------------------------------------------
*/

export const getSolarIrradiance = asyncHandler(async (req, res) => {

    const irradiance = await weatherService.getSolarIrradiance(req.query);

    return res.status(200).json({

        success: true,

        message: "Solar irradiance retrieved successfully.",

        data: irradiance

    });

});

/*
|--------------------------------------------------------------------------
| Wind Data
|--------------------------------------------------------------------------
*/

export const getWindData = asyncHandler(async (req, res) => {

    const wind = await weatherService.getWindData(req.query);

    return res.status(200).json({

        success: true,

        message: "Wind data retrieved successfully.",

        data: wind

    });

});

/*
|--------------------------------------------------------------------------
| Weather Summary
|--------------------------------------------------------------------------
*/

export const getWeatherSummary = asyncHandler(async (req, res) => {

    const summary = await weatherService.getWeatherSummary(req.query);

    return res.status(200).json({

        success: true,

        message: "Weather summary retrieved successfully.",

        data: summary

    });

});

export default {

    getCurrentWeather,

    getForecast,

    getHistory,

    getSolarIrradiance,

    getWindData,

    getWeatherSummary

};