import Site from "../models/Site.js";

import dashboardService from "../services/dashboard/dashboardService.js";

import {

    emitDashboardUpdate

} from "../websocket/eventEmitters.js";

import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Dashboard Scheduler
|--------------------------------------------------------------------------
*/

export async function runDashboardScheduler() {

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

            const dashboard =

                await dashboardService.getDashboard({

                    siteId: site._id.toString()

                });

            emitDashboardUpdate(

                site._id.toString(),

                dashboard

            );

            successful++;

        }

        catch (error) {

            failed++;

            logger.error({

                message:

                    "Dashboard Scheduler Failed.",

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

            "Dashboard Scheduler Completed.",

        ...summary

    });

    return summary;

}

export default {

    runDashboardScheduler

};