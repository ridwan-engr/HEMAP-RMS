import {

    emitToUser,

    emitToSite,

    broadcast,

    getSocketIO,


} from "./socket.js";

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export function emitDashboardUpdate(payload) {

    getSocketIO()

        .to("dashboard")

        .emit(

            "dashboard:update",

            payload

        );

}
/*
|--------------------------------------------------------------------------
| Telemetry
|--------------------------------------------------------------------------
*/

export function emitTelemetry(

    siteId,

    telemetry

) {

    emitToSite(

        siteId,

        "telemetry:update",

        telemetry

    );

}

/*
|--------------------------------------------------------------------------
| Analytics
|--------------------------------------------------------------------------
*/

export function emitAnalytics(

    siteId,

    analytics

) {

    emitToSite(

        siteId,

        "analytics:update",

        analytics

    );

}

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export function emitStatistics(

    siteId,

    statistics

) {

    emitToSite(

        siteId,

        "statistics:update",

        statistics

    );

}

/*
|--------------------------------------------------------------------------
| Alarm
|--------------------------------------------------------------------------
*/

export function emitAlarm(

    siteId,

    alarm

) {

    emitToSite(

        siteId,

        "alarm:update",

        alarm

    );

}

/*
|--------------------------------------------------------------------------
| Fault
|--------------------------------------------------------------------------
*/

export function emitFault(

    siteId,

    fault

) {

    emitToSite(

        siteId,

        "fault:update",

        fault

    );

}

/*
|--------------------------------------------------------------------------
| Maintenance
|--------------------------------------------------------------------------
*/

export function emitMaintenance(

    userId,

    maintenance

) {

    emitToUser(

        userId,

        "maintenance:update",

        maintenance

    );

}

/*
|--------------------------------------------------------------------------
| Notification
|--------------------------------------------------------------------------
*/

export function emitNotification(

    userId,

    notification

) {

    emitToUser(

        userId,

        "notification:new",

        notification

    );

}

/*
|--------------------------------------------------------------------------
| Optimization
|--------------------------------------------------------------------------
*/

export function emitOptimization(

    userId,

    optimization

) {

    emitToUser(

        userId,

        "optimization:update",

        optimization

    );

}

/*
|--------------------------------------------------------------------------
| Report
|--------------------------------------------------------------------------
*/

export function emitReport(

    userId,

    report

) {

    emitToUser(

        userId,

        "report:generated",

        report

    );

}

/*
|--------------------------------------------------------------------------
| User
|--------------------------------------------------------------------------
*/

export function emitUserUpdate(

    userId,

    payload

) {

    emitToUser(

        userId,

        "user:update",

        payload

    );

}

/*
|--------------------------------------------------------------------------
| Site
|--------------------------------------------------------------------------
*/

export function emitSiteUpdate(

    siteId,

    payload

) {

    emitToSite(

        siteId,

        "site:update",

        payload

    );

}

/*
|--------------------------------------------------------------------------
| System Broadcast
|--------------------------------------------------------------------------
*/

export function emitSystemMessage(

    payload

) {

    broadcast(

        "system:message",

        payload

    );

}

export function emitForecast(siteId, forecast) {

    emitToSite(

        siteId,

        "forecast:update",

        forecast

    );

}

export function emitWeather(siteId, weather) {

    emitToSite(

        siteId,

        "weather:update",

        weather

    );

}

export function emitForecastCompleted(siteId, forecast) {

    emitToSite(

        siteId,

        "forecast:completed",

        forecast

    );

}

export function emitStatisticsUpdate(data) {

    broadcast(
        "statistics:update",
        data
    );

}

export default {

    emitDashboardUpdate,

    emitTelemetry,

    emitAnalytics,

    emitStatistics,

    emitAlarm,

    emitFault,

    emitMaintenance,

    emitNotification,

    emitOptimization,

    emitStatisticsUpdate,

    emitReport,

    emitUserUpdate,

    emitSiteUpdate,

    emitSystemMessage

};