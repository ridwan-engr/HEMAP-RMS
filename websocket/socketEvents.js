import logger from "../utils/logger.js";

import {

    joinSiteRoom,

    leaveSiteRoom,

    joinDashboard,

    leaveDashboard

} from "./roomManager.js";

export default function registerSocketEvents(io) {

    io.on("connection", socket => {

        logger.info(

            `Socket Connected: ${socket.id}`

        );

        /*
        |--------------------------------------------------------------------------
        | Dashboard
        |--------------------------------------------------------------------------
        */

        socket.on(

            "dashboard:join",

            () => {

                joinDashboard(socket);

            }

        );

        socket.on(

            "dashboard:leave",

            () => {

                leaveDashboard(socket);

            }

        );

        /*
        |--------------------------------------------------------------------------
        | Site Rooms
        |--------------------------------------------------------------------------
        */

        socket.on(

            "site:join",

            siteId => {

                if (!siteId) {

                    logger.warn(
                        `Invalid siteId from ${socket.id}`
                    );

                    return;
                }

                joinSiteRoom(

                    socket,

                    siteId

                );

            }

        );

        socket.on(

            "site:leave",

            siteId => {

                leaveSiteRoom(

                    socket,

                    siteId

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

            () => {

                logger.info(

                    `Socket Disconnected: ${socket.id}`

                );

            }

        );

    socket.on("error", error => {

        logger.error(
            `Socket Error: ${socket.id}`,
            error
        );

    });

    socket.on("heartbeat", () => {

        socket.emit("heartbeat:ack", {

            timestamp: Date.now()

        });

    });

    socket.on(

    "user:join",

    userId => {

        joinUserRoom(

            socket,

            userId

        );

    });

    });
    
}