import mongoose from "mongoose";

import Site from "../../models/Site.js";
import Installation from "../../models/Installation.js";
import Alarm from "../../models/Alarm.js";
import Telemetry from "../../models/Telemetry.js";
import Statistics from "../../models/Statistics.js";
import logger from "../../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function buildTelemetryQuery(filters = {}) {

    const query = {};

    if (
        typeof filters.siteId === "string" &&
        mongoose.Types.ObjectId.isValid(filters.siteId)
    ) {
        query.site = filters.siteId;
    }

    return query;

}

async function getLatestTelemetry(filters = {}) {

    return await Telemetry.findOne(
        buildTelemetryQuery(filters)
    )
        .sort({
            createdAt: -1
        })
        .lean();

}

/*
|--------------------------------------------------------------------------
| Fleet Statistics
|--------------------------------------------------------------------------
*/

export async function getFleetStatistics(filters = {}) {

    const query = buildTelemetryQuery(filters);

    const [result] = await Telemetry.aggregate([

        {
            $match: query
        },

        {

            $group: {

                _id: null,

                averageSOC: {
                    $avg: "$batterySOC"
                },

                renewablePercentage: {
                    $avg: "$renewablePercentage"
                },

                totalEnergy: {
                    $sum: "$energyGenerated"
                },

                generatorRuntime: {
                    $sum: "$generatorRuntime"
                }

            }

        }

    ]);

    return result || {

        averageSOC: 0,

        renewablePercentage: 0,

        totalEnergy: 0,

        generatorRuntime: 0

    };

}

/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

export async function getDashboardStatistics(filters = {}) {

    const [

        totalSites,

        activeSites,

        totalInstallations,

        activeAlarms,

        latestTelemetry,

        fleet

    ] = await Promise.all([

        Site.countDocuments(),

        Site.countDocuments({
            status: "ACTIVE"
        }),

        Installation.countDocuments(),

        Alarm.countDocuments({
            status: "ACTIVE"
        }),

        getLatestTelemetry(filters),

        getFleetStatistics(filters)

    ]);

    return {

        totalSites,

        activeSites,

        offlineSites:

            Math.max(
                totalSites - activeSites,
                0
            ),

        totalInstallations,

        activeAlarms,

        energyGenerated:
            fleet.totalEnergy,

        renewablePercentage:
            fleet.renewablePercentage,

        averageSOC:
            fleet.averageSOC,

        generatorRuntime:
            fleet.generatorRuntime,

        latestTelemetry,

        timestamp:
            new Date()

    };

}


/*
|--------------------------------------------------------------------------
| Dashboard Cards
|--------------------------------------------------------------------------
*/

export async function getDashboardCards(filters = {}) {

    const dashboard = await getDashboardStatistics(filters);

    return {

        totalSites: dashboard.totalSites,

        activeSites: dashboard.activeSites,

        offlineSites: dashboard.offlineSites,

        activeAlarms: dashboard.activeAlarms,

        batterySOC: dashboard.averageSOC,

        renewableEnergy: dashboard.renewablePercentage,

        generatorRuntime: dashboard.generatorRuntime

    };

}

/*
|--------------------------------------------------------------------------
| Energy Statistics
|--------------------------------------------------------------------------
*/

export async function getEnergyStatistics(filters = {}) {

    const telemetry =
        await getLatestTelemetry(filters);

    return {

        solar:
            telemetry?.solarPower ?? 0,

        battery:
            telemetry?.batteryPower ?? 0,

        grid:
            telemetry?.gridPower ?? 0,

        generator:
            telemetry?.generatorPower ?? 0,

        load:
            telemetry?.loadPower ?? 0,

        totalEnergy:
            telemetry?.energyGenerated ?? 0,

        renewablePercentage:
            telemetry?.renewablePercentage ?? 0

    };

}

/*
|--------------------------------------------------------------------------
| Battery Statistics
|--------------------------------------------------------------------------
*/

export async function getBatteryStatistics(filters = {}) {

    const telemetry =
        await getLatestTelemetry(filters);

    return {

        soc:
            telemetry?.batterySOC ?? 0,

        voltage:
            telemetry?.batteryVoltage ?? 0,

        current:
            telemetry?.batteryCurrent ?? 0,

        temperature:
            telemetry?.batteryTemperature ?? 0,

        health:
            telemetry?.batteryHealth ?? 0

    };

}

/*
|--------------------------------------------------------------------------
| Solar Statistics
|--------------------------------------------------------------------------
*/

