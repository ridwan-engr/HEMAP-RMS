import Alarm from "../../models/Alarm.js";
import Site from "../../models/Site.js";
import Installation from "../../models/Installation.js";
import {
    emitAlarm
} from "../../websocket/eventEmitters.js";
/*
|--------------------------------------------------------------------------
| Active Alarms
|--------------------------------------------------------------------------
*/

export async function getActiveAlarms(filters = {}) {

    const query = {

        status: "ACTIVE"

    };

    if (filters.siteId) {

        query.site = filters.siteId;

    }

    if (filters.installationId) {

        query.installation = filters.installationId;

    }

    return Alarm.find(query)

        .populate("site")

        .populate("installation")

        .populate("acknowledgedBy", "firstName lastName")

        .populate("resolvedBy", "firstName lastName")

        .sort({

            createdAt: -1

        });

}

/*
|--------------------------------------------------------------------------
| Alarm History
|--------------------------------------------------------------------------
*/

export async function getAlarmHistory(filters = {}) {

    const query = {};

    if (filters.siteId) {

        query.site = filters.siteId;

    }

    if (filters.installationId) {

        query.installation = filters.installationId;

    }

    if (filters.status) {

        query.status = filters.status;

    }

    if (filters.startDate || filters.endDate) {

        query.createdAt = {};

        if (filters.startDate) {

            query.createdAt.$gte = new Date(filters.startDate);

        }

        if (filters.endDate) {

            query.createdAt.$lte = new Date(filters.endDate);

        }

    }

    return Alarm.find(query)

        .populate("site")

        .populate("installation")

        .populate("acknowledgedBy", "firstName lastName")

        .populate("resolvedBy", "firstName lastName")

        .sort({

            createdAt: -1

        });

}

/*
|--------------------------------------------------------------------------
| Alarm Details
|--------------------------------------------------------------------------
*/

export async function getAlarmById(alarmId) {

    const alarm = await Alarm.findById(alarmId)

        .populate("site")

        .populate("installation")

        .populate("acknowledgedBy", "firstName lastName")

        .populate("resolvedBy", "firstName lastName");

    if (!alarm) {

        throw new Error(

            "Alarm not found."

        );

    }

    return alarm;

}

/*
|--------------------------------------------------------------------------
| Alarm Statistics
|--------------------------------------------------------------------------
*/

export async function getAlarmStatistics(filters = {}) {

    const query = {};

    if (filters.siteId) {

        query.site = filters.siteId;

    }

    if (filters.installationId) {

        query.installation = filters.installationId;

    }

    const [

        total,

        active,

        acknowledged,

        resolved

    ] = await Promise.all([

        Alarm.countDocuments(query),

        Alarm.countDocuments({

            ...query,

            status: "ACTIVE"

        }),

        Alarm.countDocuments({

            ...query,

            status: "ACKNOWLEDGED"

        }),

        Alarm.countDocuments({

            ...query,

            status: "RESOLVED"

        })

    ]);

    return {

        total,

        active,

        acknowledged,

        resolved

    };

}

/*
|--------------------------------------------------------------------------
| Alarm Summary
|--------------------------------------------------------------------------
*/

export async function getAlarmSummary(filters = {}) {

    const [

        statistics,

        latest

    ] = await Promise.all([

        getAlarmStatistics(filters),

        Alarm.findOne(filters.siteId ? {

            site: filters.siteId

        } : {})

            .sort({

                createdAt: -1

            })

    ]);

    return {

        ...statistics,

        latestAlarm: latest

    };

}

/*
|--------------------------------------------------------------------------
| Acknowledge Alarm
|--------------------------------------------------------------------------
*/

export async function acknowledgeAlarm(alarmId, user) {

    const alarm = await getAlarmById(alarmId);

    alarm.status = "ACKNOWLEDGED";

    alarm.acknowledgedAt = new Date();

    alarm.acknowledgedBy = user._id;

    await alarm.save();

    emitAlarm(
        alarm.site.toString(),
        alarm
    );

    return alarm;

}

/*
|--------------------------------------------------------------------------
| Resolve Alarm
|--------------------------------------------------------------------------
*/

export async function resolveAlarm(alarmId, user, payload = {}) {

    const alarm = await getAlarmById(alarmId);

    alarm.status = "RESOLVED";

    alarm.resolvedAt = new Date();

    alarm.resolvedBy = user._id;

    alarm.resolutionComment = payload.resolutionComment || "";

    await alarm.save();

    emitAlarm(
        alarm.site.toString(),
        alarm
    );

    return alarm;

}

/*
|--------------------------------------------------------------------------
| Delete Alarm
|--------------------------------------------------------------------------
*/

export async function deleteAlarm(alarmId) {

    const alarm = await getAlarmById(alarmId);

    await alarm.deleteOne();

    return true;

}

export default {

    getActiveAlarms,

    getAlarmHistory,

    getAlarmById,

    getAlarmStatistics,

    getAlarmSummary,

    acknowledgeAlarm,

    resolveAlarm,

    deleteAlarm

};