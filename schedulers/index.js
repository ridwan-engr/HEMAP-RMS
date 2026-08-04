import logger from "../utils/logger.js";

import {
    runAnalyticsScheduler
} from "./analyticsScheduler.js";

import {
    startSyncScheduler,
    stopSyncScheduler
} from "./syncScheduler.js";

import {
    runMaintenanceScheduler
} from "./maintenanceScheduler.js";

import {
    runHealthScheduler
} from "./healthScheduler.js";

import {
    runDashboardScheduler
} from "./dashboardScheduler.js";

import schedulerService from "./schedulerService.js";

/*
|--------------------------------------------------------------------------
| Start All Schedulers
|--------------------------------------------------------------------------
*/

export default function startSchedulers() {

    logger.info("Initializing application schedulers...");

    runAnalyticsScheduler();

    startSyncScheduler();

    runMaintenanceScheduler();

    runHealthScheduler();

    runDashboardScheduler();

    schedulerService.start();

    logger.info("All schedulers initialized successfully.");
}

/*
|--------------------------------------------------------------------------
| Stop All Schedulers
|--------------------------------------------------------------------------
*/

export function stopSchedulers() {

    logger.info("Stopping application schedulers...");

    stopSyncScheduler();

    if (typeof schedulerService.stop === "function") {
        schedulerService.stop();
    }

    logger.info("All schedulers stopped.");
}