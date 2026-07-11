import express from "express";
import http from "http";

import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import routes from "./routes/index.js";

import logger from "./utils/logger.js";
import { env } from "./config/env.js";

import errorHandler from "./middlewares/errorHandler.js";
import notFound from "./middlewares/notFound.js";

const app = express();

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

app.use(
    helmet({
        crossOriginResourcePolicy: false
    })
);

app.use(
    cors({
        origin: env.clientOrigins,
        credentials: true
    })
);

/*
|--------------------------------------------------------------------------
| Body Parsing
|--------------------------------------------------------------------------
*/

app.use(express.json({ limit: "10mb" }));

app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb"
    })
);

app.use(cookieParser());

app.use(compression());

/*
|--------------------------------------------------------------------------
| Logging
|--------------------------------------------------------------------------
*/

app.use(
    morgan("combined", {
        stream: {
            write: message => logger.info(message.trim())
        }
    })
);

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {

    res.status(200).json({

        success: true,

        application: "HEMAP",

        version: "1.0.0",

        environment: env.nodeEnv,

        uptime: process.uptime(),

        timestamp: new Date()

    });

});

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

app.use("/api/v1", routes);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use(notFound);

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

export default app;