import { Server } from "socket.io";

import logger from "../utils/logger.js";

let io = null;

/*
|--------------------------------------------------------------------------
| Initialize Socket.IO
|--------------------------------------------------------------------------
*/

export function initializeSocket(server) {

    io = new Server(server, {

        cors: {

            origin: process.env.CLIENT_ORIGIN

                ? process.env.CLIENT_ORIGIN.split(",")

                : "*",

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

    io.on(

        "connection",

        socket => {

            logger.info(

                `Socket Connected: ${socket.id}`

            );

            /*
            |--------------------------------------------------------------------------
            | Join User Room
            |--------------------------------------------------------------------------
            */

            socket.on(

                "join-user",

                userId => {

                    if (!userId) {

                        return;

                    }

                    socket.join(

                        `user:${userId}`

                    );

                }

            );

            /*
            |--------------------------------------------------------------------------
            | Join Site Room
            |--------------------------------------------------------------------------
            */

            socket.on(

                "join-site",

                siteId => {

                    if (!siteId) {

                        return;

                    }

                    socket.join(

                        `site:${siteId}`

                    );

                }

            );

            /*
            |--------------------------------------------------------------------------
            | Leave Site
            |--------------------------------------------------------------------------
            */

            socket.on(

                "leave-site",

                siteId => {

                    socket.leave(

                        `site:${siteId}`

                    );

                }

            );

            /*
            |--------------------------------------------------------------------------
            | Ping
            |--------------------------------------------------------------------------
            */

            socket.on(

                "ping",

                () => {

                    socket.emit(

                        "pong",

                        {

                            timestamp:

                                Date.now()

                        }

                    );

                }

            );

            /*
            |--------------------------------------------------------------------------
            | Disconnect
            |--------------------------------------------------------------------------
            */

            socket.on(

                "disconnect",

                reason => {

                    logger.info(

                        `Socket Disconnected: ${socket.id} (${reason})`

                    );

                }

            );

        }

    );

    logger.info(

        "Socket.IO initialized."

    );

    return io;

}

/*
|--------------------------------------------------------------------------
| Socket Instance
|--------------------------------------------------------------------------
*/

export function getSocketIO() {

    if (!io) {

        throw new Error(

            "Socket.IO has not been initialized."

        );

    }

    return io;

}

/*
|--------------------------------------------------------------------------
| Emit To User
|--------------------------------------------------------------------------
*/

export function emitToUser(

    userId,

    event,

    payload

) {

    if (!io) {

        return;

    }

    io.to(

        `user:${userId}`

    ).emit(

        event,

        payload

    );

}

/*
|--------------------------------------------------------------------------
| Emit To Site
|--------------------------------------------------------------------------
*/

export function emitToSite(

    siteId,

    event,

    payload

) {

    if (!io) {

        return;

    }

    io.to(

        `site:${siteId}`

    ).emit(

        event,

        payload

    );

}

/*
|--------------------------------------------------------------------------
| Broadcast
|--------------------------------------------------------------------------
*/

export function broadcast(

    event,

    payload

) {

    if (!io) {

        return;

    }

    io.emit(

        event,

        payload

    );

}

export default {

    initializeSocket,

    getSocketIO,

    emitToUser,

    emitToSite,

    broadcast

};