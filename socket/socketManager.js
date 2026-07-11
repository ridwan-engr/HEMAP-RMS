import { Server } from "socket.io";

import { env } from "../config/env.js";

import logger from "../utils/logger.js";

let io = null;

/*
|--------------------------------------------------------------------------
| Internal Helper
|--------------------------------------------------------------------------
*/

function canEmit() {

    if (!io) {

        logger.warn(

            "Socket.IO has not been initialized."

        );

        return false;

    }

    return true;

}

/*
|--------------------------------------------------------------------------
| Initialize Socket.IO
|--------------------------------------------------------------------------
*/

export function initializeSocket(server) {

    io = new Server(server, {

        cors: {

            origin: env.clientOrigins,

            credentials: true

        },

        transports: [

            "websocket",

            "polling"

        ]

    });

    /*
    |--------------------------------------------------------------------------
    | Engine Errors
    |--------------------------------------------------------------------------
    */

    io.engine.on(

        "connection_error",

        error => {

            logger.error({

                message:

                    "Socket.IO connection error.",

                error:

                    error.message

            });

        }

    );

    /*
    |--------------------------------------------------------------------------
    | Client Connections
    |--------------------------------------------------------------------------
    */

    io.on(

        "connection",

        socket => {

            logger.info({

                message:

                    "Socket connected.",

                socketId:

                    socket.id

            });

            /*
            --------------------------------------------------------------
            Join monitoring room
            --------------------------------------------------------------
            */

            socket.on(

                "join-site",

                siteId => {

                    const room = String(siteId);

                    socket.join(room);

                    logger.info({

                        message:

                            "Joined monitoring room.",

                        socketId:

                            socket.id,

                        room

                    });

                }

            );

            /*
            --------------------------------------------------------------
            Leave monitoring room
            --------------------------------------------------------------
            */

            socket.on(

                "leave-site",

                siteId => {

                    const room = String(siteId);

                    socket.leave(room);

                    logger.info({

                        message:

                            "Left monitoring room.",

                        socketId:

                            socket.id,

                        room

                    });

                }

            );

            /*
            --------------------------------------------------------------
            Disconnect
            --------------------------------------------------------------
            */

            socket.on(

                "disconnect",

                reason => {

                    logger.info({

                        message:

                            "Socket disconnected.",

                        socketId:

                            socket.id,

                        reason

                    });

                }

            );

        }

    );

    logger.success(

        "Socket.IO initialized successfully."

    );

    return io;

}

/*
|--------------------------------------------------------------------------
| Get Socket.IO Instance
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

/*
|--------------------------------------------------------------------------
| Emit Helpers
|--------------------------------------------------------------------------
*/

export function emitTelemetry(

    siteId,

    telemetry

) {

    if (!canEmit()) return;

    io.to(

        String(siteId)

    ).emit(

        "telemetry.updated",

        telemetry

    );

    logger.debug({

        event:

            "telemetry.updated",

        siteId

    });

}

export function emitAlarm(

    siteId,

    alarm

) {

    if (!canEmit()) return;

    io.to(

        String(siteId)

    ).emit(

        "alarm.created",

        alarm

    );

    logger.debug({

        event:

            "alarm.created",

        siteId

    });

}

export function emitStatistic(

    siteId,

    statistic

) {

    if (!canEmit()) return;

    io.to(

        String(siteId)

    ).emit(

        "statistic.updated",

        statistic

    );

    logger.debug({

        event:

            "statistic.updated",

        siteId

    });

}

export function emitSite(

    siteId,

    site

) {

    if (!canEmit()) return;

    io.to(

        String(siteId)

    ).emit(

        "site.updated",

        site

    );

    logger.debug({

        event:

            "site.updated",

        siteId

    });

}

export function emitSyncStatus(

    status

) {

    if (!canEmit()) return;

    io.emit(

        "vrm.sync",

        status

    );

    logger.debug({

        event:

            "vrm.sync"

    });

}

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default {

    initializeSocket,

    getIO,

    emitTelemetry,

    emitAlarm,

    emitStatistic,

    emitSite,

    emitSyncStatus

};