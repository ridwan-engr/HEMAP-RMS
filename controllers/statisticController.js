import Statistic from "../models/Statistics.js";
import logger from "../utils/logger.js";

/**
 * Create Statistic
 */
export async function createStatistic(req, res, next) {

    try {

        const statistic = await Statistic.create(req.body);

        logger.success(
            `Statistic created: ${statistic._id}`
        );

        return res.status(201).json({
            success: true,
            data: statistic
        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/**
 * Get all Statistics
 */
export async function getStatistics(req, res, next) {

    try {

        const filter = {};

        if (req.body.site) {

            filter.site = req.body.site;

        }

        if (req.body.period) {

            filter.period = req.body.period;

        }

        const statistics = await Statistic
            .find(filter)
            .populate("site", "name siteCode installationId")
            .sort({
                timestamp: -1
            });

        return res.json({

            success: true,

            count: statistics.length,

            data: statistics

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/**
 * Get Statistic by ID
 */
export async function getStatistic(req, res, next) {

    try {

        const statistic = await Statistic
            .findById(req.body.id)
            .populate("site");

        if (!statistic) {

            return res.status(404).json({

                success: false,

                message: "Statistic not found."

            });

        }

        return res.json({

            success: true,

            data: statistic

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/**
 * Get latest Statistic for a Site
 */
export async function getLatestStatistic(req, res, next) {

    try {

        const statistic = await Statistic
            .findOne({
                site: req.body.siteId
            })
            .sort({
                timestamp: -1
            });

        if (!statistic) {

            return res.status(404).json({

                success: false,

                message: "No statistics found."

            });

        }

        return res.json({

            success: true,

            data: statistic

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/**
 * Update Statistic
 */
export async function updateStatistic(req, res, next) {

    try {

        const statistic = await Statistic.findByIdAndUpdate(

            req.body.id,

            req.body,

            {

                new: true,

                runValidators: true

            }

        );

        if (!statistic) {

            return res.status(404).json({

                success: false,

                message: "Statistic not found."

            });

        }

        logger.success(

            `Statistic updated: ${statistic._id}`

        );

        return res.json({

            success: true,

            data: statistic

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/**
 * Delete Statistic
 */
export async function deleteStatistic(req, res, next) {

    try {

        const statistic = await Statistic.findByIdAndDelete(

            req.body.id

        );

        if (!statistic) {

            return res.status(404).json({

                success: false,

                message: "Statistic not found."

            });

        }

        logger.success(

            `Statistic deleted: ${req.body.id}`

        );

        return res.json({

            success: true,

            message: "Statistic deleted successfully."

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/**
 * Dashboard Statistics Summary
 */
export async function getStatisticsSummary(req, res, next) {

    try {

        const totalSites = await Statistic.distinct("site");

        const latest = await Statistic
            .find()
            .sort({
                timestamp: -1
            })
            .limit(20);

        const summary = {

            monitoredSites: totalSites.length,

            averageRenewableFraction:
                latest.length > 0
                    ? latest.reduce(
                          (sum, item) =>
                              sum + (item.renewableFraction || 0),
                          0
                      ) / latest.length
                    : 0,

            averageBatteryEfficiency:
                latest.length > 0
                    ? latest.reduce(
                          (sum, item) =>
                              sum + (item.batteryEfficiency || 0),
                          0
                      ) / latest.length
                    : 0,

            averageGridAvailability:
                latest.length > 0
                    ? latest.reduce(
                          (sum, item) =>
                              sum + (item.gridAvailability || 0),
                          0
                      ) / latest.length
                    : 0

        };

        return res.json({

            success: true,

            data: summary

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

export default {

    createStatistic,

    getStatistics,

    getStatistic,

    getLatestStatistic,

    updateStatistic,

    deleteStatistic,

    getStatisticsSummary

};