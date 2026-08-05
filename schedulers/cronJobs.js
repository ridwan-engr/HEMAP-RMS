import cron from "node-cron";

import logger from "../utils/logger.js";

import { runTelemetrySync } from "./syncScheduler.js";
import { runForecastScheduler } from "./forecastScheduler.js";
import { runOptimizationScheduler } from "./optimizationScheduler.js";
import { runReportScheduler } from "./reportScheduler.js";
import { runNotificationScheduler } from "./notificationScheduler.js";
import { runMaintenanceScheduler } from "./maintenanceScheduler.js";
import { runDashboardScheduler } from "./dashboardScheduler.js";
import { runHealthScheduler } from "./healthScheduler.js";

export function registerCronJobs() {

    logger.info(
        "=================================="
    );

    logger.info(
        "Starting Scheduler..."
    );

    logger.info(
        "=================================="
    );

    const jobs = [];

    /*
    |--------------------------------------------------------------------------
    | Every Minute
    |--------------------------------------------------------------------------
    */

    jobs.push(

        cron.schedule("* * * * *", async () => {

            try {

                logger.info(
                    "[CRON] Telemetry Synchronization"
                );

                await runTelemetrySync();

            }

            catch (error) {

                logger.error({

                    message:
                        "Telemetry Scheduler Failed",

                    error:
                        error.message

                });

            }

        })

    );

    /*
    |--------------------------------------------------------------------------
    | Every 30 Minutes
    |--------------------------------------------------------------------------
    */

    jobs.push(

        cron.schedule("*/30 * * * *", async () => {

            try {

                logger.info(
                    "[CRON] Forecast Scheduler"
                );

                await runForecastScheduler();

            }

            catch (error) {

                logger.error({

                    message:
                        "Forecast Scheduler Failed",

                    error:
                        error.message

                });

            }

        })

    );

    /*
    |--------------------------------------------------------------------------
    | Every Hour
    |--------------------------------------------------------------------------
    */

    jobs.push(

        cron.schedule("0 * * * *", async () => {

            try {

                logger.info(
                    "[CRON] Optimization Scheduler"
                );

                await runOptimizationScheduler();

            }

            catch (error) {

                logger.error({

                    message:
                        "Optimization Scheduler Failed",

                    error:
                        error.message

                });

            }

        })

    );

    /*
    |--------------------------------------------------------------------------
    | Every Day
    |--------------------------------------------------------------------------
    */

    jobs.push(

        cron.schedule("0 0 * * *", async () => {

            try {

                logger.info(
                    "[CRON] Report Scheduler"
                );

                await runReportScheduler();

            }

            catch (error) {

                logger.error({

                    message:
                        "Report Scheduler Failed",

                    error:
                        error.message

                });

            }

        })

    );

    /*
    |--------------------------------------------------------------------------
    | Every Five Minutes
    |--------------------------------------------------------------------------
    */

    jobs.push(

        cron.schedule("*/5 * * * *", async () => {

            try {

                logger.info(
                    "[CRON] Notification Scheduler"
                );

                await runNotificationScheduler();

            }

            catch (error) {

                logger.error({

                    message:
                        "Notification Scheduler Failed",

                    error:
                        error.message

                });

            }

        })

    );

    /*
    |--------------------------------------------------------------------------
    | Every Day at 02:00
    |--------------------------------------------------------------------------
    */

    jobs.push(

        cron.schedule("0 2 * * *", async () => {

            try {

                logger.info(
                    "[CRON] Maintenance Scheduler"
                );

                await runMaintenanceScheduler();

            }

            catch (error) {

                logger.error({

                    message:
                        "Maintenance Scheduler Failed",

                    error:
                        error.message

                });

            }

        })

    );

    /*
    |--------------------------------------------------------------------------
    | Every 15 Minutes
    |--------------------------------------------------------------------------
    */

    jobs.push(

        cron.schedule("15 * * * *", async () => {

            try {

                logger.info(
                    "[CRON] Analytics Scheduler"
                );

                await runAnalyticsScheduler();

            }

            catch (error) {

                logger.error({

                    message:
                        "Analytics Scheduler Failed",

                    error:
                        error.message

                });

            }

        })

    );

    /*
    |--------------------------------------------------------------------------
    | Every 1/5 Minutes
    |--------------------------------------------------------------------------
    */

    jobs.push(

        cron.schedule("*/2 * * * *", async () => {

            try {

                logger.info(
                    "[CRON] Dashboard Scheduler"
                );

                await runDashboardScheduler();

            }

            catch (error) {

                logger.error({

                    message:
                        "Dashboard Scheduler Failed",

                    error:
                        error.message

                });

            }

        })

    );

    /*
    |--------------------------------------------------------------------------
    | Every 6 MINUTES
    |--------------------------------------------------------------------------
    */

    jobs.push(

        cron.schedule("*/10 * * * *", async () => {

            try {

                logger.info(
                    "[CRON] Health Scheduler"
                );

                await runHealthScheduler();

            }

            catch (error) {

                logger.error({

                    message:
                        "Health Scheduler Failed",

                    error:
                        error.message

                });

            }

        })

    );

     /*
    |--------------------------------------------------------------------------
    | Every 2:30  
    |--------------------------------------------------------------------------
    */

     jobs.push(

        cron.schedule("30 2 * * *", async () => {

            try {

                logger.info(
                    "[CRON] Cleanup Scheduler"
                );

                await runCleanupScheduler();

            }

            catch (error) {

                logger.error({

                    message:
                        "Cleanup Scheduler Failed",

                    error:
                        error.message

                });

            }

        })

    );


    return jobs;

}