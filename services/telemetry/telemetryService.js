import Telemetry from "../../models/Telemetry.js";
import Site from "../../models/Site.js";
import Installation from "../../models/Installation.js";
import logger from "../../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Utility Functions
|--------------------------------------------------------------------------
*/
export function buildTelemetryQuery(siteId, filters = {}) {

    const query = {};

    if (siteId) {
        query.site = siteId;
    }

    if (filters.start || filters.end) {

        query.timestamp = {};

        if (filters.start) {
            query.timestamp.$gte = new Date(filters.start);
        }

        if (filters.end) {
            query.timestamp.$lte = new Date(filters.end);
        }

    }

    return query;

}


export async function latestRecord(siteId) {

    return Telemetry.findOne({
        site: siteId
    })

        .populate("site")

        .sort({
            timestamp: -1
        });

}

/*
|--------------------------------------------------------------------------
| CRUD
|--------------------------------------------------------------------------
*/

/**
 * Create telemetry manually
 */
export async function createTelemetry(payload) {

    const site = await Site.findById(payload.site);

    if (!site) {
        throw new Error("Site not found.");
    }

    return Telemetry.create({

        ...payload,

        timestamp:
            payload.timestamp ||
            new Date()

    });

}

/**
 * Update telemetry
 */
export async function updateLatestTelemetry(id, payload) {

    const telemetry = await Telemetry.findByIdAndUpdate(

        id,

        payload,

        {

            new: true,

            runValidators: true

        }

    ).populate("site");

    if (!telemetry) {
        throw new Error("Telemetry record not found.");
    }

    return telemetry;

}

/**
 * Get telemetry by id
 */
export async function getTelemetryById(id) {

    const telemetry = await Telemetry.findById(id)

        .populate("site");

    if (!telemetry) {
        throw new Error("Telemetry record not found.");
    }

    return telemetry;

}

/**
 * Delete telemetry
 */
export async function deleteTelemetry(id) {

    const telemetry = await Telemetry.findByIdAndDelete(id);

    if (!telemetry) {
        throw new Error("Telemetry record not found.");
    }

    return telemetry;

}

/*
|--------------------------------------------------------------------------
| Live Monitoring
|--------------------------------------------------------------------------
*/

/**
 * GET /telemetry/live
 */
export async function getLiveTelemetry(filters = {}) {

    const telemetry = await latestRecord(filters.siteId);

    return {

        timestamp:

            telemetry?.timestamp ||

            new Date(),

        site:

            telemetry?.site ||

            null,

        telemetry

    };

}

/**
 * GET /telemetry/history
 */
export async function getHistoricalTelemetry(filters = {}) {

    const query = buildTelemetryQuery(

        filters.siteId,

        filters

    );

    return Telemetry.find(query)

        .sort({

            timestamp: -1

        })

        .limit(

            filters.limit || 1000

        );

}

/**
 * GET /telemetry/latest
 */
export async function getLatestSnapshot(siteId) {

    return latestRecord(siteId);

}

/**
 * GET /telemetry/status/device
 */
export async function getDeviceStatus(siteId) {

    const latest = await latestRecord(siteId);

    if (!latest) {

        return {

            online: false,

            status: "OFFLINE"

        };

    }

    return {

        online: true,

        status: "ONLINE",

        lastUpdate:

            latest.timestamp

    };

}

/**
 * GET /telemetry/status/communication
 */
export async function getCommunicationStatus(siteId) {

    const installation = await Installation.findOne({

        site: siteId

    });

    if (!installation) {

        return {

            connected: false,

            status: "UNKNOWN"

        };

    }

    return {

        connected:

            installation.status === "ONLINE",

        status:

            installation.status,

        lastSync:

            installation.lastSync

    };

}

/**
 * POST /telemetry/synchronize
 *
 * Placeholder.
 * Actual implementation will call:
 *
 * services/vrm/syncService.js
 *
 */
export async function synchronize(siteId) {

    logger.info(

        `Manual synchronization requested for site ${siteId}`

    );

    return {

        success: true,

        message: "Synchronization queued."

    };

}

/*
|--------------------------------------------------------------------------
| Component Telemetry
|--------------------------------------------------------------------------
*/

/**
 * ============================================================================
 * Component Telemetry
 * Returns all monitored equipment for one installation.
 * ============================================================================
 */
export async function componentTelemetry(installationId) {

    const latest = await Telemetry.findOne({

        installation: installationId

    })

        .sort({
            timestamp: -1
        })

        .lean();

    if (!latest) {

        return {
            installationId,
            battery: null,
            solar: null,
            generator: null,
            grid: null,
            inverter: null,
            rectifier: null,
            smartMeter: null,
            load: null,
            weather: null
        };

    }

    return {

        installationId,

        battery:
            latest.battery || null,

        solar:
            latest.solar || null,

        generator:
            latest.generator || null,

        grid:
            latest.grid || null,

        inverter:
            latest.inverter || null,

        rectifier:
            latest.rectifier || null,

        smartMeter:
            latest.smartMeter || null,

        load:
            latest.load || null,

        weather:
            latest.weather || null

    };

}

