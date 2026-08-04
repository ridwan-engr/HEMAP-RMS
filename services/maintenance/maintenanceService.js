import Telemetry from "../../models/Telemetry.js";
import Alarm from "../../models/Alarm.js";
import AuditLog from "../../models/AuditLog.js";
import EnergyForecast from "../../models/EnergyForecast.js";
import Maintenance from "../../models/Maintenance.js";
import logger from "../../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Cleanup Telemetry
|--------------------------------------------------------------------------
*/

export async function cleanupTelemetry(days = 90) {

    const cutoff = new Date();

    cutoff.setDate(cutoff.getDate() - days);

    const result = await Telemetry.deleteMany({

        timestamp: {

            $lt: cutoff

        }

    });

    return result.deletedCount;

}

/*
|--------------------------------------------------------------------------
| Cleanup Resolved Alarms
|--------------------------------------------------------------------------
*/

export async function cleanupResolvedAlarms(days = 180) {

    const cutoff = new Date();

    cutoff.setDate(cutoff.getDate() - days);

    const result = await Alarm.deleteMany({

        status: "RESOLVED",

        resolvedAt: {

            $lt: cutoff

        }

    });

    return result.deletedCount;

}

/*
|--------------------------------------------------------------------------
| Cleanup Forecasts
|--------------------------------------------------------------------------
*/

export async function cleanupForecasts(days = 30) {

    const cutoff = new Date();

    cutoff.setDate(cutoff.getDate() - days);

    const result = await EnergyForecast.deleteMany({

        forecastDate: {

            $lt: cutoff

        }

    });

    return result.deletedCount;

}

/*
|--------------------------------------------------------------------------
| Cleanup Audit Logs
|--------------------------------------------------------------------------
*/

export async function cleanupAuditLogs(days = 365) {

    const cutoff = new Date();

    cutoff.setDate(cutoff.getDate() - days);

    const result = await AuditLog.deleteMany({

        createdAt: {

            $lt: cutoff

        }

    });

    return result.deletedCount;

}

/*
|--------------------------------------------------------------------------
| Cleanup Notifications
|--------------------------------------------------------------------------
*/

export async function cleanupNotifications() {

    return 0;

}

/*
|--------------------------------------------------------------------------
| Cleanup Optimization Results
|--------------------------------------------------------------------------
*/

export async function cleanupOptimizationResults() {

    return 0;

}

/*
|--------------------------------------------------------------------------
| Execute All Cleanup Tasks
|--------------------------------------------------------------------------
*/

export async function cleanupAll() {

    const summary = {

        telemetry:

            await cleanupTelemetry(),

        alarms:

            await cleanupResolvedAlarms(),

        maintenance:

            await cleanupMaintenance(),

        cancelledMaintenance:

            await cleanupCancelledMaintenance(),

        forecasts:

            await cleanupForecasts(),

        auditLogs:

            await cleanupAuditLogs(),

        notifications:

            await cleanupNotifications(),

        optimization:

            await cleanupOptimizationResults()

    };

    logger.info(

        "Cleanup completed.",

        summary

    );

    return summary;

}

export async function cleanupMaintenance(days = 730) {

    const cutoff = new Date();

    cutoff.setDate(cutoff.getDate() - days);

    const result = await Maintenance.deleteMany({

        status: "COMPLETED",

        completedDate: {

            $exists: true,

            $lt: cutoff

        }

    });

    return result.deletedCount;

}

/*
|--------------------------------------------------------------------------
| Cleanup Cancelled Maintenance
|--------------------------------------------------------------------------
*/

export async function cleanupCancelledMaintenance(days = 365) {

    const cutoff = new Date();

    cutoff.setDate(cutoff.getDate() - days);

    const result = await Maintenance.deleteMany({

        status: "CANCELLED",

        updatedAt: {

            $lt: cutoff

        }

    });

    return result.deletedCount;

}

export default {

    cleanupTelemetry,

    cleanupResolvedAlarms,

    cleanupMaintenance,

    cleanupCancelledMaintenance,

    cleanupForecasts,

    cleanupAuditLogs,

    cleanupNotifications,

    cleanupOptimizationResults,

    cleanupAll

};