export async function getSolarStatistics(filters = {}) {

    const telemetry =
        await getLatestTelemetry(filters);

    return {

        power:
            telemetry?.solarPower ?? 0,

        voltage:
            telemetry?.solarVoltage ?? 0,

        current:
            telemetry?.solarCurrent ?? 0,

        irradiance:
            telemetry?.irradiance ?? 0,

        efficiency:
            telemetry?.solarEfficiency ?? 0

    };

}

/*
|--------------------------------------------------------------------------
| Generator Statistics
|--------------------------------------------------------------------------
*/

export async function getGeneratorStatistics(filters = {}) {

    const telemetry =
        await getLatestTelemetry(filters);

    return {

        status:
            telemetry?.generatorStatus ?? "OFF",

        runtime:
            telemetry?.generatorRuntime ?? 0,

        fuelLevel:
            telemetry?.fuelLevel ?? 0,

        power:
            telemetry?.generatorPower ?? 0

    };

}

/*
|--------------------------------------------------------------------------
| Grid Statistics
|--------------------------------------------------------------------------
*/

export async function getGridStatistics(filters = {}) {

    const telemetry =
        await getLatestTelemetry(filters);

    return {

        status:
            telemetry?.gridStatus ?? "UNKNOWN",

        voltage:
            telemetry?.gridVoltage ?? 0,

        current:
            telemetry?.gridCurrent ?? 0,

        frequency:
            telemetry?.gridFrequency ?? 0,

        power:
            telemetry?.gridPower ?? 0

    };

}

/*
|--------------------------------------------------------------------------
| Dashboard KPIs
|--------------------------------------------------------------------------
*/

export async function getKPIs(filters = {}) {

    const dashboard =
        await getDashboardStatistics(filters);

    return {

        totalSites:
            dashboard.totalSites,

        activeSites:
            dashboard.activeSites,

        offlineSites:
            dashboard.offlineSites,

        activeAlarms:
            dashboard.activeAlarms,

        renewablePercentage:
            dashboard.renewablePercentage,

        averageSOC:
            dashboard.averageSOC

    };

}

/*
|--------------------------------------------------------------------------
| Site Locations
|--------------------------------------------------------------------------
*/

export async function getSiteLocations() {

    const sites = await Site.find()

        .select(
            "name latitude longitude status"
        )

        .lean();

    return sites.map(site => ({

        id:
            site._id,

        name:
            site.name,

        latitude:
            site.latitude,

        longitude:
            site.longitude,

        status:
            site.status

    }));

}

export async function saveStatisticsSnapshot() {

    const installations = await Installation.find().lean();

    const snapshots = [];

    for (const installation of installations) {

        const latest = await Telemetry
            .findOne({
                installation: installation._id
            })
            .sort({ timestamp: -1 })
            .lean();

        if (!latest) {
            continue;
        }

        const snapshot = await Statistics.create({

            site: installation.site,

            installation: installation._id,

            installationId: installation.installationId,

            period: "HOURLY",

            timestamp: new Date(),

            energyGenerated: latest.solarPower || 0,

            energyConsumed: latest.loadPower || 0,

            gridAvailability: latest.gridPower > 0 ? 100 : 0,

            batteryEfficiency: latest.batterySOC || 0,

            renewableFraction:
                latest.loadPower > 0
                    ? ((latest.solarPower || 0) / latest.loadPower) * 100
                    : 0,

            generatorRuntime:
                latest.generatorPower > 0 ? 1 : 0,

            saidi: 0,

            saifi: 0,

            ens: 0,

            lolp: 0,

            resilience: 0,

            batterySOC: latest.batterySOC,

            batteryVoltage: latest.batteryVoltage,

            batteryCurrent: latest.batteryCurrent,

            solarPower: latest.solarPower,

            loadPower: latest.loadPower,

            gridPower: latest.gridPower,

            generatorPower: latest.generatorPower,

            inverterPower: latest.inverterPower

        });

        snapshots.push(snapshot);

    }

    logger.success({

        message: "Statistics snapshot created.",

        total: snapshots.length

    });

    return snapshots;

}

export default {

    getDashboardStatistics,

    getDashboardCards,

    getLatestTelemetry,

    getFleetStatistics,

    getEnergyStatistics,

    getBatteryStatistics,

    getSolarStatistics,

    getGeneratorStatistics,

    getGridStatistics,

    getKPIs,

    getSiteLocations,

    saveStatisticsSnapshot


};