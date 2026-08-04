import logger from "../utils/logger.js";

import {

    joinSiteRoom,

    leaveSiteRoom,

    joinDashboard,

    leaveDashboard,

    joinUserRoom

} from "./roomManager.js";

export default function registerSocketEvents(io) {

    io.on("connection", socket => {

        logger.info(`Socket Connected: ${socket.id}`);

        /*
        |--------------------------------------------------------------------------
        | Dashboard Events
        |--------------------------------------------------------------------------
        */

        socket.on("dashboard:join", () => {

            joinDashboard(socket);

        });

        socket.on("dashboard:leave", () => {

            leaveDashboard(socket);

        });

        /*
        |--------------------------------------------------------------------------
        | User Room
        |--------------------------------------------------------------------------
        */

        socket.on("user:join", userId => {

            if (!userId) {

                logger.warn(`Invalid userId from ${socket.id}`);

                return;

            }

            joinUserRoom(socket, userId);

        });

        /*
        |--------------------------------------------------------------------------
        | Site Room
        |--------------------------------------------------------------------------
        */

        socket.on("site:join", siteId => {

            if (!siteId) {

                logger.warn(`Invalid siteId from ${socket.id}`);

                return;

            }

            joinSiteRoom(socket, siteId);

        });

        socket.on("site:leave", siteId => {

            if (!siteId) {

                return;

            }

            leaveSiteRoom(socket, siteId);

        });

        /*
        |--------------------------------------------------------------------------
        | Heartbeat
        |--------------------------------------------------------------------------
        */

        socket.on("heartbeat", () => {

            socket.emit("heartbeat:ack", {

                timestamp: Date.now()

            });

        });

        /*
        |--------------------------------------------------------------------------
        | Errors
        |--------------------------------------------------------------------------
        */

        socket.on("error", error => {

            logger.error(

                `Socket Error (${socket.id})`,

                error

            );

        });

        /*
        |--------------------------------------------------------------------------
        | Disconnect
        |--------------------------------------------------------------------------
        */

        socket.on("disconnect", reason => {

            logger.info(

                `Socket Disconnected: ${socket.id} (${reason})`

            );

        });

    });

}