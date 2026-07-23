import cron from "node-cron";

import cleanupService
from "../services/maintenance/cleanupService.js";

import logger from "../utils/logger.js";

export default function cleanupScheduler() {

    cron.schedule(

        "0 2 * * *",

        async () => {

            try {

                logger.info(

                    "Running cleanup tasks..."

                );

                await cleanupService.cleanupAll();

            }

            catch (error) {

                logger.error(error);

            }

        }

    );

}