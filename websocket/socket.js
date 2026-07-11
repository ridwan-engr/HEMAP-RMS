import { Server } from "socket.io";

import env from "../config/env.js";
import logger from "../utils/logger.js";

import registerSocketEvents from "./socketEvents.js";

let io = null;

/*
|--------------------------------------------------------------------------
| Initialize Socket.IO
|--------------------------------------------------------------------------
*/

export function initializeSocket(server) {

    io = new Server(server, {

        cors: {

            origin: env.clientOrigins,

            credentials: true,

            methods: [

                "GET",

                "POST"

            ]

        },

        transports: [

            "websocket",

            "polling"

        ]

    });

    registerSocketEvents(io);

    logger.info("Socket.IO initialized.");

    return io;

}

/*
|--------------------------------------------------------------------------
| Socket Instance
|--------------------------------------------------------------------------
*/

export function getIO() {

    if (!io) {

        throw new Error(

            "Socket.IO has not been initialized."

        );

    }

    return io;

}

export default {

    initializeSocket,

    getIO

};