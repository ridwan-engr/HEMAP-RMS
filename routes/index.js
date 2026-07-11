import { Router } from "express";

import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import roleRoutes from "./roleRoutes.js";

import siteRoutes from "./siteRoutes.js";
import installationRoutes from "./installationRoutes.js";
import telemetryRoutes from "./telemetryRoutes.js"
import analyticsRoutes from "./analyticsRoutes.js";
import statisticRoutes from "./statisticRoutes.js";
import alarmRoutes from "./alarmRoutes.js";

import batteryRoutes from "./batteryRoutes.js";
import solarRoutes from "./solarRoutes.js";
import generatorRoutes from "./generatorRoutes.js";
import gridRoutes from "./gridRoutes.js";
import deviceRoutes from "./deviceRoutes.js";

import weatherRoutes from "./weatherRoutes.js";
import maintenanceRoutes from "./maintenanceRoutes.js";
import faultRoutes from "./faultRoutes.js";

import notificationRoutes from "./notificationRoutes.js";
import reportRoutes from "./reportRoutes.js";
import auditLogRoutes from "./auditLogRoutes.js";

import energyForecastRoutes from "./energyForecastRoutes.js";
import optimizationResultRoutes from "./optimizationResultRoutes.js";
import systemSettingRoutes from "./systemSettingRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
const router = Router();

/*
|--------------------------------------------------------------------------
| API Information
|--------------------------------------------------------------------------
*/

/*router.get("/", (req, res) => {

    res.status(200).json({

        success: true,

        application: "HEMAP API",

        version: "1.0.0",

        status: "Running",

        timestamp: new Date().toISOString()

    });

});

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use("/auth", authRoutes);

/*
|--------------------------------------------------------------------------
| Users & Roles
|--------------------------------------------------------------------------
*/

router.use("/users", userRoutes);
router.use("/roles", roleRoutes);

/*
|--------------------------------------------------------------------------
| Core Monitoring
|--------------------------------------------------------------------------
*/

router.use("/sites", siteRoutes);
router.use("/installations", installationRoutes);
router.use("/telemetry", telemetryRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/statistics", statisticRoutes);
router.use("/alarms", alarmRoutes);

/*
|--------------------------------------------------------------------------
| Power Assets
|--------------------------------------------------------------------------
*/

router.use("/batteries", batteryRoutes);
router.use("/solar", solarRoutes);
router.use("/generators", generatorRoutes);
router.use("/grid", gridRoutes);
router.use("/devices", deviceRoutes);

/*
|--------------------------------------------------------------------------
| Operations
|--------------------------------------------------------------------------
*/

router.use("/weather", weatherRoutes);
router.use("/maintenance", maintenanceRoutes);
router.use("/faults", faultRoutes);

/*
|--------------------------------------------------------------------------
| Reports
|--------------------------------------------------------------------------
*/

router.use("/notifications", notificationRoutes);
router.use("/reports", reportRoutes);
router.use("/audit-logs", auditLogRoutes);

/*
|--------------------------------------------------------------------------
| Optimization
|--------------------------------------------------------------------------
*/

router.use("/forecasts", energyForecastRoutes);
router.use("/optimization", optimizationResultRoutes);
router.use("/settings", systemSettingRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;