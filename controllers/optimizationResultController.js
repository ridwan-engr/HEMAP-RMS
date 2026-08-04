import asyncHandler from "../utils/asyncHandler.js";

import * as optimizationService from "../services/analytics/optimizationService.js";

/*
|--------------------------------------------------------------------------
| Get Optimization
|--------------------------------------------------------------------------
*/

export const getOptimization = asyncHandler(async (req, res) => {

    const optimization = await optimizationService.getOptimization(

        req.params.id

    );

    return res.status(200).json({

        success: true,

        message: "Optimization retrieved successfully.",

        data: optimization

    });

});

/*
|--------------------------------------------------------------------------
| Latest Optimization
|--------------------------------------------------------------------------
*/

export const getLatestOptimization = asyncHandler(async (req, res) => {

    const { siteId } = req.params;

    const optimization = await optimizationService.getLatestOptimization(

        siteId

    );

    return res.status(200).json({

        success: true,

        message: "Latest optimization retrieved successfully.",

        data: optimization

    });

});

/*
|--------------------------------------------------------------------------
| Optimization History
|--------------------------------------------------------------------------
*/

export const getOptimizationHistory = asyncHandler(async (req, res) => {

    const history = await optimizationService.getOptimizationHistory(

        req.query

    );

    return res.status(200).json({

        success: true,

        message: "Optimization history retrieved successfully.",

        data: history

    });

});

/*
|--------------------------------------------------------------------------
| Dispatch Schedule
|--------------------------------------------------------------------------
*/

export const getDispatchSchedule = asyncHandler(async (req, res) => {

    const schedule = await optimizationService.getDispatchSchedule(

        req.params.id

    );

    return res.status(200).json({

        success: true,

        message: "Dispatch schedule retrieved successfully.",

        data: schedule

    });

});

/*
|--------------------------------------------------------------------------
| Energy Summary
|--------------------------------------------------------------------------
*/

export const getEnergySummary = asyncHandler(async (req, res) => {

    const energy = await optimizationService.getEnergySummary(

        req.params.id

    );

    return res.status(200).json({

        success: true,

        message: "Energy summary retrieved successfully.",

        data: energy

    });

});

/*
|--------------------------------------------------------------------------
| Economics
|--------------------------------------------------------------------------
*/

export const getEconomics = asyncHandler(async (req, res) => {

    const economics = await optimizationService.getEconomics(

        req.params.id

    );

    return res.status(200).json({

        success: true,

        message: "Optimization economics retrieved successfully.",

        data: economics

    });

});

/*
|--------------------------------------------------------------------------
| Emissions
|--------------------------------------------------------------------------
*/

export const getEmissions = asyncHandler(async (req, res) => {

    const emissions = await optimizationService.getEmissions(

        req.params.id

    );

    return res.status(200).json({

        success: true,

        message: "Optimization emissions retrieved successfully.",

        data: emissions

    });

});

/*
|--------------------------------------------------------------------------
| Reliability
|--------------------------------------------------------------------------
*/

export const getReliability = asyncHandler(async (req, res) => {

    const reliability = await optimizationService.getReliability(

        req.params.id

    );

    return res.status(200).json({

        success: true,

        message: "Optimization reliability retrieved successfully.",

        data: reliability

    });

});

/*
|--------------------------------------------------------------------------
| Solver Information
|--------------------------------------------------------------------------
*/

export const getSolver = asyncHandler(async (req, res) => {

    const solver = await optimizationService.getSolver(

        req.params.id

    );

    return res.status(200).json({

        success: true,

        message: "Solver information retrieved successfully.",

        data: solver

    });

});

export default {

    getOptimization,

    getLatestOptimization,

    getOptimizationHistory,

    getDispatchSchedule,

    getEnergySummary,

    getEconomics,

    getEmissions,

    getReliability,

    getSolver

};