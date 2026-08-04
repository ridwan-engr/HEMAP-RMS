import Site from "../models/Site.js";

import * as reportService from "../services/reports/reportService.js";

import logger from "../utils/logger.js";

export async function runReportScheduler() {

    const sites = await Site.find({

        status: "ACTIVE"

    });

    let generated = 0;

    for (const site of sites) {

        try {

            await reportService.generateDailyReports(

                site._id.toString()

            );

            generated++;

        }

        catch (error) {

            logger.error({

                message:

                    "Report generation failed.",

                siteId:

                    site._id,

                error:

                    error.message

            });

        }

    }

    logger.info({

        message:

            "Report Scheduler Completed.",

        generated

    });

}

export default {

    runReportScheduler

};