import Telemetry from "../../models/Telemetry.js";
import Installation from "../../models/Installation.js";

import * as vrmTelemetryService from "../vrm/telemetryService.js";

import { normalizeTelemetry } from "../vrm/normalize.js";

import logger from "../../utils/logger.js";

import {

    emitTelemetry,

    emitDashboardUpdate,

    emitStatistics,

    emitAnalytics

} from "../../websocket/eventEmitters.js";

/*
|--------------------------------------------------------------------------
| Current Telemetry
|--------------------------------------------------------------------------
*/

export async function getTelemetry(

    query = {}

) {

    const filter = {};

    if (

        query.site

    ) {

        filter.site = query.site;

    }

    if (

        query.start ||

        query.end

    ) {

        filter.timestamp = {};

        if (

            query.start

        ) {

            filter.timestamp.$gte =

                new Date(query.start);

        }

        if (

            query.end

        ) {

            filter.timestamp.$lte =

                new Date(query.end);

        }

    }

    return Telemetry.find(filter)

        .sort({

            timestamp: -1

        })

        .lean();

}

/*
|--------------------------------------------------------------------------
| Telemetry History
|--------------------------------------------------------------------------
*/

export async function getTelemetryHistory(

    query = {}

) {

    return getTelemetry(query);

}

/*
|--------------------------------------------------------------------------
| Latest Telemetry
|--------------------------------------------------------------------------
*/

export async function getLatestTelemetry(

    installationId

) {

    const installation =

        await Installation.findOne({

            installationId

        });

    if (

        !installation

    ) {

        throw new Error(

            "Installation not found."

        );

    }

    return Telemetry.findOne({

        site:

            installation.site

    })

        .sort({

            timestamp: -1

        })

        .lean();

}

/*
|--------------------------------------------------------------------------
| Synchronize
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Synchronize Telemetry
|--------------------------------------------------------------------------
*/

export async function synchronizeTelemetry(

    installationId

) {

    const installation = await Installation.findOne({

        installationId

    });

    if (!installation) {

        throw new Error(

            "Installation not found."

        );

    }

    /*
 |--------------------------------------------------------------------------
 | Retrieve Live Dashboard
 |--------------------------------------------------------------------------
 */

    const dashboard =
        await vrmTelemetryService.getLiveTelemetry(
            installationId
        );

    /*
    |--------------------------------------------------------------------------
    | Retrieve Statistics
    |--------------------------------------------------------------------------
    */

    const statistics =
        await vrmTelemetryService.getHistoricalTelemetry(
            installationId
        );

    /*
    |--------------------------------------------------------------------------
    | Normalize
    |--------------------------------------------------------------------------
    */

    const normalized =
        normalizeTelemetry(
            installation,
            dashboard,
            [],
            statistics
        );
    /*
    |--------------------------------------------------------------------------
    | Save
    |--------------------------------------------------------------------------
    */

    const saved =
        await Telemetry.findOneAndUpdate(
            {
                installation: installation._id
            },
            normalized,
            {
                upsert: true,
                returnDocument: "after"
            }
        );

    /*
    |--------------------------------------------------------------------------
    | Realtime Events
    |--------------------------------------------------------------------------
    */
    /*
    |--------------------------------------------------------------------------
    | Realtime Events
    |--------------------------------------------------------------------------
    */

    emitTelemetry(

        installation.site.toString(),

        saved

    );

    emitDashboardUpdate({

        siteId: installation.site.toString(),

        timestamp: saved.timestamp,

        batterySOC: saved.batterySOC,

        solarPower: saved.solarPower,

        loadPower: saved.loadPower,

        gridPower: saved.gridPower,

        generatorPower: saved.generatorPower

    });

    emitStatistics(

        installation.site.toString(),

        {

            timestamp: saved.timestamp,

            batterySOC: saved.batterySOC,

            solarPower: saved.solarPower,

            loadPower: saved.loadPower

        }

    );

    emitAnalytics(

        installation.site.toString(),

        {

            batterySOC: saved.batterySOC,

            solarPower: saved.solarPower,

            loadPower: saved.loadPower,

            gridPower: saved.gridPower,

            generatorPower: saved.generatorPower

        }

    );

    /*
    |--------------------------------------------------------------------------
    | Logging
    |--------------------------------------------------------------------------
    */

    logger.success({

        installationId,

        siteId: installation.site,

        batterySOC: saved.batterySOC,

        batteryVoltage: saved.batteryVoltage,

        solarPower: saved.solarPower,

        loadPower: saved.loadPower,

        message: "Telemetry synchronized successfully."

    });

    return saved;

}

/*
|--------------------------------------------------------------------------
| Device Status
|--------------------------------------------------------------------------
*/

export async function getDeviceStatus(

    installationId

) {

    const latest =

        await getLatestTelemetry(

            installationId

        );

    if (

        !latest

    ) {

        return {

            online: false,

            batterySOC: 0,

            solarPower: 0,

            loadPower: 0,

            gridPower: 0,

            generatorPower: 0,

            lastSeen: null

        };

    }

    return {

        online:

            true,

        batterySOC:

            latest.batterySOC,

        solarPower:

            latest.solarPower,

        loadPower:

            latest.loadPower,

        gridPower:

            latest.gridPower,

        generatorPower:

            latest.generatorPower,

        lastSeen:

            latest.timestamp

    };

}

/*
|--------------------------------------------------------------------------
| Summary
|--------------------------------------------------------------------------
*/

export async function getTelemetrySummary(

    query = {}

) {

    const records =

        await getTelemetry(query);

    if (

        !records.length

    ) {

        return {

            totalRecords: 0,

            averageSOC: 0,

            averageSolarPower: 0,

            averageLoadPower: 0

        };

    }

    const totalSOC =

        records.reduce(

            (

                sum,

                row

            ) =>

                sum +

                (row.batterySOC || 0),

            0

        );

    const totalSolar =

        records.reduce(

            (

                sum,

                row

            ) =>

                sum +

                (row.solarPower || 0),

            0

        );

    const totalLoad =

        records.reduce(

            (

                sum,

                row

            ) =>

                sum +

                (row.loadPower || 0),

            0

        );

    return {

        totalRecords:

            records.length,

        averageSOC:

            totalSOC /

            records.length,

        averageSolarPower:

            totalSolar /

            records.length,

        averageLoadPower:

            totalLoad /

            records.length

    };

}

/*
|--------------------------------------------------------------------------
| Refresh Dashboard
|--------------------------------------------------------------------------
*/

export async function refreshDashboard(siteId) {

    const latest = await Telemetry

        .findOne({

            site: siteId

        })

        .sort({

            timestamp: -1

        })

        .lean();

    if (!latest) {

        return;

    }

    emitDashboardUpdate({

        siteId,

        timestamp: latest.timestamp,

        batterySOC: latest.batterySOC,

        solarPower: latest.solarPower,

        loadPower: latest.loadPower,

        gridPower: latest.gridPower,

        generatorPower: latest.generatorPower

    });

}

export default {

    getTelemetry,

    getTelemetryHistory,

    getLatestTelemetry,

    synchronizeTelemetry,

    getDeviceStatus,

    getTelemetrySummary,

    refreshDashboard

};