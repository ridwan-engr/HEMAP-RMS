import cron from "node-cron";

import statisticsService
    from "../services/analytics/statisticsService.js";

import forecastService
    from "../services/analytics/forecastService.js";

import reliabilityService
    from "../services/analytics/reliabilityService.js";

import insightsService
    from "../services/analytics/insightsService.js";

import Installation
    from "../models/Installation.js";

import logger
    from "../utils/logger.js";

async function runAnalytics() {

    try {

        logger.info(
            "Analytics scheduler started."
        );

        const installations = await Installation
            .find({ isActive: true })
            .select("site installationId name");

        if (!installations.length) {

            logger.warn(
                "No active installations found."
            );

            return;

        }

        for (const installation of installations) {

            try {

                const siteId = installation.site;

                await statisticsService
                    .saveStatisticsSnapshot(siteId);

                await forecastService
                    .forecastNext24Hours(siteId);

                await reliabilityService
                    .saveReliabilitySnapshot(siteId);

                await insightsService
                    .generateOperationalInsights(siteId);

                logger.info(
                    `Analytics completed for ${installation.name}`
                );

            }

            catch (error) {

                logger.error(

                    `Analytics failed for installation ${installation.installationId}`,

                    error

                );

            }

        }

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