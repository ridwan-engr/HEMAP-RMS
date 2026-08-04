import * as maintenanceService

from "../services/maintenance/maintenanceService.js";

import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Cleanup Scheduler
|--------------------------------------------------------------------------
*/

export async function runCleanupScheduler() {

    const started = Date.now();

    try {

        logger.info({

            message:

                "Cleanup Scheduler Started."

        });

        const result =

            await maintenanceService.cleanupAll();

        logger.info({

            message:

                "Cleanup Scheduler Completed.",

            result,

            duration:

                Date.now() - started

        });

        return result;

    }

    catch (error) {

        logger.error({

            message:

                "Cleanup Scheduler Failed.",

            error:

                error.message

        });

        throw error;

    }

}

export default {

    runCleanupScheduler

};