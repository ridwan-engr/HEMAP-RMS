import * as statisticsService from "./statisticsService.js";
import * as reliabilityService from "./reliabilityService.js";
import * as forecastService from "./forecastService.js";
import * as optimizationService from "./optimizationService.js";
import * as insightsService from "./insightsService.js";
import {

    emitAnalytics

} from "../../websocket/eventEmitters.js";
/*
|--------------------------------------------------------------------------
| Dashboard Analytics
|--------------------------------------------------------------------------
*/

export async function getDashboardAnalytics(filters = {}) {

    const [

        statistics,

        reliability,

        forecasts,

        insights

    ] = await Promise.all([

        statisticsService.getDashboardStatistics(filters),

        reliabilityService.getReliabilityMetrics(filters),

        forecastService.getDashboardForecast(filters),

        insightsService.generateInsights(filters)

    ]);

    const analytics = {

        generatedAt: new Date(),

        statistics,

        reliability,

        forecasts,

        insights

    };

    /*
    |--------------------------------------------------------------------------
    | Emit Dashboard Analytics
    |--------------------------------------------------------------------------
    */

    emitAnalytics(

        filters.siteId,

        {

            module: "dashboard",

            analytics

        }

    );

    return analytics;

}

/*
|--------------------------------------------------------------------------
| Energy Analytics
|--------------------------------------------------------------------------
*/

export async function getEnergyAnalytics(filters = {}) {

    const analytics =

        await statisticsService.getEnergyStatistics(

            filters

        );

    emitAnalytics(

        filters.siteId,

        {

            module: "energy",

            analytics

        }

    );

    return analytics;

}

/*
|--------------------------------------------------------------------------
| Battery Analytics
|--------------------------------------------------------------------------
*/

export async function getBatteryAnalytics(filters = {}) {

    const analytics =

        await statisticsService.getBatteryStatistics(

            filters

        );

    emitAnalytics(

        filters.siteId,

        {

            module: "battery",

            analytics

        }

    );

    return analytics;

}

/*
|--------------------------------------------------------------------------
| Solar Analytics
|--------------------------------------------------------------------------
*/

export async function getSolarAnalytics(filters = {}) {

    const analytics =

        await statisticsService.getSolarStatistics(

            filters

        );

    emitAnalytics(

        filters.siteId,

        {

            module: "solar",

            analytics

        }

    );

    return analytics;

}

/*
|--------------------------------------------------------------------------
| Generator Analytics
|--------------------------------------------------------------------------
*/

export async function getGeneratorAnalytics(filters = {}) {

    const analytics =

        await statisticsService.getGeneratorStatistics(

            filters

        );

    emitAnalytics(

        filters.siteId,

        {

            module: "generator",

            analytics

        }

    );

    return analytics;

}

/*
|--------------------------------------------------------------------------
| Grid Analytics
|--------------------------------------------------------------------------
*/

export async function getGridAnalytics(filters = {}) {

    const analytics =

        await statisticsService.getGridStatistics(

            filters

        );

    emitAnalytics(

        filters.siteId,

        {

            module: "grid",

            analytics

        }

    );

    return analytics;

}

/*
|--------------------------------------------------------------------------
| Reliability Analytics
|--------------------------------------------------------------------------
*/

export async function getReliabilityAnalytics(filters = {}) {

    const analytics =

        await reliabilityService.getReliabilityMetrics(

            filters

        );

    emitAnalytics(

        filters.siteId,

        {

            module: "reliability",

            analytics

        }

    );

    return analytics;

}

/*
|--------------------------------------------------------------------------
| Optimization Summary
|--------------------------------------------------------------------------
*/

export async function getOptimizationAnalytics(filters = {}) {

    const analytics =

        await optimizationService.getOptimizationDashboard(

            filters.siteId

        );

    emitAnalytics(

        filters.siteId,

        {

            module: "optimization",

            analytics

        }

    );

    return analytics;

}

/*
|--------------------------------------------------------------------------
| Forecast Analytics
|--------------------------------------------------------------------------
*/

export async function getForecastAnalytics(filters = {}) {

    const analytics =

        await forecastService.getDashboardForecast(

            filters

        );

    emitAnalytics(

        filters.siteId,

        {

            module: "forecast",

            analytics

        }

    );

    return analytics;

}

/*
|--------------------------------------------------------------------------
| Executive Analytics
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Executive Analytics
|--------------------------------------------------------------------------
*/

export async function getExecutiveAnalytics(filters = {}) {

    const dashboard = await getDashboardAnalytics(filters);

    const executive = {

        generatedAt: new Date(),

        totalSites:

            dashboard.statistics?.totalSites ?? 0,

        activeSites:

            dashboard.statistics?.activeSites ?? 0,

        activeAlarms:

            dashboard.statistics?.activeAlarms ?? 0,

        renewableContribution:

            dashboard.statistics?.renewablePercentage ?? 0,

        reliability:

            dashboard.reliability,

        insights:

            dashboard.insights

    };

    /*
    |--------------------------------------------------------------------------
    | Emit Executive Analytics
    |--------------------------------------------------------------------------
    */

    emitAnalytics(

        filters.siteId,

        {

            module: "executive",

            executive

        }

    );

    return executive;

}

export default {

    getDashboardAnalytics,

    getEnergyAnalytics,

    getBatteryAnalytics,

    getSolarAnalytics,

    getGeneratorAnalytics,

    getGridAnalytics,

    getReliabilityAnalytics,

    getOptimizationAnalytics,

    getForecastAnalytics,

    getExecutiveAnalytics

};