import dns from "dns";

import http from "http";

import app from "./app.js";

import { connectDatabase } from "./config/db.js";

import { env } from "./config/env.js";

import logger from "./utils/logger.js";

import { initializeSocket } from "./websocket/socket.js";

import startSchedulers from "./schedulers/index.js";

import mongoose from "mongoose";

import { startAnalyticsScheduler } from "./schedulers/analyticsScheduler.js";

dns.setServers(["8.8.8.8","8.8.4.4"]);

const server = http.createServer(app);

async function startServer() {

    try {

        await connectDatabase();

        initializeSocket(server);

        startSchedulers();

        startAnalyticsScheduler();

        server.listen(env.port, () => {

            logger.info(

                `HEMAP-RMS running on ${env.port}`

            );

        });

    }

    catch (error) {

        logger.error(error);

        process.exit(1);

    }

}

startServer();

/*
|--------------------------------------------------------------------------
| Graceful Shutdown
|--------------------------------------------------------------------------
*/

process.on("SIGTERM", async () => {

    logger.info("Stopping HEMAP...");

    await mongoose.connection.close();

    server.close(() => {

        process.exit(0);

    });

    process.on(

        "uncaughtException",

        error => {

            logger.error(error);

        }

    );

    process.on(

        "unhandledRejection",

        error => {

            logger.error(error);

        }

    );

});