import dns from "dns";
import http from "http";
import mongoose from "mongoose";

import app from "./app.js";

import { env } from "./config/env.js";
import { connectDatabase } from "./config/db.js";

import logger from "./utils/logger.js";

import { initializeSocket } from "./websocket/socket.js";

import startSchedulers, {
    stopSchedulers
} from "./schedulers/index.js";

/*
|--------------------------------------------------------------------------
| DNS
|--------------------------------------------------------------------------
*/

dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
]);

/*
|--------------------------------------------------------------------------
| HTTP Server
|--------------------------------------------------------------------------
*/

const server = http.createServer(app);

/*
|--------------------------------------------------------------------------
| Start Application
|--------------------------------------------------------------------------
*/

async function startServer() {

    try {

        await connectDatabase();

        initializeSocket(server);

        startSchedulers();

        server.listen(
            env.port,
            () => {

                logger.success({

                    application: "HEMAP-RMS",

                    environment: env.nodeEnv,

                    port: env.port,

                    message: "Server started successfully."

                });

            }
        );

    }

    catch (error) {

        logger.error({

            message: "Server startup failed.",

            error: error.message,

            stack: error.stack

        });

        process.exit(1);

    }

}

startServer();

/*
|--------------------------------------------------------------------------
| Unhandled Errors
|--------------------------------------------------------------------------
*/

process.on(

    "uncaughtException",

    error => {

        logger.error({

            type: "uncaughtException",

            message: error.message,

            stack: error.stack

        });

    }

);

process.on(

    "unhandledRejection",

    error => {

        logger.error({

            type: "unhandledRejection",

            message: error?.message,

            stack: error?.stack

        });

    }

);

/*
|--------------------------------------------------------------------------
| Graceful Shutdown
|--------------------------------------------------------------------------
*/

async function gracefulShutdown(signal) {

    logger.info(

        `Received ${signal}. Shutting down...`

    );

    try {

        stopSchedulers();

        await mongoose.connection.close();

        logger.success(

            "MongoDB connection closed."

        );

        server.close(

            () => {

                logger.success(

                    "HTTP server stopped."

                );

                process.exit(0);

            }

        );

    }

    catch (error) {

        logger.error({

            message: "Shutdown failed.",

            error: error.message

        });

        process.exit(1);

    }

}

process.on(

    "SIGINT",

    () => gracefulShutdown("SIGINT")

);

process.on(

    "SIGTERM",

    () => gracefulShutdown("SIGTERM")

);