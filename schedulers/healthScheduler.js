import cron from "node-cron";

import mongoose from "mongoose";

import logger from "../utils/logger.js";

async function runHealthCheck() {

    try {

        const report = {

            database:

                mongoose.connection.readyState === 1
                    ? "CONNECTED"
                    : "DISCONNECTED",

            uptime:

                process.uptime(),

            memory:

                process.memoryUsage().rss,

            timestamp:

                new Date()

        };

        logger.info(

            "System health verified.",

            report

        );

    }

    catch (error) {

        logger.error(

            "Health scheduler failed.",

            error

        );

    }

}

export default function startHealthScheduler() {

    cron.schedule(

        "*/10 * * * *",

        runHealthCheck,

        {

            timezone: "Africa/Lagos"

        }

    );

}