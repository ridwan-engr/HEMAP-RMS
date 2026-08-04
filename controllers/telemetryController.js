import asyncHandler from "../utils/asyncHandler.js";

import * as telemetryService from "../services/telemetry/telemetryService.js";

/*
|--------------------------------------------------------------------------
| Current Telemetry
|--------------------------------------------------------------------------
*/

export const getTelemetry = asyncHandler(async (req, res) => {

    const telemetry = await telemetryService.getTelemetry(

        req.query

    );

    return res.status(200).json({

        success: true,

        message: "Telemetry retrieved successfully.",

        data: telemetry

    });

});

/*
|--------------------------------------------------------------------------
| Historical Telemetry
|--------------------------------------------------------------------------
*/

export const getTelemetryHistory = asyncHandler(async (req, res) => {

    const history = await telemetryService.getTelemetryHistory(

        req.query

    );

    return res.status(200).json({

        success: true,

        message: "Telemetry history retrieved successfully.",

        data: history

    });

});

/*
|--------------------------------------------------------------------------
| Latest Telemetry
|--------------------------------------------------------------------------
*/

export const getLatestTelemetry = asyncHandler(async (req, res) => {

    const { installationId } = req.params;

    const telemetry = await telemetryService.getLatestTelemetry(

        installationId

    );

    return res.status(200).json({

        success: true,

        message: "Latest telemetry retrieved successfully.",

        data: telemetry

    });

});

/*
|--------------------------------------------------------------------------
| Synchronize Telemetry
|--------------------------------------------------------------------------
*/

export const synchronizeTelemetry = asyncHandler(async (req, res) => {

    const { installationId } = req.params;

    const result = await telemetryService.synchronizeTelemetry(

        installationId,

        req.user

    );

    return res.status(200).json({

        success: true,

        message: "Telemetry synchronized successfully.",

        data: result

    });

});

/*
|--------------------------------------------------------------------------
| Device Status
|--------------------------------------------------------------------------
*/

export const getDeviceStatus = asyncHandler(async (req, res) => {

    const { installationId } = req.params;

    const status = await telemetryService.getDeviceStatus(

        installationId

    );

    return res.status(200).json({

        success: true,

        message: "Device status retrieved successfully.",

        data: status

    });

});

/*
|--------------------------------------------------------------------------
| Telemetry Summary
|--------------------------------------------------------------------------
*/

export const getTelemetrySummary = asyncHandler(async (req, res) => {

    const summary = await telemetryService.getTelemetrySummary(

        req.query

    );

    return res.status(200).json({

        success: true,

        message: "Telemetry summary retrieved successfully.",

        data: summary

    });

});

export default {

    getTelemetry,

    getTelemetryHistory,

    getLatestTelemetry,

    synchronizeTelemetry,

    getDeviceStatus,

    getTelemetrySummary

};