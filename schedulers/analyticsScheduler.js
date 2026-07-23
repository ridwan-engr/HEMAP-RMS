import cron from "node-cron";

import dotenv from "dotenv";

import Site from "../models/Site.js";

import logger from "../utils/logger.js";

import {

    statisticsService,

    forecastService,

    optimizationService,

    reliabilityService,

    insightsService,

    cacheService

} from "../services/analytics/index.js";

dotenv.config();

/*
|--------------------------------------------------------------------------
| Build Analytics
|--------------------------------------------------------------------------
*/

async function buildAnalytics(site) {

    const endDate = new Date();

    const startDate = new Date();

    startDate.setHours(

        startDate.getHours() - 24

    );

    const statistics = await statisticsService.calculateStatistics({

        site: site._id,

        startDate,

        endDate

    });

    const forecast = await forecastService.generateForecast({

        site: site._id,

        startDate,

        endDate

    });

    const optimization = await optimizationService.optimize({

        site: site._id,

        startDate,

        endDate

    });

    const reliability = await reliabilityService.calculate({

        site: site._id,

        startDate,

        endDate

    });

    const insights = await insightsService.generateInsights({

        site,

        statistics,

        forecast,

        optimization,

        reliability

    });

    return {

        site: site._id,

        period: "DAILY",

        startDate,

        endDate,

        energy: statistics.energy,

        battery: statistics.battery,

        generator: statistics.generator,

        weather: statistics.weather,

        reliability,

        forecast,

        optimization,

        insights

    };

}

/*
|--------------------------------------------------------------------------
| Scheduler
|--------------------------------------------------------------------------
*/

export async function runAnalyticsScheduler() {

    logger.info(

        "Analytics Scheduler Started"

    );

    const sites = await Site.find({

        isActive: true

    });

    let success = 0;

    let failed = 0;

    for (const site of sites) {

        try {

            const analytics = await buildAnalytics(

                site

            );

            await cacheService.deleteAnalytics({

                site: site._id,

                period: analytics.period,

                startDate: analytics.startDate,

                endDate: analytics.endDate

            });

            await cacheService.saveAnalytics(

                analytics

            );

            success++;

            logger.success(

                `Analytics updated for ${site.name}`

            );

        }

        catch (error) {

            failed++;

            logger.error(

                `${site.name}: ${error.message}`

            );

        }

    }

    await cacheService.cleanupAnalytics(

        365

    );

    logger.info(

        `Analytics Scheduler Finished

Sites : ${sites.length}

Success : ${success}

Failed : ${failed}`

    );

}

/*
|--------------------------------------------------------------------------
| Register Scheduler
|--------------------------------------------------------------------------
*/

export function startAnalyticsScheduler() {

    cron.schedule(

        process.env.ANALYTICS_CRON,

        async () => {

            try {

                await runAnalyticsScheduler();

            }

            catch (error) {

                logger.error(error);

            }

        }

    );

    logger.success(

        "Analytics Scheduler Registered"

    );

}