/**
 * ============================================================================
 * Battery
 * ============================================================================
 */

export async function getBatteryTelemetry(installationId) {

    const latest = await componentTelemetry(
        installationId
    );

    return latest.battery;

}

/**
 * ============================================================================
 * Solar
 * ============================================================================
 */

export async function getSolarTelemetry(installationId) {

    const latest = await componentTelemetry(
        installationId
    );

    return latest.solar;

}

/**
 * ============================================================================
 * Generator
 * ============================================================================
 */

export async function getGeneratorTelemetry(installationId) {

    const latest = await componentTelemetry(
        installationId
    );

    return latest.generator;

}

/**
 * ============================================================================
 * Grid
 * ============================================================================
 */

export async function getGridTelemetry(installationId) {

    const latest = await componentTelemetry(
        installationId
    );

    return latest.grid;

}

/**
 * ============================================================================
 * Inverter
 * ============================================================================
 */

export async function getInverterTelemetry(installationId) {

    const latest = await componentTelemetry(
        installationId
    );

    return latest.inverter;

}

/**
 * ============================================================================
 * Rectifier
 * ============================================================================
 */

export async function getRectifierTelemetry(installationId) {

    const latest = await componentTelemetry(
        installationId
    );

    return latest.rectifier;

}

/**
 * ============================================================================
 * Smart Meter
 * ============================================================================
 */

export async function getSmartMeterTelemetry(installationId) {

    const latest = await componentTelemetry(
        installationId
    );

    return latest.smartMeter;

}

/**
 * ============================================================================
 * Load
 * ============================================================================
 */

export async function getLoadTelemetry(installationId) {

    const latest = await componentTelemetry(
        installationId
    );

    return latest.load;

}

/**
 * ============================================================================
 * Weather
 * ============================================================================
 * Reserved for future integration.
 * Can be populated from:
 * - OpenWeather API
 * - Meteostat
 * - Site weather station
 * ============================================================================
 */

export async function getWeatherTelemetry(installationId) {

    const latest = await componentTelemetry(
        installationId
    );

    return latest.weather;

}

/*
|--------------------------------------------------------------------------
| Analytics & Dashboard
|--------------------------------------------------------------------------
*/

/**
 * ============================================================================
 * Telemetry Statistics
 * ============================================================================
 */

export async function telemetryStatistics(filters = {}) {

    const query = buildTelemetryQuery(
        filters.siteId,
        filters
    );

    const records = await Telemetry.find(query).lean();

    if (!records.length) {

        return {

            totalRecords: 0,

            latestTimestamp: null,

            oldestTimestamp: null

        };

    }

    return {

        totalRecords: records.length,

        latestTimestamp: records[0].timestamp,

        oldestTimestamp:
            records[records.length - 1].timestamp

    };

}

/**
 * ============================================================================
 * Telemetry Trends
 * ============================================================================
 */

export async function telemetryTrends(filters = {}) {

    const query = buildTelemetryQuery(
        filters.siteId,
        filters
    );

    return Telemetry.find(query)

        .sort({
            timestamp: 1
        })

        .limit(
            filters.limit || 200
        )

        .lean();

}

/**
 * ============================================================================
 * Live KPIs
 * ============================================================================
 */

export async function liveKPIs(siteId) {

    const latest = await latestRecord(siteId);

    if (!latest) {

        return {

            batterySOC: 0,

            solarPower: 0,

            loadPower: 0,

            generatorPower: 0,

            gridPower: 0,

            renewableContribution: 0

        };

    }

    return {

        batterySOC:
            latest.battery?.soc ?? 0,

        solarPower:
            latest.solar?.power ?? 0,

        loadPower:
            latest.load?.power ?? 0,

        generatorPower:
            latest.generator?.power ?? 0,

        gridPower:
            latest.grid?.power ?? 0,

        renewableContribution:
            latest.energy?.renewablePercentage ?? 0

    };

}

/**
 * ============================================================================
 * Alarm Summary
 * ============================================================================
 */

export async function alarmSummary(siteId) {

    const latest = await latestRecord(siteId);

    if (!latest) {

        return {

            total: 0,

            critical: 0,

            warning: 0,

            alarms: []

        };

    }

    const alarms = latest.alarms || [];

    return {

        total: alarms.length,

        critical:

            alarms.filter(
                alarm => alarm.severity === "critical"
            ).length,

        warning:

            alarms.filter(
                alarm => alarm.severity === "warning"
            ).length,

        alarms

    };

}

/**
 * ============================================================================
 * Battery Analytics
 * ============================================================================
 */

