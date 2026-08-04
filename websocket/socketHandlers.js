import logger from "../utils/logger.js";

import {

    emitToUser,

    emitToSite,

    broadcast

} from "./socket.js";

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export function handleDashboardUpdate(

    siteId,

    payload

) {

    logger.info(

        `Dashboard update -> Site ${siteId}`

    );

    emitToSite(

        siteId,

        "dashboard:update",

        payload

    );

}

/*
|--------------------------------------------------------------------------
| Telemetry
|--------------------------------------------------------------------------
*/

export function handleTelemetryUpdate(

    siteId,

    payload

) {

    emitToSite(

        siteId,

        "telemetry:update",

        payload

    );

}

/*
|--------------------------------------------------------------------------
| Alarm
|--------------------------------------------------------------------------
*/

export function handleAlarmRaised(

    siteId,

    alarm

) {

    emitToSite(

        siteId,

        "alarm:raised",

        alarm

    );

}

export function handleAlarmCleared(

    siteId,

    alarm

) {

    emitToSite(

        siteId,

        "alarm:cleared",

        alarm

    );

}

/*
|--------------------------------------------------------------------------
| Fault
|--------------------------------------------------------------------------
*/

export function handleFaultCreated(

    siteId,

    fault

) {

    emitToSite(

        siteId,

        "fault:created",

        fault

    );

}

export function handleFaultUpdated(

    siteId,

    fault

) {

    emitToSite(

        siteId,

        "fault:updated",

        fault

    );

}

/*
|--------------------------------------------------------------------------
| Maintenance
|--------------------------------------------------------------------------
*/

export function handleMaintenanceCreated(

    userId,

    maintenance

) {

    emitToUser(

        userId,

        "maintenance:created",

        maintenance

    );

}

export function handleMaintenanceUpdated(

    userId,

    maintenance

) {

    emitToUser(

        userId,

        "maintenance:updated",

        maintenance

    );

}

/*
|--------------------------------------------------------------------------
| Notifications
|--------------------------------------------------------------------------
*/

export function handleNotification(

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

export function handleOptimizationCompleted(

    userId,

    result

) {

    emitToUser(

        userId,

        "optimization:completed",

        result

    );

}

/*
|--------------------------------------------------------------------------
| Report
|--------------------------------------------------------------------------
*/

export function handleReportGenerated(

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
| System
|--------------------------------------------------------------------------
*/

export function handleSystemBroadcast(

    payload

) {

    broadcast(

        "system:broadcast",

        payload

    );

}

export default {

    handleDashboardUpdate,

    handleTelemetryUpdate,

    handleAlarmRaised,

    handleAlarmCleared,

    handleFaultCreated,

    handleFaultUpdated,

    handleMaintenanceCreated,

    handleMaintenanceUpdated,

    handleNotification,

    handleOptimizationCompleted,

    handleReportGenerated,

    handleSystemBroadcast

};