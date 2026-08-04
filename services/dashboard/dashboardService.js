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

    return statisticsService.getDashboardCards(filters);

}

/*
|--------------------------------------------------------------------------
| KPIs
|--------------------------------------------------------------------------
*/

export async function getKPIs(filters = {}) {

    return statisticsService.getKPIs(filters);

}

/*
|--------------------------------------------------------------------------
| Map
|--------------------------------------------------------------------------
*/

export async function getMap(filters = {}) {

    return statisticsService.getSiteLocations(filters);

}

/*
|--------------------------------------------------------------------------
| Optimization Summary
|--------------------------------------------------------------------------
*/

export async function getOptimizationSummary(filters = {}) {

    return optimizationService.optimize(filters);

}

/*
|--------------------------------------------------------------------------
| Refresh
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