export async function batteryAnalytics(siteId) {

    return {

        current: await getBatteryTelemetry(siteId),

        status: await getBatteryStatus(siteId)

    };

}

/**
 * ============================================================================
 * Solar Analytics
 * ============================================================================
 */

export async function solarAnalytics(siteId) {

    return {

        current:
            await getSolarTelemetry(siteId)

    };

}

/**
 * ============================================================================
 * Generator Analytics
 * ============================================================================
 */

export async function generatorAnalytics(siteId) {

    return {

        current:
            await getGeneratorTelemetry(siteId)

    };

}

/**
 * ============================================================================
 * Grid Analytics
 * ============================================================================
 */

export async function gridAnalytics(siteId) {

    return {

        current:
            await getGridTelemetry(siteId)

    };

}

/**
 * ============================================================================
 * Weather Analytics
 * ============================================================================
 */

export async function weatherAnalytics(siteId) {

    return {

        current:
            await getWeatherTelemetry(siteId)

    };

}

/**
 * ============================================================================
 * Energy Forecast
 * ============================================================================
 */

export async function energyForecast(siteId) {

    const latest = await latestRecord(siteId);

    return {

        generatedAt: new Date(),

        siteId,

        currentLoad:

            latest?.load?.power ?? 0,

        projectedEnergy:

            latest?.energy?.today ?? 0,

        prediction:

            "Forecast module integration pending."

    };

}

/**
 * ============================================================================
 * Reliability Summary
 * ============================================================================
 */

export async function reliabilitySummary(siteId) {

    const latest = await latestRecord(siteId);

    return {

        siteId,

        availability:

            latest?.reliability?.availability ?? 0,

        reliability:

            latest?.reliability?.reliability ?? 0,

        mtbf:

            latest?.reliability?.mtbf ?? 0,

        mttr:

            latest?.reliability?.mttr ?? 0,

        saidi:

            latest?.reliability?.saidi ?? 0,

        saifi:

            latest?.reliability?.saifi ?? 0,

        ens:

            latest?.reliability?.ens ?? 0

    };

}

/**
 * ============================================================================
 * Dashboard Summary
 * ============================================================================
 */

export async function getDashboardTelemetry(siteId) {

    const [

        latest,

        battery,

        kpis,

        alarms,

        reliability

    ] = await Promise.all([

        getLatestSnapshot(siteId),

        batteryAnalytics(siteId),

        liveKPIs(siteId),

        alarmSummary(siteId),

        reliabilitySummary(siteId)

    ]);

    return {

        generatedAt: new Date(),

        latest,

        battery,

        kpis,

        alarms,

        reliability

    };

}

/*
|--------------------------------------------------------------------------
| Administration
|--------------------------------------------------------------------------
*/

/**
 * ============================================================================
 * Export Telemetry
 * ============================================================================
 */

export async function exportTelemetry(filters = {}) {

    const query = buildTelemetryQuery(
        filters.siteId,
        filters
    );

    const telemetry = await Telemetry.find(query)
        .sort({ timestamp: -1 })
        .lean();

    return {

        generatedAt: new Date(),

        totalRecords: telemetry.length,

        telemetry

    };

}

/**
 * ============================================================================
 * Import Telemetry
 * ============================================================================
 */

export async function importTelemetry(payload = []) {

    if (!Array.isArray(payload)) {

        throw new Error(
            "Telemetry import expects an array."
        );

    }

    const inserted = await Telemetry.insertMany(
        payload,
        {
            ordered: false
        }
    );

    return {

        success: true,

        imported: inserted.length

    };

}

/**
 * ============================================================================
 * Refresh Cache
 * ============================================================================
 *
 * Future:
 * Redis
 * Memcached
 * In-Memory Cache
 *
 */

export async function refreshCache(siteId) {

    logger.info(

        `Refreshing telemetry cache for ${siteId}`

    );

    return {

        success: true,

        refreshedAt: new Date()

    };

}

/**
 * ============================================================================
 * Broadcast Latest Telemetry
 * ============================================================================
 *
 * Socket.IO integration point.
 * Controller will eventually inject io.
 *
 */

export async function broadcastLatestTelemetry(siteId, io = null) {

    const latest = await getLatestSnapshot(siteId);

    if (io) {

        io.to(`site:${siteId}`).emit(

            "telemetry:live",

            latest

        );

    }

    return {

        success: true,

        broadcast: !!io,

        telemetry: latest

    };

}

/**
 * ============================================================================
 * Health Check
 * ============================================================================
 */

export async function healthCheck(siteId) {

    const latest = await getLatestSnapshot(siteId);

    return {

        service: "Telemetry",

        status:

            latest ? "HEALTHY" : "NO DATA",

        database: "CONNECTED",

        latestTimestamp:

            latest?.timestamp || null,

        checkedAt:

            new Date()

    };

}