import * as statisticsService from "../analytics/statisticsService.js";
import * as forecastService from "../analytics/forecastService.js";
import * as optimizationService from "../analytics/optimizationService.js";
import * as reliabilityService from "../analytics/reliabilityService.js";
import * as insightsService from "../analytics/insightsService.js";
import * as chartService from "../analytics/chartService.js";

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export async function getDashboard(filters = {}) {

    console.log("Dashboard Filters:", filters);

    const [
        statistics,
        reliability,
        forecasts,
        insights,
        charts
    ] = await Promise.all([

        statisticsService.getDashboardStatistics(filters),

        reliabilityService.getReliabilityMetrics(filters),

        forecastService.getForecastDashboard(
            filters.siteId,
            filters.algorithm
        ),

        insightsService.generateInsights(filters),

        chartService.getDashboardCharts(filters)

    ]);

    return {

        generatedAt: new Date(),

        filters,

        statistics,

        reliability,

        forecasts,

        insights,

        charts

    };

}


/*
|--------------------------------------------------------------------------
| Executive Dashboard
|--------------------------------------------------------------------------
*/

export async function getExecutiveDashboard(filters = {}) {

    const dashboard = await getDashboard(filters);

    return {

        generatedAt: dashboard.generatedAt,

        summary: {

            totalSites:
                dashboard.statistics?.totalSites ?? 0,

            activeSites:
                dashboard.statistics?.activeSites ?? 0,

            offlineSites:
                dashboard.statistics?.offlineSites ?? 0,

            activeAlarms:
                dashboard.statistics?.activeAlarms ?? 0,

            renewableEnergy:
                dashboard.statistics?.renewablePercentage ?? 0,

            batterySOC:
                dashboard.statistics?.averageSOC ?? 0

        },

        dashboard

    };

}


/*
|--------------------------------------------------------------------------
| Dashboard Cards
|--------------------------------------------------------------------------
*/

export async function getDashboardCards(filters = {}) {

    const stats =
        await statisticsService.getDashboardStatistics(filters);

    return {

        totalSites:
            stats.totalSites ?? 0,

        activeSites:
            stats.activeSites ?? 0,

        activeAlarms:
            stats.activeAlarms ?? 0,

        batterySOC:
            stats.averageSOC ?? 0,

        renewableEnergy:
            stats.renewablePercentage ?? 0,

        generatorRuntime:
            stats.generatorRuntime ?? 0

    };

}


/*
|--------------------------------------------------------------------------
| Dashboard KPIs
|--------------------------------------------------------------------------
*/

export async function getKPIs(filters = {}) {

    return statisticsService.getKPIs(filters);

}


/*
|--------------------------------------------------------------------------
| Dashboard Map
|--------------------------------------------------------------------------
*/

export async function getMap(filters = {}) {

    return statisticsService.getSiteLocations(filters);

}


/*
|--------------------------------------------------------------------------
| Optimization Summary
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| Optimization is site-specific.
|
| The main dashboard is fleet-level and normally has no siteId.
| Therefore we must NOT call getDashboardOptimization() when
| siteId is missing.
|--------------------------------------------------------------------------
*/

export async function getOptimizationSummary(filters = {}) {

    const siteId = filters?.siteId;

    /*
     * No site selected.
     *
     * This is a valid dashboard state, not an error.
     */
    if (!siteId) {

        return {

            siteId: null,

            scope: "fleet",

            available: false,

            message:
                "Select a site to view site-specific optimization.",

            data: null

        };

    }


    /*
     * Site selected.
     */

    return optimizationService.getDashboardOptimization({

        siteId

    });

}


/*
|--------------------------------------------------------------------------
| Refresh Dashboard
|--------------------------------------------------------------------------
*/

export async function refreshDashboard(filters = {}) {

    return getDashboard(filters);

}


/*
|--------------------------------------------------------------------------
| Dashboard Charts
|--------------------------------------------------------------------------
*/

export async function getDashboardCharts(filters = {}) {

    return chartService.getDashboardCharts(filters);

}


/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    getDashboard,

    getExecutiveDashboard,

    getDashboardCards,

    getKPIs,

    getMap,

    getOptimizationSummary,

    getDashboardCharts,

    refreshDashboard

};