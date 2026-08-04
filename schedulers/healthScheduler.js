import mongoose from "mongoose";

import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Health Scheduler
|--------------------------------------------------------------------------
*/

export async function runHealthScheduler() {

    try {

        const report = {

            database:

                mongoose.connection.readyState === 1
                    ? "CONNECTED"
                    : "DISCONNECTED",

            uptime:

                process.uptime(),

            memory:

                process.memoryUsage(),

            timestamp:

                new Date()

        };

        logger.info({

            message:

                "Health check completed.",

            report

        });

        return report;

    }

    catch (error) {

        logger.error({

            message:

                "Health Scheduler Failed.",

            error:

                error.message

        });

        throw error;

    }

}

export default {

    runHealthScheduler

};