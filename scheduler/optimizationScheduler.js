import cron from "node-cron";

import optimizationService
from "../services/analytics/optimizationService.js";

import logger from "../utils/logger.js";

async function runOptimization() {

    try {

        logger.info(
            "Optimization scheduler started."
        );

        const result =

            await optimizationService
                .optimizeWithForecast();

        logger.info(
            "Optimization completed.",
            result
        );

    }

    catch (error) {

        logger.error(
            "Optimization scheduler failed.",
            error
        );

    }

}

export default function startOptimizationScheduler() {

    cron.schedule(

        "*/15 * * * *",

        runOptimization,

        {

            timezone: "Africa/Lagos"

        }

    );

}