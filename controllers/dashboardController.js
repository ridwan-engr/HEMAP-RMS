import asyncHandler from "../utils/asyncHandler.js";

import * as dashboardService from "../services/dashboard/dashboardService.js";

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const getDashboard = asyncHandler(async (req, res) => {

    const data = await dashboardService.getDashboard(req.query);

    return res.status(200).json({

        success: true,

        message: "Dashboard retrieved successfully.",

        data

    });

});

/*
|--------------------------------------------------------------------------
| Executive Dashboard
|--------------------------------------------------------------------------
*/

export const getExecutiveDashboard = asyncHandler(async (req, res) => {

    const data = await dashboardService.getExecutiveDashboard(req.query);

    return res.status(200).json({

        success: true,

        message: "Executive dashboard retrieved successfully.",

        data

    });

});

/*
|--------------------------------------------------------------------------
| Dashboard Cards
|--------------------------------------------------------------------------
*/

export const getDashboardCards = asyncHandler(async (req, res) => {

    const data = await dashboardService.getDashboardCards(req.query);

    return res.status(200).json({

        success: true,

        message: "Dashboard cards retrieved successfully.",

        data

    });

});

/*
|--------------------------------------------------------------------------
| KPIs
|--------------------------------------------------------------------------
*/

export const getKPIs = asyncHandler(async (req, res) => {

    const data = await dashboardService.getKPIs(req.query);

    return res.status(200).json({

        success: true,

        message: "KPIs retrieved successfully.",

        data

    });

});

/*
|--------------------------------------------------------------------------
| Map
|--------------------------------------------------------------------------
*/

export const getMap = asyncHandler(async (req, res) => {

    const data = await dashboardService.getMap(req.query);

    return res.status(200).json({

        success: true,

        message: "Dashboard map retrieved successfully.",

        data

    });

});

/*
|--------------------------------------------------------------------------
| Optimization Summary
|--------------------------------------------------------------------------
*/

export const getOptimizationSummary = asyncHandler(async (req, res) => {

    const data = await dashboardService.getOptimizationSummary(req.query);

    return res.status(200).json({

        success: true,

        message: "Optimization summary retrieved successfully.",

        data

    });

});

/*
|--------------------------------------------------------------------------
| Refresh Dashboard
|--------------------------------------------------------------------------
*/

export const refreshDashboard = asyncHandler(async (req, res) => {

    const data = await dashboardService.refreshDashboard(req.body);

    return res.status(200).json({

        success: true,

        message: "Dashboard refreshed successfully.",

        data

    });

});

/*
|--------------------------------------------------------------------------
| Dashboard Charts
|--------------------------------------------------------------------------
*/

export const getDashboardCharts = asyncHandler(async (req, res) => {

    const data = await dashboardService.getDashboardCharts(req.query);

    return res.status(200).json({

        success: true,

        message: "Dashboard charts retrieved successfully.",

        data

    });

});

export default {

    getDashboard,

    getExecutiveDashboard,

    getDashboardCards,

    getKPIs,

    getMap,

    getOptimizationSummary,

    getDashboardCharts,

    refreshDashboard

};