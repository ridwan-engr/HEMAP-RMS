import cron from "node-cron";
import dashboardService from "../services/dashboard/dashboardService.js";
import Installation from "../models/Installation.js";
import { emitDashboardUpdate } from "../websocket/socketEmitter.js";
import logger from "../utils/logger.js";

async function updateDashboard() {

    try {

        const installations = await Installation.find({

            isActive: true

        }).select("site");

        for (const installation of installations) {

            const dashboard =
                await dashboardService.getDashboard(
                    installation.site
                );

            emitDashboardUpdate(dashboard);

        }

        logger.info("Dashboard updated successfully.");

    }

    catch (error) {

        logger.error("Dashboard scheduler failed.", error);

    }

}

export default function startDashboardScheduler() {

    cron.schedule(

        "*/2 * * * *",

        updateDashboard,

        {

            timezone: "Africa/Lagos"

        }

    );

}