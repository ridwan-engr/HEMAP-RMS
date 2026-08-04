import asyncHandler from "../utils/asyncHandler.js";

import * as forecastService from "../services/analytics/forecastService.js";

/*
|--------------------------------------------------------------------------
| Create Forecast
|--------------------------------------------------------------------------
*/

export const createForecast = asyncHandler(async (req, res) => {

    const forecast = await forecastService.createForecast(req.body);

    return res.status(201).json({

        success: true,

        message: "Forecast created successfully.",

        data: forecast

    });

});

/*
|--------------------------------------------------------------------------
| Forecasts
|--------------------------------------------------------------------------
*/

export const getForecasts = asyncHandler(async (req, res) => {

    const forecasts = await forecastService.getForecasts(req.query);

    return res.status(200).json({

        success: true,

        message: "Forecasts retrieved successfully.",

        data: forecasts

    });

});

/*
|--------------------------------------------------------------------------
| Forecast
|--------------------------------------------------------------------------
*/

export const getForecastById = asyncHandler(async (req, res) => {

    const forecast = await forecastService.getForecastById(

        req.params.id

    );

    return res.status(200).json({

        success: true,

        message: "Forecast retrieved successfully.",

        data: forecast

    });

});

/*
|--------------------------------------------------------------------------
| Update Forecast
|--------------------------------------------------------------------------
*/

export const updateForecast = asyncHandler(async (req, res) => {

    const forecast = await forecastService.updateForecast(

        req.params.id,

        req.body

    );

    return res.status(200).json({

        success: true,

        message: "Forecast updated successfully.",

        data: forecast

    });

});

/*
|--------------------------------------------------------------------------
| Delete Forecast
|--------------------------------------------------------------------------
*/

export const deleteForecast = asyncHandler(async (req, res) => {

    await forecastService.deleteForecast(

        req.params.id

    );

    return res.status(200).json({

        success: true,

        message: "Forecast deleted successfully."

    });

});

/*
|--------------------------------------------------------------------------
| Run Forecast
|--------------------------------------------------------------------------
*/

export const runForecast = asyncHandler(async (req, res) => {

    const result = await forecastService.runForecast(

        req.params.id

    );

    return res.status(200).json({

        success: true,

        message: "Forecast generated successfully.",

        data: result

    });

});

/*
|--------------------------------------------------------------------------
| Dashboard Forecast
|--------------------------------------------------------------------------
*/

export const getForecastDashboard = asyncHandler(async (req, res) => {

    const data = await forecastService.getForecastDashboard(

        req.query.siteId

    );

    return res.status(200).json({

        success: true,

        message: "Forecast dashboard retrieved successfully.",

        data

    });

});

export default {

    createForecast,

    getForecasts,

    getForecastById,

    updateForecast,

    deleteForecast,

    runForecast,

    getForecastDashboard

};