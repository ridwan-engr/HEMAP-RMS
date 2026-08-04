import asyncHandler from "../utils/asyncHandler.js";

import * as analyticsService from "../services/analytics/analyticsService.js";

/*
|--------------------------------------------------------------------------
| Dashboard Analytics
|--------------------------------------------------------------------------
*/

export const getDashboardAnalytics = asyncHandler(async (req, res) => {

    const data = await analyticsService.getDashboardAnalytics(req.query);

    return res.status(200).json({

        success: true,

        message: "Dashboard analytics retrieved successfully.",

        data

    });

});

/*
|--------------------------------------------------------------------------
| Executive Analytics
|--------------------------------------------------------------------------
*/

export const getExecutiveAnalytics = asyncHandler(async (req, res) => {

    const data = await analyticsService.getExecutiveAnalytics(req.query);

    return res.status(200).json({

        success: true,

        message: "Executive analytics retrieved successfully.",

        data

    });

});

/*
|--------------------------------------------------------------------------
| Energy Analytics
|--------------------------------------------------------------------------
*/

export const getEnergyAnalytics = asyncHandler(async (req, res) => {

    const data = await analyticsService.getEnergyAnalytics(req.query);

    return res.status(200).json({

        success: true,

        message: "Energy analytics retrieved successfully.",

        data

    });

});

/*
|--------------------------------------------------------------------------
| Battery Analytics
|--------------------------------------------------------------------------
*/

export const getBatteryAnalytics = asyncHandler(async (req, res) => {

    const data = await analyticsService.getBatteryAnalytics(req.query);

    return res.status(200).json({

        success: true,

        message: "Battery analytics retrieved successfully.",

        data

    });

});

/*
|--------------------------------------------------------------------------
| Solar Analytics
|--------------------------------------------------------------------------
*/

export const getSolarAnalytics = asyncHandler(async (req, res) => {

    const data = await analyticsService.getSolarAnalytics(req.query);

    return res.status(200).json({

        success: true,

        message: "Solar analytics retrieved successfully.",

        data

    });

});

/*
|--------------------------------------------------------------------------
| Generator Analytics
|--------------------------------------------------------------------------
*/

export const getGeneratorAnalytics = asyncHandler(async (req, res) => {

    const data = await analyticsService.getGeneratorAnalytics(req.query);

    return res.status(200).json({

        success: true,

        message: "Generator analytics retrieved successfully.",

        data

    });

});

/*
|--------------------------------------------------------------------------
| Grid Analytics
|--------------------------------------------------------------------------
*/

export const getGridAnalytics = asyncHandler(async (req, res) => {

    const data = await analyticsService.getGridAnalytics(req.query);

    return res.status(200).json({

        success: true,

        message: "Grid analytics retrieved successfully.",

        data

    });

});

/*
|--------------------------------------------------------------------------
| Reliability Analytics
|--------------------------------------------------------------------------
*/

export const getReliabilityAnalytics = asyncHandler(async (req, res) => {

    const data = await analyticsService.getReliabilityAnalytics(req.query);

    return res.status(200).json({

        success: true,

        message: "Reliability analytics retrieved successfully.",

        data

    });

});

/*
|--------------------------------------------------------------------------
| Forecast Analytics
|--------------------------------------------------------------------------
*/

export const getForecastAnalytics = asyncHandler(async (req, res) => {

    const data = await analyticsService.getForecastAnalytics(req.query);

    return res.status(200).json({

        success: true,

        message: "Forecast analytics retrieved successfully.",

        data

    });

});

/*
|--------------------------------------------------------------------------
| Optimization Analytics
|--------------------------------------------------------------------------
*/

export const getOptimizationAnalytics = asyncHandler(async (req, res) => {

    const data = await analyticsService.getOptimizationAnalytics(req.query);

    return res.status(200).json({

        success: true,

        message: "Optimization analytics retrieved successfully.",

        data

    });

});

export default {

    getDashboardAnalytics,

    getExecutiveAnalytics,

    getEnergyAnalytics,

    getBatteryAnalytics,

    getSolarAnalytics,

    getGeneratorAnalytics,

    getGridAnalytics,

    getReliabilityAnalytics,

    getForecastAnalytics,

    getOptimizationAnalytics

};