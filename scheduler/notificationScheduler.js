import cron from "node-cron";

import notificationService
from "../services/notifications/notificationService.js";

import logger from "../utils/logger.js";

async function processNotifications() {

    try {

        const result =

            await notificationService
                .processScheduledNotifications();

        logger.info(

            "Notification queue processed.",

            result

        );

    }

    catch (error) {

        logger.error(

            "Notification scheduler failed.",

            error

        );

    }

}

export default function startNotificationScheduler() {

    cron.schedule(

        "*/5 * * * *",

        processNotifications,

        {

            timezone: "Africa/Lagos"

        }

    );

}