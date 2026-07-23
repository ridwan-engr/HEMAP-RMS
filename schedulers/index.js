import cron from "node-cron";

import { startTelemetryScheduler } from "./telemetryScheduler.js";
import { startAnalyticsScheduler } from "./analyticsScheduler.js";
import startOptimizationScheduler from "./optimizationScheduler.js";
import startDashboardScheduler from "./dashboardScheduler.js";
import startNotificationScheduler from "./notificationScheduler.js";
import startReportScheduler from "./reportScheduler.js";
import startHealthScheduler from "./healthScheduler.js";
import startCleanupScheduler from "./cleanupScheduler.js";

import logger from "../utils/logger.js";

export default function startSchedulers() {

    logger.info("Starting scheduled jobs...");

    startTelemetryScheduler();

    startAnalyticsScheduler();

    startOptimizationScheduler();

    startDashboardScheduler();

    startNotificationScheduler();

    startReportScheduler();

    startHealthScheduler();

    startCleanupScheduler();

    logger.info("All schedulers started successfully.");

}