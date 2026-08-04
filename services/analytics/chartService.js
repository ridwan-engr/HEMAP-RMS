import mongoose from "mongoose";
import Telemetry from "../../models/Telemetry.js";
import Alarm from "../../models/Alarm.js";

/*
|--------------------------------------------------------------------------
| Build Query
|--------------------------------------------------------------------------
*/

function buildQuery(filters = {}) {

    const query = {};

    if (
        filters.siteId &&
        mongoose.Types.ObjectId.isValid(filters.siteId)
    ) {
        query.site = new mongoose.Types.ObjectId(filters.siteId);
    }

    if (filters.startDate || filters.endDate) {

        query.timestamp = {};

        if (filters.startDate) {
            query.timestamp.$gte = new Date(filters.startDate);
        }

        if (filters.endDate) {
            query.timestamp.$lte = new Date(filters.endDate);
        }

    }

    return query;

}

/*
|--------------------------------------------------------------------------
| Generic Trend
|--------------------------------------------------------------------------
*/

async function getTrend(field, filters = {}) {

    const query = buildQuery(filters);

    const records = await Telemetry.find(query)
        .select(`timestamp ${field}`)
        .sort({ timestamp: 1 })
        .lean();

    return records.map(item => ({

        timestamp: item.timestamp,

        value: item[field] ?? 0

    }));

}

/*
|--------------------------------------------------------------------------
| Solar Trend
|--------------------------------------------------------------------------
*/

export async function getSolarTrend(filters = {}) {

    return getTrend("solarPower", filters);

}

/*
|--------------------------------------------------------------------------
| Battery Trend
|--------------------------------------------------------------------------
*/

export async function getBatteryTrend(filters = {}) {

    return getTrend("batterySOC", filters);

}

/*
|--------------------------------------------------------------------------
| Load Trend
|--------------------------------------------------------------------------
*/

export async function getLoadTrend(filters = {}) {

    return getTrend("loadPower", filters);

}

/*
|--------------------------------------------------------------------------
| Grid Trend
|--------------------------------------------------------------------------
*/

export async function getGridTrend(filters = {}) {

    return getTrend("gridPower", filters);

}

/*
|--------------------------------------------------------------------------
| Generator Trend
|--------------------------------------------------------------------------
*/

export async function getGeneratorTrend(filters = {}) {

    return getTrend("generatorPower", filters);

}

/*
|--------------------------------------------------------------------------
| Renewable Trend
|--------------------------------------------------------------------------
*/

export async function getRenewableTrend(filters = {}) {

    return getTrend("renewablePercentage", filters);

}

/*
|--------------------------------------------------------------------------
| Energy Generated Trend
|--------------------------------------------------------------------------
*/

export async function getEnergyTrend(filters = {}) {

    return getTrend("energyGenerated", filters);

}

/*
|--------------------------------------------------------------------------
| Alarm Trend
|--------------------------------------------------------------------------
*/

export async function getAlarmTrend(filters = {}) {

    const query = {};

    if (
        filters.siteId &&
        mongoose.Types.ObjectId.isValid(filters.siteId)
    ) {
        query.site = new mongoose.Types.ObjectId(filters.siteId);
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

    return Alarm.aggregate([
        {
            $match: query
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt"
                    }
                },
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ]);

}

/*
|--------------------------------------------------------------------------
| Dashboard Charts
|--------------------------------------------------------------------------
*/

export async function getDashboardCharts(filters = {}) {

    const [

        solar,

        battery,

        load,

        grid,

        generator,

        renewable,

        energy,

        alarms

    ] = await Promise.all([

        getSolarTrend(filters),

        getBatteryTrend(filters),

        getLoadTrend(filters),

        getGridTrend(filters),

        getGeneratorTrend(filters),

        getRenewableTrend(filters),

        getEnergyTrend(filters),

        getAlarmTrend(filters)

    ]);

    return {

        solar,

        battery,

        load,

        grid,

        generator,

        renewable,

        energy,

        alarms,

        generatedAt: new Date()

    };

}

export default {

    getSolarTrend,

    getBatteryTrend,

    getLoadTrend,

    getGridTrend,

    getGeneratorTrend,

    getRenewableTrend,

    getEnergyTrend,

    getAlarmTrend,

    getDashboardCharts

};