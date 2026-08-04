import mongoose from "mongoose";

import { env } from "./env.js";

import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| MongoDB
|--------------------------------------------------------------------------
*/

mongoose.set(

    "strictQuery",

    true

);

let listenersRegistered = false;

export async function connectDatabase() {

    try {

        const connection = await mongoose.connect(

            env.mongodbUri,

            {

                autoIndex:

                    env.nodeEnv !== "production"

            }

        );

        logger.success({

            message:

                "MongoDB connected successfully.",

            database:

                connection.connection.name,

            host:

                connection.connection.host

        });

        if (

            !listenersRegistered

        ) {

            listenersRegistered = true;

            mongoose.connection.on(

                "connected",

                () => {

                    logger.success(

                        "MongoDB connection established."

                    );

                }

            );

            mongoose.connection.on(

                "disconnected",

                () => {

                    logger.warn(

                        "MongoDB disconnected."

                    );

                }

            );

            mongoose.connection.on(

                "reconnected",

                () => {

                    logger.success(

                        "MongoDB reconnected."

                    );

                }

            );

            mongoose.connection.on(

                "error",

                error => {

                    logger.error({

                        message:

                            "MongoDB runtime error",

                        name:

                            error.name,

                        error:

                            error.message,

                        stack:

                            error.stack

                    });

                }

            );

        }

        return connection;

    }

    catch (error) {

        logger.error({

            message:

                "Failed to connect to MongoDB.",

            name:

                error.name,

            error:

                error.message,

            stack:

                error.stack

        });

        process.exit(1);

    }

}

export default connectDatabase;