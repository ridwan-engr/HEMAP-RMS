import Site from "../models/Site.js";

import * as analyticsService from "../services/analytics/analyticsService.js";

import logger from "../utils/logger.js";

import {
    emitAnalytics
} from "../websocket/eventEmitters.js";

/*
|--------------------------------------------------------------------------
| Analytics Scheduler
|--------------------------------------------------------------------------
*/

export async function runAnalyticsScheduler() {

    const started = Date.now();

    let processed = 0;

    let successful = 0;

    let failed = 0;

    const sites = await Site.find({

        status: "ACTIVE"

    }).select("_id name");

    for (const site of sites) {

        processed++;

        try {

            const analytics =

                await analyticsService.getDashboardAnalytics({

                    siteId: site._id.toString()

                });

            emitAnalytics(

                site._id.toString(),

                {

                    module: "analytics",

                    analytics

                }

            );

            successful++;

            logger.info({

                message:

                    "Analytics generated.",

                siteId:

                    site._id,

                site:

                    site.name

            });

        }

        catch (error) {

            failed++;

            logger.error({

                message:

                    "Analytics Scheduler Failed.",

                siteId:

                    site._id,

                error:

                    error.message

            });

        }

    }

    const summary = {

        processed,

        successful,

        failed,

        duration:

            Date.now() - started

    };

    logger.info({

        message:

            "Analytics Scheduler Completed.",

        ...summary

    });

    return summary;

}

export async function runAnalyticsNow() {

    return runAnalyticsScheduler();

}

export default {

    runAnalyticsScheduler,

    runAnalyticsNow

};