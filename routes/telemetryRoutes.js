import { Router } from "express";

import telemetryController from "../controllers/telemetryController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {

    telemetrySchema,

    telemetryQuerySchema,

    telemetryIdSchema

} from "../validators/telemetryValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Live Monitoring
|--------------------------------------------------------------------------
*/

router.get(
    "/live",
    authenticate,
    validate({ query: telemetryQuerySchema }),
    telemetryController.getLiveTelemetry
);

router.get(
    "/history",
    authenticate,
    validate({ query: telemetryQuerySchema }),
    telemetryController.getHistoricalTelemetry
);

router.get(
    "/latest",
    authenticate,
    telemetryController.latestSnapshot
);

router.get(
    "/status/device",
    authenticate,
    telemetryController.deviceStatus
);

router.get(
    "/status/communication",
    authenticate,
    telemetryController.communicationStatus
);

router.post(
    "/synchronize",
    authenticate,
    authorize("admin"),
    telemetryController.synchronize
);

/*
|--------------------------------------------------------------------------
| Component Telemetry
|--------------------------------------------------------------------------
*/

router.get(
    "/component/:installationId",
    authenticate,
    telemetryController.componentTelemetry
);

router.get(
    "/battery/:installationId",
    authenticate,
    telemetryController.batteryTelemetry
);

router.get(
    "/solar/:installationId",
    authenticate,
    telemetryController.solarTelemetry
);

router.get(
    "/generator/:installationId",
    authenticate,
    telemetryController.generatorTelemetry
);

router.get(
    "/grid/:installationId",
    authenticate,
    telemetryController.gridTelemetry
);

router.get(
    "/inverter/:installationId",
    authenticate,
    telemetryController.inverterTelemetry
);

router.get(
    "/rectifier/:installationId",
    authenticate,
    telemetryController.rectifierTelemetry
);

router.get(
    "/smart-meter/:installationId",
    authenticate,
    telemetryController.smartMeterTelemetry
);

router.get(
    "/load/:installationId",
    authenticate,
    telemetryController.loadTelemetry
);

/*
|--------------------------------------------------------------------------
| Analytics
|--------------------------------------------------------------------------
*/

router.get(
    "/statistics",
    authenticate,
    validate({ query: telemetryQuerySchema }),
    telemetryController.telemetryStatistics
);

router.get(
    "/trends",
    authenticate,
    validate({ query: telemetryQuerySchema }),
    telemetryController.telemetryTrends
);

router.get(
    "/kpis",
    authenticate,
    telemetryController.liveKPIs
);

router.get(
    "/alarms",
    authenticate,
    telemetryController.alarmSummary
);

router.get(
    "/analytics/battery",
    authenticate,
    telemetryController.batteryAnalytics
);

router.get(
    "/analytics/solar",
    authenticate,
    telemetryController.solarAnalytics
);

router.get(
    "/analytics/generator",
    authenticate,
    telemetryController.generatorAnalytics
);

router.get(
    "/analytics/grid",
    authenticate,
    telemetryController.gridAnalytics
);

router.get(
    "/analytics/weather",
    authenticate,
    telemetryController.weatherAnalytics
);

router.get(
    "/forecast",
    authenticate,
    telemetryController.energyForecast
);

router.get(
    "/reliability",
    authenticate,
    telemetryController.reliabilitySummary
);

/*
|--------------------------------------------------------------------------
| Administration
|--------------------------------------------------------------------------
*/

router.get(
    "/export",
    authenticate,
    authorize("admin"),
    telemetryController.exportTelemetry
);

router.post(
    "/import",
    authenticate,
    authorize("admin"),
    validate({ body: telemetrySchema }),
    telemetryController.importTelemetry
);

router.post(
    "/refresh-cache",
    authenticate,
    authorize("admin"),
    telemetryController.refreshCache
);

router.post(
    "/broadcast",
    authenticate,
    authorize("admin"),
    telemetryController.broadcastTelemetry
);

router.get(
    "/health",
    authenticate,
    authorize("admin"),
    telemetryController.telemetryHealth
);

export default router;