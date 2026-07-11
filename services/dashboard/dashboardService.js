import * as statisticsService from "../analytics/statisticsService.js";
import * as forecastService from "../analytics/forecastService.js";
import * as optimizationService from "../analytics/optimizationService.js";
import * as reliabilityService from "../analytics/reliabilityService.js";
import * as insightsService from "../analytics/insightsService.js";

/**
 * ============================================================================
 * Dashboard Service
 * ============================================================================
 * Aggregates data from analytics services into a single response for the UI.
 * No calculations should be performed here.
 * ============================================================================
 */

export async function getDashboard(filters = {}) {

    const [
        statistics,
        reliability,
        forecasts,
        insights
    ] = await Promise.allSettled([

        statisticsService.getDashboardStatistics(filters.siteId),

        reliabilityService.getReliabilityMetrics(filters.siteId),

        forecastService.generateForecast(filters.siteId),

        insightsService.generateInsights(filters.siteId)

    ]);

    return {

        timestamp: new Date(),

        filters,

        statistics: extract(statistics),

        reliability: extract(reliability),

        forecasts: extract(forecasts),

        insights: extract(insights)

    };

}

/**
 * ============================================================================
 * Executive Dashboard
 * ============================================================================
 */

export async function getExecutiveDashboard(filters = {}) {

    const dashboard = await getDashboard(filters);

    return {

        generatedAt: new Date(),

        summary: {

            totalSites:
                dashboard.statistics?.totalSites ?? 0,

            activeSites:
                dashboard.statistics?.activeSites ?? 0,

            offlineSites:
                dashboard.statistics?.offlineSites ?? 0,

            activeAlarms:
                dashboard.statistics?.activeAlarms ?? 0,

            totalEnergy:
                dashboard.statistics?.energyGenerated ?? 0,

            renewableContribution:
                dashboard.statistics?.renewablePercentage ?? 0

        },

        dashboard

    };

}

/**
 * ============================================================================
 * KPI Cards
 * ============================================================================
 */

export async function getDashboardCards(filters = {}) {

    const stats = await statisticsService.getDashboardStatistics(filters);

    return {

        totalSites:
            stats?.totalSites ?? 0,

        activeSites:
            stats?.activeSites ?? 0,

        activeAlarms:
            stats?.activeAlarms ?? 0,

        batterySOC:
            stats?.averageSOC ?? 0,

        renewableEnergy:
            stats?.renewablePercentage ?? 0,

        generatorRuntime:
            stats?.generatorRuntime ?? 0

    };

}

/**
 * ============================================================================
 * Dashboard Map
 * ============================================================================
 */

export async function getMap(filters = {}) {

    return statisticsService.getSiteLocations(filters);

}

/**
 * ============================================================================
 * Dashboard KPIs
 * ============================================================================
 */

export async function getKPIs(filters = {}) {

    return statisticsService.getKPIs(filters);

}

/**
 * ============================================================================
 * Dashboard Refresh
 * ============================================================================
 */

export async function refreshDashboard(filters = {}) {

    return getDashboard(filters);

}

/**
 * ============================================================================
 * Optimization Summary
 * ============================================================================
 */

export async function getOptimizationSummary(filters = {}) {

    return optimizationService.optimize(filters);

}

/**
 * ============================================================================
 * Utility
 * ============================================================================
 */

function extract(result) {

    if (result.status === "fulfilled") {

        return result.value;

    }

    return {

        success: false,

        error: result.reason?.message ||

            "Unable to retrieve data."

    };

}

export default {

    getDashboard,

    getExecutiveDashboard,

    getDashboardCards,

    getMap,

    getKPIs,

    refreshDashboard,

    getOptimizationSummary

};