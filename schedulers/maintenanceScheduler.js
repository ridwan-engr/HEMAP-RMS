import Site from "../models/Site.js";

import * as maintenanceService from "../services/maintenance/maintenanceService.js";

import logger from "../utils/logger.js";

import {
    emitNotification
} from "../websocket/eventEmitters.js";

/*
|--------------------------------------------------------------------------
| Maintenance Scheduler
|--------------------------------------------------------------------------
*/

export async function runMaintenanceScheduler() {

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

            const maintenance =

                await maintenanceService.generateScheduledMaintenance(

                    site._id.toString()

                );

            /*
            ------------------------------------------------------
            Notify dashboard/users if maintenance is required
            ------------------------------------------------------
            */

            if (maintenance?.notifications?.length) {

                emitNotification(

                    site._id.toString(),

                    {

                        module: "maintenance",

                        notifications:

                            maintenance.notifications

                    }

                );

            }

            successful++;

            logger.info({

                message:

                    "Maintenance evaluation completed.",

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

                    "Maintenance Scheduler Failed.",

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

            "Maintenance Scheduler Completed.",

        ...summary

    });

    return summary;

}

export async function runMaintenanceNow() {

    return runMaintenanceScheduler();

}

export default {

    runMaintenanceScheduler,

    runMaintenanceNow

};