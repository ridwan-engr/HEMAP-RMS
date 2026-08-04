import asyncHandler from "../utils/asyncHandler.js";
import * as alarmService from "../services/alarm/alarmService.js";

/*
|--------------------------------------------------------------------------
| Active Alarms
|--------------------------------------------------------------------------
*/

export const getActiveAlarms = asyncHandler(async (req, res) => {

    const alarms = await alarmService.getActiveAlarms(req.query);

    return res.status(200).json({
        success: true,
        message: "Active alarms retrieved successfully.",
        data: alarms
    });

});

/*
|--------------------------------------------------------------------------
| Alarm History
|--------------------------------------------------------------------------
*/

export const getAlarmHistory = asyncHandler(async (req, res) => {

    const alarms = await alarmService.getAlarmHistory(req.query);

    return res.status(200).json({
        success: true,
        message: "Alarm history retrieved successfully.",
        data: alarms
    });

});

/*
|--------------------------------------------------------------------------
| Alarm Details
|--------------------------------------------------------------------------
*/

export const getAlarmById = asyncHandler(async (req, res) => {

    const alarm = await alarmService.getAlarmById(req.params.alarmId);

    return res.status(200).json({
        success: true,
        message: "Alarm retrieved successfully.",
        data: alarm
    });

});

/*
|--------------------------------------------------------------------------
| Alarm Statistics
|--------------------------------------------------------------------------
*/

export const getAlarmStatistics = asyncHandler(async (req, res) => {

    const statistics = await alarmService.getAlarmStatistics(req.query);

    return res.status(200).json({
        success: true,
        message: "Alarm statistics retrieved successfully.",
        data: statistics
    });

});

/*
|--------------------------------------------------------------------------
| Alarm Summary
|--------------------------------------------------------------------------
*/

export const getAlarmSummary = asyncHandler(async (req, res) => {

    const summary = await alarmService.getAlarmSummary(req.query);

    return res.status(200).json({
        success: true,
        message: "Alarm summary retrieved successfully.",
        data: summary
    });

});

/*
|--------------------------------------------------------------------------
| Acknowledge Alarm
|--------------------------------------------------------------------------
*/

export const acknowledgeAlarm = asyncHandler(async (req, res) => {

    const alarm = await alarmService.acknowledgeAlarm(
        req.params.alarmId,
        req.user
    );

    return res.status(200).json({
        success: true,
        message: "Alarm acknowledged successfully.",
        data: alarm
    });

});

/*
|--------------------------------------------------------------------------
| Resolve Alarm
|--------------------------------------------------------------------------
*/

export const resolveAlarm = asyncHandler(async (req, res) => {

    const alarm = await alarmService.resolveAlarm(
        req.params.alarmId,
        req.user,
        req.body
    );

    return res.status(200).json({
        success: true,
        message: "Alarm resolved successfully.",
        data: alarm
    });

});

/*
|--------------------------------------------------------------------------
| Delete Alarm
|--------------------------------------------------------------------------
*/

export const deleteAlarm = asyncHandler(async (req, res) => {

    await alarmService.deleteAlarm(req.params.alarmId);

    return res.status(200).json({
        success: true,
        message: "Alarm deleted successfully."
    });

});

export default {

    getActiveAlarms,

    getAlarmHistory,

    getAlarmById,

    getAlarmStatistics,

    getAlarmSummary,

    acknowledgeAlarm,

    resolveAlarm,

    deleteAlarm

};