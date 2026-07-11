import { getIO } from "./socket.js";

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export function emitDashboardUpdate(data) {

    getIO()

        .to("dashboard")

        .emit(

            "dashboard:update",

            data

        );

}

/*
|--------------------------------------------------------------------------
| Site Telemetry
|--------------------------------------------------------------------------
*/

export function emitSiteTelemetry(siteId, telemetry) {

    getIO()

        .to(

            `site:${siteId}`

        )

        .emit(

            "telemetry:update",

            telemetry

        );

}

/*
|--------------------------------------------------------------------------
| Alarm
|--------------------------------------------------------------------------
*/

export function emitAlarm(siteId, alarm) {

    getIO()

        .to(

            `site:${siteId}`

        )

        .emit(

            "alarm:new",

            alarm

        );

}

/*
|--------------------------------------------------------------------------
| Notification
|--------------------------------------------------------------------------
*/

export function emitNotification(userId, notification) {

    getIO()

        .to(

            `user:${userId}`

        )

        .emit(

            "notification:new",

            notification

        );

}

export default {

    emitDashboardUpdate,

    emitSiteTelemetry,

    emitAlarm,

    emitNotification

};