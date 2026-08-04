import cron from "node-cron";

import logger from "../utils/logger.js";

import syncService from "../services/vrm/syncService.js";

import Installation from "../models/Installation.js";

/*
|--------------------------------------------------------------------------
| Sync Scheduler
|--------------------------------------------------------------------------
*/

let syncJob = null;

/*
|--------------------------------------------------------------------------
| Execute Synchronization
|--------------------------------------------------------------------------
*/

async function executeSync() {

    const started = Date.now();

    try {

        logger.info(
            "VRM synchronization started."
        );

        const result =
            await syncService.synchronizeAll();

        const duration =
            Date.now() - started;

        logger.info({

            message:
                "VRM synchronization completed.",

            synchronized:
                result.length,

            duration

        });

        return {

            synchronized:
                result.length,

            duration,

            result

        };

    }

    catch (error) {

        logger.error({

            message:
                "VRM synchronization failed.",

            error:
                error.message,

            stack:
                error.stack

        });

        return {

            synchronized: 0,

            duration:
                Date.now() - started,

            result: []

        };

    }

}

/*
|--------------------------------------------------------------------------
| Start Scheduler
|--------------------------------------------------------------------------
*/

export function startSyncScheduler() {

    if (syncJob) {

        logger.warn(
            "VRM Sync Scheduler is already running."
        );

        return syncJob;

    }

    syncJob = cron.schedule(

        "*/5 * * * *",

        executeSync,

        {

            timezone: "Africa/Lagos"

        }

    );

    logger.info(
        "VRM Sync Scheduler initialized."
    );

    return syncJob;

}

/*
|--------------------------------------------------------------------------
| Stop Scheduler
|--------------------------------------------------------------------------
*/

export function stopSyncScheduler() {

    if (!syncJob) {

        logger.warn(
            "VRM Sync Scheduler is not running."
        );

        return;

    }

    syncJob.stop();

    syncJob.destroy();

    syncJob = null;

    logger.info(
        "VRM Sync Scheduler stopped."
    );

}

/*
|--------------------------------------------------------------------------
| Manual Trigger
|--------------------------------------------------------------------------
*/

export async function runSyncNow() {

    return await executeSync();

}


export async function runTelemetrySync() {

    logger.info(
        "Manual telemetry synchronization started."
    );

    return executeSync();

}

export default {

    startSyncScheduler,

    stopSyncScheduler,

    runSyncNow,

    runTelemetrySync

};