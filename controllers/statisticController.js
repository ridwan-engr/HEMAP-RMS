import * as statisticsService from "../services/analytics/statisticsService.js";

/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

export async function getDashboardStatistics(req, res, next) {

    try {

        const statistics = await statisticsService.getDashboardStatistics(

            req.query

        );

        return res.status(200).json({

            success: true,

            message: "Dashboard statistics retrieved successfully.",

            data: statistics

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Energy Statistics
|--------------------------------------------------------------------------
*/

export async function getEnergyStatistics(req, res, next) {

    try {

        const statistics = await statisticsService.getEnergyStatistics(

            req.query

        );

        return res.status(200).json({

            success: true,

            message: "Energy statistics retrieved successfully.",

            data: statistics

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Battery Statistics
|--------------------------------------------------------------------------
*/

export async function getBatteryStatistics(req, res, next) {

    try {

        const statistics = await statisticsService.getBatteryStatistics(

            req.query

        );

        return res.status(200).json({

            success: true,

            message: "Battery statistics retrieved successfully.",

            data: statistics

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Solar Statistics
|--------------------------------------------------------------------------
*/

export async function getSolarStatistics(req, res, next) {

    try {

        const statistics = await statisticsService.getSolarStatistics(

            req.query

        );

        return res.status(200).json({

            success: true,

            message: "Solar statistics retrieved successfully.",

            data: statistics

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Generator Statistics
|--------------------------------------------------------------------------
*/

export async function getGeneratorStatistics(req, res, next) {

    try {

        const statistics = await statisticsService.getGeneratorStatistics(

            req.query

        );

        return res.status(200).json({

            success: true,

            message: "Generator statistics retrieved successfully.",

            data: statistics

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Grid Statistics
|--------------------------------------------------------------------------
*/

export async function getGridStatistics(req, res, next) {

    try {

        const statistics = await statisticsService.getGridStatistics(

            req.query

        );

        return res.status(200).json({

            success: true,

            message: "Grid statistics retrieved successfully.",

            data: statistics

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| KPI Statistics
|--------------------------------------------------------------------------
*/

export async function getKPIs(req, res, next) {

    try {

        const statistics = await statisticsService.getKPIs(

            req.query

        );

        return res.status(200).json({

            success: true,

            message: "KPIs retrieved successfully.",

            data: statistics

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Site Locations
|--------------------------------------------------------------------------
*/

export async function getSiteLocations(req, res, next) {

    try {

        const statistics = await statisticsService.getSiteLocations(

            req.query

        );

        return res.status(200).json({

            success: true,

            message: "Site locations retrieved successfully.",

            data: statistics

        });

    }

    catch (error) {

        next(error);

    }

}

export default {

    getDashboardStatistics,

    getEnergyStatistics,

    getBatteryStatistics,

    getSolarStatistics,

    getGeneratorStatistics,

    getGridStatistics,

    getKPIs,

    getSiteLocations

};