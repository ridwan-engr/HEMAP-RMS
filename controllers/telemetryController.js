import * as telemetryService from "../services/telemetry/telemetryService.js";
import * as syncService from "../services/telemetry/syncService.js";
import * as batteryService from "../services/sites/batteryService.js";
import * as solarService from "../services/sites/solarService.js";
import * as generatorService from "../services/sites/generatorService.js";
import * as gridService from "../services/sites/gridService.js";
import * as statisticsService from "../services/analytics/statisticsService.js";
import * as forecastService from "../services/analytics/forecastService.js";
import * as reliabilityService from "../services/analytics/reliabilityService.js";
import * as alarmService from "../services/telemetry/alarmService.js";
/*
|--------------------------------------------------------------------------
| Live Telemetry
|--------------------------------------------------------------------------
*/

export async function getLiveTelemetry(req, res) {

    try {

        const telemetry =
            await telemetryService.getLiveTelemetry(
                req.body.siteId
            );

        return res.status(200).json({

            success: true,

            data: telemetry

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Historical Telemetry
|--------------------------------------------------------------------------
*/

export async function getHistoricalTelemetry(req, res) {

    try {

        const history =
            await telemetryService.getHistoricalTelemetry(

                req.body.siteId,

                {

                    start: req.body.start,

                    end: req.body.end,

                    interval: req.body.interval || "1h"

                }

            );

        return res.status(200).json({

            success: true,

            data: history

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Latest Snapshot
|--------------------------------------------------------------------------
*/

export async function latestSnapshot(req, res) {

    try {

        const snapshot =
            await telemetryService.getLatestSnapshot(

                req.body.siteId

            );

        return res.status(200).json({

            success: true,

            data: snapshot

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Device Status
|--------------------------------------------------------------------------
*/

export async function deviceStatus(req, res) {

    try {

        const status =
            await telemetryService.getDeviceStatus(

                req.body.siteId

            );

        return res.status(200).json({

            success: true,

            data: status

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Communication Status
|--------------------------------------------------------------------------
*/

export async function communicationStatus(req, res) {

    try {

        const communication =
            await telemetryService.getCommunicationStatus(

                req.body.siteId

            );

        return res.status(200).json({

            success: true,

            data: communication

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Manual Synchronization
|--------------------------------------------------------------------------
*/

export async function synchronize(req, res) {

    try {

        const result =
            await syncService.syncInstallation(

                req.body.siteId

            );

        return res.status(200).json({

            success: true,

            message: "Synchronization completed successfully.",

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Component Telemetry
|--------------------------------------------------------------------------
*/

export async function componentTelemetry(req, res) {

    try {

        const siteId = req.body.siteId;

        const [
            battery,
            solar,
            generator,
            grid,
            inverter,
            rectifier,
            meter,
            weather
        ] = await Promise.all([

            batteryService.getBatteryTelemetry(siteId),

            solarService.getSolarTelemetry(siteId),

            generatorService.getGeneratorTelemetry(siteId),

            gridService.getGridTelemetry(siteId),

            telemetryService.getInverterTelemetry(siteId),

            telemetryService.getRectifierTelemetry(siteId),

            telemetryService.getSmartMeterTelemetry(siteId),

            telemetryService.getWeatherTelemetry(siteId)

        ]);

        return res.status(200).json({

            success: true,

            data: {

                battery,

                solar,

                generator,

                grid,

                inverter,

                rectifier,

                meter,

                weather

            }

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Battery Telemetry
|--------------------------------------------------------------------------
*/

export async function batteryTelemetry(req, res) {

    try {

        const telemetry =
            await batteryService.getBatteryTelemetry(

                req.body.siteId

            );

        return res.status(200).json({

            success: true,

            data: telemetry

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Solar Telemetry
|--------------------------------------------------------------------------
*/

export async function solarTelemetry(req, res) {

    try {

        const telemetry =
            await solarService.getSolarTelemetry(

                req.body.siteId

            );

        return res.status(200).json({

            success: true,

            data: telemetry

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Generator Telemetry
|--------------------------------------------------------------------------
*/

export async function generatorTelemetry(req, res) {

    try {

        const telemetry =
            await generatorService.getGeneratorTelemetry(

                req.body.siteId

            );

        return res.status(200).json({

            success: true,

            data: telemetry

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Grid Telemetry
|--------------------------------------------------------------------------
*/

export async function gridTelemetry(req, res) {

    try {

        const telemetry =
            await gridService.getGridTelemetry(

                req.body.siteId

            );

        return res.status(200).json({

            success: true,

            data: telemetry

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Inverter Telemetry
|--------------------------------------------------------------------------
*/

export async function inverterTelemetry(req, res) {

    try {

        const telemetry =
            await telemetryService.getInverterTelemetry(

                req.body.siteId

            );

        return res.status(200).json({

            success: true,

            data: telemetry

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Huawei Rectifier Telemetry
|--------------------------------------------------------------------------
*/

export async function rectifierTelemetry(req, res) {

    try {

        const telemetry =
            await telemetryService.getRectifierTelemetry(

                req.body.siteId

            );

        return res.status(200).json({

            success: true,

            data: telemetry

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Smart Meter Telemetry
|--------------------------------------------------------------------------
*/

export async function smartMeterTelemetry(req, res) {

    try {

        const telemetry =
            await telemetryService.getSmartMeterTelemetry(

                req.body.siteId

            );

        return res.status(200).json({

            success: true,

            data: telemetry

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Load Telemetry
|--------------------------------------------------------------------------
*/

export async function loadTelemetry(req, res) {

    try {

        const telemetry =
            await telemetryService.getLoadTelemetry(

                req.body.siteId

            );

        return res.status(200).json({

            success: true,

            data: telemetry

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Telemetry Statistics
|--------------------------------------------------------------------------
*/

export async function telemetryStatistics(req, res) {

    try {

        const statistics =
            await statisticsService.getTelemetryStatistics(
                req.body.siteId,
                req.body
            );

        return res.status(200).json({
            success: true,
            data: statistics
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Telemetry Trends
|--------------------------------------------------------------------------
*/

export async function telemetryTrends(req, res) {

    try {

        const trends =
            await statisticsService.getTelemetryTrends(
                req.body.siteId,
                req.body
            );

        return res.status(200).json({
            success: true,
            data: trends
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Live KPIs
|--------------------------------------------------------------------------
*/

export async function liveKPIs(req, res) {

    try {

        const kpis =
            await statisticsService.getSiteKPIs(
                req.body.siteId
            );

        return res.status(200).json({
            success: true,
            data: kpis
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Alarm Summary
|--------------------------------------------------------------------------
*/

export async function alarmSummary(req, res) {

    try {

        const alarms =
            await alarmService.getAlarmSummary(
                req.body.siteId
            );

        return res.status(200).json({
            success: true,
            data: alarms
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Battery Analytics
|--------------------------------------------------------------------------
*/

export async function batteryAnalytics(req, res) {

    try {

        const analytics =
            await statisticsService.getBatteryAnalytics(
                req.body.siteId,
                req.body
            );

        return res.status(200).json({
            success: true,
            data: analytics
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Solar Analytics
|--------------------------------------------------------------------------
*/

export async function solarAnalytics(req, res) {

    try {

        const analytics =
            await statisticsService.getSolarAnalytics(
                req.body.siteId,
                req.body
            );

        return res.status(200).json({
            success: true,
            data: analytics
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Generator Analytics
|--------------------------------------------------------------------------
*/

export async function generatorAnalytics(req, res) {

    try {

        const analytics =
            await statisticsService.getGeneratorAnalytics(
                req.body.siteId,
                req.body
            );

        return res.status(200).json({
            success: true,
            data: analytics
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Grid Analytics
|--------------------------------------------------------------------------
*/

export async function gridAnalytics(req, res) {

    try {

        const analytics =
            await statisticsService.getGridAnalytics(
                req.body.siteId,
                req.body
            );

        return res.status(200).json({
            success: true,
            data: analytics
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Weather Analytics
|--------------------------------------------------------------------------
*/

export async function weatherAnalytics(req, res) {

    try {

        const analytics =
            await statisticsService.getWeatherAnalytics(
                req.body.siteId,
                req.body
            );

        return res.status(200).json({
            success: true,
            data: analytics
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Energy Forecast
|--------------------------------------------------------------------------
*/

export async function energyForecast(req, res) {

    try {

        const forecast =
            await forecastService.generateForecast(
                req.body.siteId,
                req.body
            );

        return res.status(200).json({
            success: true,
            data: forecast
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Reliability Summary
|--------------------------------------------------------------------------
*/

export async function reliabilitySummary(req, res) {

    try {

        const report =
            await reliabilityService.generateReliabilityMetrics(
                req.body.siteId
            );

        return res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Export Telemetry
|--------------------------------------------------------------------------
*/

export async function exportTelemetry(req, res) {

    try {

        const result = await telemetryService.exportTelemetry(

            req.body.siteId,

            {
                format: req.body.format || "json",
                start: req.body.start,
                end: req.body.end
            }

        );

        return res.status(200).json({

            success: true,

            message: "Telemetry exported successfully.",

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Import Telemetry
|--------------------------------------------------------------------------
*/

export async function importTelemetry(req, res) {

    try {

        const result = await telemetryService.importTelemetry(

            req.body.siteId,

            req.body.records

        );

        return res.status(201).json({

            success: true,

            message: "Telemetry imported successfully.",

            data: result

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Refresh Telemetry Cache
|--------------------------------------------------------------------------
*/

export async function refreshCache(req, res) {

    try {

        const cache = await telemetryService.refreshCache(

            req.body.siteId

        );

        return res.status(200).json({

            success: true,

            message: "Telemetry cache refreshed successfully.",

            data: cache

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Broadcast Latest Telemetry
|--------------------------------------------------------------------------
*/

export async function broadcastTelemetry(req, res) {

    try {

        const payload = await telemetryService.broadcastLatestTelemetry(

            req.body.siteId

        );

        return res.status(200).json({

            success: true,

            message: "Telemetry broadcast completed.",

            data: payload

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Telemetry Health Check
|--------------------------------------------------------------------------
*/

export async function telemetryHealth(req, res) {

    try {

        const health = await telemetryService.healthCheck(

            req.body.siteId

        );

        return res.status(200).json({

            success: true,

            data: health

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    // Live Monitoring
    getLiveTelemetry,
    getHistoricalTelemetry,
    latestSnapshot,
    deviceStatus,
    communicationStatus,
    synchronize,

    // Component Telemetry
    componentTelemetry,
    batteryTelemetry,
    solarTelemetry,
    generatorTelemetry,
    gridTelemetry,
    inverterTelemetry,
    rectifierTelemetry,
    smartMeterTelemetry,
    loadTelemetry,

    // Analytics
    telemetryStatistics,
    telemetryTrends,
    liveKPIs,
    alarmSummary,
    batteryAnalytics,
    solarAnalytics,
    generatorAnalytics,
    gridAnalytics,
    weatherAnalytics,
    energyForecast,
    reliabilitySummary,

    // Administration
    exportTelemetry,
    importTelemetry,
    refreshCache,
    broadcastTelemetry,
    telemetryHealth

};