import cron from "node-cron";

import statisticsService
from "../services/analytics/statisticsService.js";

import forecastService
from "../services/analytics/forecastService.js";

import reliabilityService
from "../services/analytics/reliabilityService.js";

import insightsService
from "../services/analytics/insightsService.js";

import logger from "../utils/logger.js";

async function runAnalytics() {

    try {

        logger.info(
            "Analytics scheduler started."
        );

        await statisticsService
            .saveStatisticsSnapshot();

        await forecastService
            .forecastNext24Hours();

        await reliabilityService
            .saveReliabilitySnapshot();

        await insightsService
            .generateOperationalInsights();

        logger.info(
            "Analytics scheduler completed."
        );

    }

    catch (error) {

        logger.error(
            "Analytics scheduler failed.",
            error
        );

    }

}

export default function startAnalyticsScheduler() {

    cron.schedule(

        "*/5 * * * *",

        runAnalytics,

        {

            timezone: "Africa/Lagos"

        }

    );

}