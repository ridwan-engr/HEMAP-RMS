import { Router } from "express";

import alarmController from "../controllers/alarmController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {
    activeAlarmValidator,
    alarmHistoryValidator,
    alarmStatisticsValidator,
    alarmIdValidator,
    resolveAlarmValidator
} from "../validators/alarmValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Active Alarms
|--------------------------------------------------------------------------
*/

router.get(
    "/active",
    validate({
        query: activeAlarmValidator
    }),
    alarmController.getActiveAlarms
);

/*
|--------------------------------------------------------------------------
| Alarm History
|--------------------------------------------------------------------------
*/

router.get(
    "/history",
    validate({
        query: alarmHistoryValidator
    }),
    alarmController.getAlarmHistory
);

/*
|--------------------------------------------------------------------------
| Alarm Statistics
|--------------------------------------------------------------------------
*/

router.get(
    "/statistics",
    validate({
        query: alarmStatisticsValidator
    }),
    alarmController.getAlarmStatistics
);

/*
|--------------------------------------------------------------------------
| Alarm Summary
|--------------------------------------------------------------------------
*/

router.get(
    "/summary",
    validate({
        query: alarmStatisticsValidator
    }),
    alarmController.getAlarmSummary
);

/*
|--------------------------------------------------------------------------
| Alarm Details
|--------------------------------------------------------------------------
*/

router.get(
    "/:alarmId",
    validate({
        params: alarmIdValidator
    }),
    alarmController.getAlarmById
);

/*
|--------------------------------------------------------------------------
| Acknowledge Alarm
|--------------------------------------------------------------------------
*/

router.patch(
    "/:alarmId/acknowledge",
    validate({
        params: alarmIdValidator
    }),
    alarmController.acknowledgeAlarm
);

/*
|--------------------------------------------------------------------------
| Resolve Alarm
|--------------------------------------------------------------------------
*/

router.patch(
    "/:alarmId/resolve",
    validate({
        params: alarmIdValidator,
        body: resolveAlarmValidator
    }),
    alarmController.resolveAlarm
);

/*
|--------------------------------------------------------------------------
| Delete Alarm
|--------------------------------------------------------------------------
*/

router.delete(
    "/:alarmId",
    authorize("ADMIN"),
    validate({
        params: alarmIdValidator
    }),
    alarmController.deleteAlarm
);

export default router;