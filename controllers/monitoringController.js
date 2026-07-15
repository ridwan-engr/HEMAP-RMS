import Site from "../models/Site.js";
import Telemetry from "../models/Telemetry.js";
import Alarm from "../models/Alarm.js";
import Statistic from "../models/Statistics.js";

import { runManualSync } from "../jobs/vrmScheduler.js";

/**
 * Dashboard Summary
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

            Site.countDocuments({

                status: "ONLINE"

            }),

            Alarm.countDocuments({

                status: "ACTIVE"

            }),

            Telemetry.findOne()

                .sort({

                    timestamp: -1

                })

                .populate("site"),

            Statistic.findOne()

                .sort({

                    timestamp: -1

                })

                .populate("site")

        ]);

        return res.status(200).json({

            success: true,

            dashboard: {

                totalSites,

                onlineSites,

                offlineSites:

                    totalSites -

                    onlineSites,

                activeAlarms,

                telemetry:

                    latestTelemetry,

                statistics:

                    latestStatistic

            }

        });

    }

    catch (error) {

        next(error);

    }

}

/**
 * Get all monitored sites
 */
export async function getSites(req, res, next) {

    try {

        const sites = await Site.find()

            .sort({

                name: 1

            });

        res.status(200).json({

            success: true,

            count: sites.length,

            sites

        });

    }

    catch (error) {

        next(error);

    }

}

/**
 * Latest telemetry
 */
export async function getTelemetry(req, res, next) {

    try {

        const {

            site

        } = req.body;

        const filter = {};

        if (site) {

            filter.site = site;

        }

        const telemetry = await Telemetry.find(filter)

            .populate("site")

            .sort({

                timestamp: -1

            })

            .limit(100);

        res.status(200).json({

            success: true,

            count: telemetry.length,

            telemetry

        });

    }

    catch (error) {

        next(error);

    }

}

/**
 * Active alarms
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

        res.status(200).json({

            success: true,

            count: alarms.length,

            alarms

        });

    }

    catch (error) {

        next(error);

    }

}

/**
 * Statistics
 */
export async function getStatistics(req, res, next) {

    try {

        const statistics = await Statistic.find()

            .populate("site")

            .sort({

                timestamp: -1

            })

            .limit(50);

        res.status(200).json({

            success: true,

            count: statistics.length,

            statistics

        });

    }

    catch (error) {

        next(error);

    }

}

/**
 * Manual synchronization
 */
export async function syncMonitoring(req, res, next) {

    try {

        await runManualSync();

        res.status(200).json({

            success: true,

            message:

                "VRM synchronization started."

        });

    }

    catch (error) {

        next(error);

    }

}