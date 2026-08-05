import Alarm from "../../models/Alarm.js";

import vrmAlarmService from "../vrm/alarmService.js";

import  { normalizeAlarm }  from "../vrm/normalize.js";

/*
|--------------------------------------------------------------------------
| Installation Alarms
|--------------------------------------------------------------------------
*/

export async function getInstallationAlarms(siteId) {

    return await Alarm.find({

        site: siteId

    })

    .sort({

        startedAt: -1

    });

}

/*
|--------------------------------------------------------------------------
| Site Alarms
|--------------------------------------------------------------------------
*/

export async function getSiteAlarms(siteId) {

    return await getInstallationAlarms(

        siteId

    );

}

/*
|--------------------------------------------------------------------------
| Critical Alarms
|--------------------------------------------------------------------------
*/

export async function getCriticalAlarms(siteId) {

    const query = {

        severity: "CRITICAL",

        status: "ACTIVE"

    };

    if (siteId) {

        query.site = siteId;

    }

    return await Alarm.find(query)

        .sort({

            startedAt: -1

        });

}

/*
|--------------------------------------------------------------------------
| Active Alarms
|--------------------------------------------------------------------------
*/

export async function getActiveAlarms(siteId) {

    const query = {

        status: "ACTIVE"

    };

    if (siteId) {

        query.site = siteId;

    }

    return await Alarm.find(query)

        .sort({

            severity: -1,

            startedAt: -1

        });

}

/*
|--------------------------------------------------------------------------
| Alarm History
|--------------------------------------------------------------------------
*/

export async function getAlarmHistory(

    siteId,

    limit = 100

) {

    return await Alarm.find({

        site: siteId

    })

    .sort({

        startedAt: -1

    })

    .limit(limit);

}

/*
|--------------------------------------------------------------------------
| Acknowledge Alarm
|--------------------------------------------------------------------------
*/

export async function acknowledgeAlarm(id) {

    return await Alarm.findByIdAndUpdate(

        id,

        {

            status: "ACKNOWLEDGED"

        },

        {

            new: true,

            runValidators: true

        }

    );

}

/*
|--------------------------------------------------------------------------
| Clear Alarm
|--------------------------------------------------------------------------
*/

export async function clearAlarm(id) {

    return await Alarm.findByIdAndUpdate(

        id,

        {

            status: "RESOLVED",

            resolvedAt: new Date()

        },

        {

            new: true,

            runValidators: true

        }

    );

}

/*
|--------------------------------------------------------------------------
| Alarm Statistics
|--------------------------------------------------------------------------
*/

export async function alarmStatistics(siteId) {

    const query = {};

    if (siteId) {

        query.site = siteId;

    }

    const [

        total,

        active,

        acknowledged,

        resolved,

        critical,

        warning,

        info

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

        }),

        Alarm.countDocuments({

            ...query,

            severity: "CRITICAL"

        }),

        Alarm.countDocuments({

            ...query,

            severity: "WARNING"

        }),

        Alarm.countDocuments({

            ...query,

            severity: "INFO"

        })

    ]);

    return {

        total,

        active,

        acknowledged,

        resolved,

        severity: {

            critical,

            warning,

            info

        }

    };

}

/*
|--------------------------------------------------------------------------
| Synchronize Alarms From VRM
|--------------------------------------------------------------------------
*/

export async function synchronizeAlarms(
    installationId
) {

    const installation = await Installation.findOne({
        installationId
    });

    if (!installation) {
        throw new Error("Installation not found.");
    }

    const alarms =
        await vrmAlarmService.getActiveAlarms(
            installationId
        );

    const synchronized = [];

    for (const alarm of alarms) {

        const normalized =
            normalizeAlarm(
                installation,
                alarm
            );

        const document =
            await Alarm.findOneAndUpdate(
                {
                    vrmAlarmId:
                        normalized.vrmAlarmId
                },
                normalized,
                {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                }
            );

        synchronized.push(document);

    }

    return synchronized;

}

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    getInstallationAlarms,

    getSiteAlarms,

    getCriticalAlarms,

    getActiveAlarms,

    getAlarmHistory,

    acknowledgeAlarm,

    clearAlarm,

    alarmStatistics,

    synchronizeAlarms

};