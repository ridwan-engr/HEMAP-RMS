import Site from "../models/Site.js";

import * as optimizationService from "../services/analytics/optimizationService.js";

import logger from "../utils/logger.js";

import {
    emitAnalytics
} from "../websocket/eventEmitters.js";

/*
|--------------------------------------------------------------------------
| Optimization Scheduler
|--------------------------------------------------------------------------
*/

export async function runOptimizationScheduler() {

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

            const optimization =

                await optimizationService.optimizeWithForecast(

                    site._id.toString()

                );

            /*
            ------------------------------------------------------
            Save Optimization Result
            ------------------------------------------------------
            */

            await optimizationService.saveOptimizationResult(

                site._id,

                optimization

            );

            /*
            ------------------------------------------------------
            Notify Dashboard
            ------------------------------------------------------
            */

            emitAnalytics(

                site._id.toString(),

                {

                    module: "optimization",

                    optimization

                }

            );

            successful++;

            logger.info({

                message:

                    "Optimization completed.",

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

                    "Optimization Scheduler Failed.",

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

            "Optimization Scheduler Completed.",

        ...summary

    });

    return summary;

}

export default {

    runOptimizationScheduler

};