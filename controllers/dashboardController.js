import * as dashboardService from "../services/dashboard/dashboardService.js";

/**
 * ============================================================================
 * Dashboard Controller
 * ============================================================================
 */

/**
 * GET /dashboard
 */
export async function getDashboard(req, res, next) {

    try {

        const dashboard = await dashboardService.getDashboard(req.body);

        return res.status(200).json({

            success: true,

            message: "Dashboard retrieved successfully.",

            data: dashboard

        });

    } catch (error) {

        next(error);

    }

}

/**
 * GET /dashboard/executive
 */
export async function getExecutiveDashboard(req, res, next) {

    try {

        const dashboard = await dashboardService.getExecutiveDashboard(req.body);

        return res.status(200).json({

            success: true,

            message: "Executive dashboard retrieved successfully.",

            data: dashboard

        });

    } catch (error) {

        next(error);

    }

}

/**
 * GET /dashboard/cards
 */
export async function getDashboardCards(req, res, next) {

    try {

        const cards = await dashboardService.getDashboardCards(req.body);

        return res.status(200).json({

            success: true,

            message: "Dashboard cards retrieved successfully.",

            data: cards

        });

    } catch (error) {

        next(error);

    }

}

/**
 * GET /dashboard/kpis
 */
export async function getKPIs(req, res, next) {

    try {

        const kpis = await dashboardService.getKPIs(req.body);

        return res.status(200).json({

            success: true,

            message: "KPIs retrieved successfully.",

            data: kpis

        });

    } catch (error) {

        next(error);

    }

}

/**
 * GET /dashboard/map
 */
export async function getMap(req, res, next) {

    try {

        const map = await dashboardService.getMap(req.body);

        return res.status(200).json({

            success: true,

            message: "Dashboard map retrieved successfully.",

            data: map

        });

    } catch (error) {

        next(error);

    }

}

/**
 * POST /dashboard/refresh
 */
export async function refreshDashboard(req, res, next) {

    try {

        const dashboard = await dashboardService.refreshDashboard(req.body);

        return res.status(200).json({

            success: true,

            message: "Dashboard refreshed successfully.",

            data: dashboard

        });

    } catch (error) {

        next(error);

    }

}

/**
 * GET /dashboard/optimization
 */
export async function getOptimizationSummary(req, res, next) {

    try {

        const summary = await dashboardService.getOptimizationSummary(req.body);

        return res.status(200).json({

            success: true,

            message: "Optimization summary retrieved successfully.",

            data: summary

        });

    } catch (error) {

        next(error);

    }

}

export default {

    getDashboard,

    getExecutiveDashboard,

    getDashboardCards,

    getKPIs,

    getMap,

    refreshDashboard,

    getOptimizationSummary

};