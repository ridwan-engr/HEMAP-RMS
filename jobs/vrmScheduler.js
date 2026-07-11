import cron from "node-cron";

import logger from "../utils/logger.js";

import { env } from "../config/env.js";

import { syncVRM } from "../services/vrm/syncService.js";

import { getIO } from "../socket/socketManager.js";

let running = false;

let task = null;

/**
 * Execute one synchronization cycle.
 */
async function executeSync() {

    if (running) {

        logger.warn(

            "VRM synchronization skipped because a previous job is still running."

        );

        return;

    }

    running = true;

    const startedAt = new Date();

    const started = Date.now();

    try {

        const io = getIO();

        const result = await syncVRM(io);

        logger.info({

            message: "VRM synchronization completed.",

            startedAt,
            
            durationMs: Date.now() - started,

            installations:

                result.installations,

            telemetry:

                result.telemetry,

            alarms:

                result.alarms,

            statistics:

                result.statistics

        });

    }

    catch (error) {

        logger.error({

            message: "VRM synchronization failed.",

            error: error.message,

            stack: error.stack

        });

    }

    finally {

        running = false;

    }

}

/**
 * Start the scheduler.
 */
export function startVRMScheduler() {

    if (task) {

        logger.warn(

            "VRM scheduler is already running."

        );

        return task;

    }

    const schedule = env.vrmSyncCron;

    task = cron.schedule(

        schedule,

        executeSync,

        {

            scheduled: true,
            timezone: env.timezone

        }

    );

    executeSync().catch(logger.error);

    logger.info(

        `VRM Scheduler started (${schedule}).`

    );

    return task;

}

/**
 * Stop scheduler.
 */
export function stopVRMScheduler() {

    if (!task) return;

    task.stop();

    task.destroy();

    task = null;

    logger.info(

        "VRM Scheduler stopped."

    );

}

/**
 * Manual synchronization.
 */
export async function runManualSync() {

    logger.info(

        "Manual VRM synchronization started."

    );

    await executeSync();

}

export default {

    startVRMScheduler,

    stopVRMScheduler,

    runManualSync

};