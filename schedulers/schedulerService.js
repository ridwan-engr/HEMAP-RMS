import { registerCronJobs } from "./cronJobs.js";

import logger from "../utils/logger.js";

class SchedulerService {

    constructor() {

        this.running = false;

        this.jobs = [];

    }

    /*
    |--------------------------------------------------------------------------
    | Start Scheduler
    |--------------------------------------------------------------------------
    */

    start() {

        if (this.running) {

            logger.warn(

                "Scheduler is already running."

            );

            return this.jobs;

        }

        this.jobs = registerCronJobs();

        this.running = true;

        logger.success(

            "Scheduler started successfully."

        );

        return this.jobs;

    }

    /*
    |--------------------------------------------------------------------------
    | Stop Scheduler
    |--------------------------------------------------------------------------
    */

    stop() {

        if (!this.running) {

            logger.warn(

                "Scheduler is not running."

            );

            return;

        }

        for (const job of this.jobs) {

            if (

                job &&

                typeof job.stop === "function"

            ) {

                job.stop();

            }

        }

        this.jobs = [];

        this.running = false;

        logger.info(

            "Scheduler stopped."

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Restart Scheduler
    |--------------------------------------------------------------------------
    */

    restart() {

        this.stop();

        return this.start();

    }

    /*
    |--------------------------------------------------------------------------
    | Scheduler Status
    |--------------------------------------------------------------------------
    */

    status() {

        return {

            running: this.running,

            totalJobs: this.jobs.length

        };

    }

}

export default new SchedulerService();