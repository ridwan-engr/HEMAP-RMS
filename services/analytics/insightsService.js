import * as statisticsService from "./statisticsService.js";
import * as reliabilityService from "./reliabilityService.js";
import * as forecastService from "./forecastService.js";

/**
 * Generate operational insights for a site.
 */
export async function generateOperationalInsights(options = {}) {

    const {
        siteId,
        start,
        end
    } = options;

    const [
        kpis,
        battery,
        solar,
        generator,
        reliability,
        forecast
    ] = await Promise.all([

        statisticsService.getSiteKPIs(siteId),

        statisticsService.getBatteryHealth({
            siteId,
            start,
            end
        }),

        statisticsService.getSolarPerformance({
            siteId,
            start,
            end
        }),

        statisticsService.getGeneratorEfficiency({
            siteId,
            start,
            end
        }),

        reliabilityService.calculateReliabilityIndices({
            siteId,
            start,
            end
        }),

        forecastService.generateEnergyForecast({
            siteId,
            horizon: "24h"
        })

    ]);

    const recommendations = [];

    /*
    |--------------------------------------------------------------------------
    | Battery
    |--------------------------------------------------------------------------
    */

    if (battery.stateOfHealth < 80) {

        recommendations.push({

            category: "Battery",

            severity: "high",

            title: "Battery replacement recommended",

            message:
                `Battery SOH is ${battery.stateOfHealth}% which is below the recommended threshold.`

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Solar
    |--------------------------------------------------------------------------
    */

    if (solar.performanceRatio < 0.75) {

        recommendations.push({

            category: "Solar",

            severity: "medium",

            title: "Inspect PV array",

            message:
                "Solar performance ratio is below expected values. Check module cleanliness and shading."

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Generator
    |--------------------------------------------------------------------------
    */

    if (generator.fuelEfficiency < generator.targetFuelEfficiency) {

        recommendations.push({

            category: "Generator",

            severity: "medium",

            title: "Generator efficiency reduced",

            message:
                "Generator fuel consumption is higher than expected."

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Reliability
    |--------------------------------------------------------------------------
    */

    if (reliability.saidi > reliability.targetSaidi) {

        recommendations.push({

            category: "Reliability",

            severity: "high",

            title: "Improve system availability",

            message:
                "SAIDI exceeds configured target."

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Forecast
    |--------------------------------------------------------------------------
    */

    if (forecast.expectedDeficit > 0) {

        recommendations.push({

            category: "Forecast",

            severity: "medium",

            title: "Energy deficit expected",

            message:
                `Expected energy deficit: ${forecast.expectedDeficit.toFixed(2)} kWh`

        });

    }

    return {

        generatedAt: new Date(),

        siteId,

        summary: {

            kpis,

            battery,

            solar,

            generator,

            reliability

        },

        recommendations

    };

}

/**
 * Executive summary.
 */
export async function generateExecutiveSummary(options = {}) {

    const insights =
        await generateOperationalInsights(options);

    return {

        generatedAt: insights.generatedAt,

        siteId: insights.siteId,

        recommendationCount:
            insights.recommendations.length,

        criticalIssues:

            insights.recommendations.filter(

                r => r.severity === "high"

            ),

        recommendations:

            insights.recommendations

    };

}

/**
 * Maintenance recommendations.
 */
export async function maintenanceRecommendations(options = {}) {

    const insights =
        await generateOperationalInsights(options);

    return insights.recommendations.filter(

        recommendation =>

            recommendation.category === "Battery" ||

            recommendation.category === "Generator" ||

            recommendation.category === "Solar"

    );

}

/**
 * Reliability recommendations.
 */
export async function reliabilityRecommendations(options = {}) {

    const insights =
        await generateOperationalInsights(options);

    return insights.recommendations.filter(

        recommendation =>

            recommendation.category === "Reliability"

    );

}

/**
 * Energy optimization recommendations.
 */
export async function optimizationRecommendations(options = {}) {

    const insights =
        await generateOperationalInsights(options);

    return insights.recommendations.filter(

        recommendation =>

            recommendation.category === "Forecast"

    );

}

/*
|--------------------------------------------------------------------------
| Dashboard Wrapper
|--------------------------------------------------------------------------
*/

export async function getDashboardInsights(filters = {}) {

    return generateExecutiveSummary(filters);

}

export default {

    generateOperationalInsights,

    generateExecutiveSummary,

    maintenanceRecommendations,

    reliabilityRecommendations,

    optimizationRecommendations,

    getDashboardInsights

};