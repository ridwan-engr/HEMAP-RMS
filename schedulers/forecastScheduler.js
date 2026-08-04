import Site from "../models/Site.js";

import * as forecastService from "../services/analytics/forecastService.js";

import logger from "../utils/logger.js";

import {
    emitAnalytics
} from "../websocket/eventEmitters.js";

/*
|--------------------------------------------------------------------------
| Forecast Scheduler
|--------------------------------------------------------------------------
*/

export async function runForecastScheduler() {

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

            const forecast =

                await forecastService.getForecastDashboard(

                    site._id.toString()

                );

            emitAnalytics(

                site._id.toString(),

                {

                    module: "forecast",

                    forecast

                }

            );

            successful++;

            logger.info({

                message:

                    "Forecast completed.",

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

                    "Forecast Scheduler Failed.",

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

            "Forecast Scheduler Completed.",

        ...summary

    });

    return summary;

}

export default {

    runForecastScheduler

};