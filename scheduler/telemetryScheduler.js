import cron from "node-cron";

import syncService from "../services/vrm/syncService.js";
import { normalizeTelemetry } from "../services/vrm/normalize.js";

import Telemetry from "../models/Telemetry.js";

import logger from "../utils/logger.js";

/**
 * Persist synchronized telemetry
 */
async function persistTelemetry(results) {

    for (const result of results) {

        try {

            if (!result.telemetry) {

                continue;

            }

            const normalized = normalizeTelemetry(

                result.installation,

                result.telemetry,

                result.alarms,

                result.statistics

            );

            await Telemetry.create(normalized);

        }

        catch (error) {

            logger.error(

                "Unable to save telemetry.",

                error

            );

        }

    }

}

/**
 * Execute one synchronization cycle
 */
export async function synchronizeTelemetry() {

    try {

        logger.info(

            "Telemetry synchronization started."

        );

        const results = await syncService.synchronizeAll();

        await persistTelemetry(results);

        logger.info(

            `Telemetry synchronization completed (${results.length} installations).`

        );

        return results;

    }

    catch (error) {

        logger.error(

            "Telemetry synchronization failed.",

            error

        );

    }

}

/**
 * Start telemetry scheduler
 *
 * Every minute.
 * Adjust to *///30 //* //*// * //* //* //for every 30 seconds if desired.
 //*/
export function startTelemetryScheduler() {

    logger.info(

        "Starting telemetry scheduler."

    );

    cron.schedule(

        "*/1 * * * *",

        synchronizeTelemetry,

        {

            timezone: "Africa/Lagos"

        }

    );

}

export default {

    synchronizeTelemetry,

    startTelemetryScheduler

};