import asyncHandler from "express-async-handler";

import * as installationService from "../services/installation/installationService.js";

import dashboardStatisticsService
    from "../services/dashboard/dashboardStatisticsService.js";

import {

    emitDashboardUpdate
    
} from "../websocket/eventEmitters.js";

/*
|--------------------------------------------------------------------------
| Dashboard Refresh Helper
|--------------------------------------------------------------------------
*/

async function refreshDashboard() {

    const dashboard =
        await dashboardStatisticsService.getDashboardStatistics();

    emitDashboardUpdate(dashboard);

    emitStatisticsUpdate({
        installationCount: dashboard.installationCount,
        siteCount: dashboard.siteCount,
        onlineSites: dashboard.onlineSites,
        offlineSites: dashboard.offlineSites
    });

}

/*
|--------------------------------------------------------------------------
| Get Installations
|--------------------------------------------------------------------------
*/

export const getInstallations = asyncHandler(async (req, res) => {

    const result =
        await installationService.getInstallations(req.query);

    res.status(200).json({

        success: true,

        message: "Installations retrieved successfully.",

        ...result

    });

});

/*
|--------------------------------------------------------------------------
| Get Installation
|--------------------------------------------------------------------------
*/

export const getInstallation = asyncHandler(async (req, res) => {

    const installation =
        await installationService.getInstallation(req.params.id);

    res.status(200).json({

        success: true,

        message: "Installation retrieved successfully.",

        data: installation

    });

});

/*
|--------------------------------------------------------------------------
| Create Installation
|--------------------------------------------------------------------------
*/

export const createInstallation = asyncHandler(async (req, res) => {

    const installation =
        await installationService.createInstallation(req.body);

    await refreshDashboard();

    res.status(201).json({

        success: true,

        message: "Installation created successfully.",

        data: installation

    });

});

/*
|--------------------------------------------------------------------------
| Update Installation
|--------------------------------------------------------------------------
*/

export const updateInstallation = asyncHandler(async (req, res) => {

    const installation =
        await installationService.updateInstallation(

            req.params.id,

            req.body

        );

    const dashboard =
        await dashboardStatisticsService.getDashboardStatistics();

    emitDashboardUpdate(dashboard);

    emitStatisticsUpdate({
        installationCount: dashboard.installationCount,
        siteCount: dashboard.siteCount,
        onlineSites: dashboard.onlineSites,
        offlineSites: dashboard.offlineSites
    });

    await refreshDashboard();

    res.status(200).json({

        success: true,

        message: "Installation updated successfully.",

        data: installation

    });

});

/*
|--------------------------------------------------------------------------
| Delete Installation
|--------------------------------------------------------------------------
*/

export const deleteInstallation = asyncHandler(async (req, res) => {

    await installationService.deleteInstallation(req.params.id);

    const dashboard =
        await dashboardStatisticsService.getDashboardStatistics();

    emitDashboardUpdate(dashboard);

    emitStatisticsUpdate({
        installationCount: dashboard.installationCount,
        siteCount: dashboard.siteCount,
        onlineSites: dashboard.onlineSites,
        offlineSites: dashboard.offlineSites
    });

    await refreshDashboard();

    res.status(200).json({

        success: true,

        message: "Installation deleted successfully."

    });

});

/*
|--------------------------------------------------------------------------
| Synchronize Installation
|--------------------------------------------------------------------------
*/

export const synchronizeInstallation = asyncHandler(async (req, res) => {

    const installation =
        await installationService.synchronizeInstallation(

            req.params.id

        );

    await refreshDashboard();

    res.status(200).json({

        success: true,

        message: "Installation synchronized successfully.",

        data: installation

    });

});

/*
|--------------------------------------------------------------------------
| Installation Statistics
|--------------------------------------------------------------------------
*/

export const getInstallationStatistics = asyncHandler(async (req, res) => {

    const statistics =
        await installationService.getInstallationStatistics(

            req.params.id

        );

    res.status(200).json({

        success: true,

        message: "Installation statistics retrieved successfully.",

        data: statistics

    });

});

export default {

    getInstallations,

    getInstallation,

    createInstallation,

    updateInstallation,

    deleteInstallation,

    synchronizeInstallation,

    getInstallationStatistics

};