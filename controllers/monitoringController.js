import Site from "../models/Site.js";
import Telemetry from "../models/Telemetry.js";
import Alarm from "../models/Alarm.js";
import Statistic from "../models/Statistics.js";

import { runManualSync } from "../jobs/vrmScheduler.js";

/*
|--------------------------------------------------------------------------
| Dashboard Summary
|--------------------------------------------------------------------------
*/

export async function getDashboard(req, res, next) {
    try {
        const [
            totalSites,
            onlineSites,
            activeAlarms,
            latestTelemetry,
            latestStatistic
        ] = await Promise.all([
            Site.countDocuments(),
            Site.countDocuments({ status: "ONLINE" }),
            Alarm.countDocuments({ status: "ACTIVE" }),
            Telemetry.findOne()
                .sort({ timestamp: -1 })
                .populate("site"),
            Statistic.findOne()
                .sort({ timestamp: -1 })
                .populate("site")
        ]);

        return res.status(200).json({
            success: true,
            message: "Dashboard retrieved successfully.",
            data: {
                totalSites,
                onlineSites,
                offlineSites: totalSites - onlineSites,
                activeAlarms,
                telemetry: latestTelemetry,
                statistics: latestStatistic
            }
        });
    } catch (error) {
        next(error);
    }
}

/*
|--------------------------------------------------------------------------
| Get Sites
|--------------------------------------------------------------------------
*/

export async function getSites(req, res, next) {
    try {
        const sites = await Site.find().sort({ name: 1 });

        return res.status(200).json({
            success: true,
            message: "Sites retrieved successfully.",
            data: sites
        });
    } catch (error) {
        next(error);
    }
}

/*
|--------------------------------------------------------------------------
| Latest Telemetry
|--------------------------------------------------------------------------
*/

export async function getTelemetry(req, res, next) {
    try {
        const { site } = req.query;

        const filter = {};

        if (site) {
            filter.site = site;
        }

        const telemetry = await Telemetry.find(filter)
            .populate("site")
            .sort({ timestamp: -1 })
            .limit(100);

        return res.status(200).json({
            success: true,
            message: "Telemetry retrieved successfully.",
            data: telemetry
        });
    } catch (error) {
        next(error);
    }
}

/*
|--------------------------------------------------------------------------
| Active Alarms
|--------------------------------------------------------------------------
*/

export async function getAlarms(req, res, next) {
    try {
        const alarms = await Alarm.find({
            status: "ACTIVE"
        })
            .populate("site")
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            message: "Active alarms retrieved successfully.",
            data: alarms
        });
    } catch (error) {
        next(error);
    }
}

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export async function getStatistics(req, res, next) {
    try {
        const statistics = await Statistic.find()
            .populate("site")
            .sort({
                timestamp: -1
            })
            .limit(50);

        return res.status(200).json({
            success: true,
            message: "Statistics retrieved successfully.",
            data: statistics
        });
    } catch (error) {
        next(error);
    }
}

/*
|--------------------------------------------------------------------------
| Manual Synchronization
|--------------------------------------------------------------------------
*/

export async function syncMonitoring(req, res, next) {
    try {
        await runManualSync();

        return res.status(200).json({
            success: true,
            message: "VRM synchronization started."
        });
    } catch (error) {
        next(error);
    }
}

export default {

    getDashboard,

    getSites,

    getTelemetry,

    getAlarms,

    getStatistics,

    syncMonitoring
    
};