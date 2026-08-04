import Site from "../models/Site.js";

import * as notificationService from "../services/notifications/notificationService.js";

import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Notification Scheduler
|--------------------------------------------------------------------------
*/

export async function runNotificationScheduler() {

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

            const result =

                await notificationService.processScheduledNotifications(

                    site._id.toString()

                );

            successful++;

            logger.info({

                message:

                    "Notification processing completed.",

                siteId:

                    site._id,

                site:

                    site.name,

                notifications:

                    result?.count ?? 0

            });

        }

        catch (error) {

            failed++;

            logger.error({

                message:

                    "Notification Scheduler Failed.",

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

            "Notification Scheduler Completed.",

        ...summary

    });

    return summary;

}

export default {

    runNotificationScheduler

};