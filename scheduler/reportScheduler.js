import cron from "node-cron";

import reportService
from "../services/reports/reportService.js";

import logger from "../utils/logger.js";

async function generateReports() {

    try {

        logger.info(

            "Daily report generation started."

        );

        const result =

            await reportService
                .generateDailyReports();

        logger.info(

            "Daily reports generated.",

            result

        );

    }

    catch (error) {

        logger.error(

            "Report scheduler failed.",

            error

        );

    }

}

export default function startReportScheduler() {

    cron.schedule(

        "0 0 * * *",

        generateReports,

        {

            timezone: "Africa/Lagos"

        }

    );

}