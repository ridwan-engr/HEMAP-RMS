import * as statisticsService from "./statisticsService.js";
import * as reliabilityService from "./reliabilityService.js";
import * as forecastService from "./forecastService.js";
import {

    emitAnalytics,

    emitNotification

} from "../../websocket/eventEmitters.js";

/**
 * Generate operational insights for a site.
 */
export async function generateInsights(options = {}) {

    const {
        siteId,
        start,
        end
    } = options;

    const filters = {

        siteId,
        start,
        end

    };

    const [

        kpis,
        battery,
        solar,
        generator,
        reliability,
        forecast

    ] = await Promise.all([

        statisticsService.getKPIs(filters),

        statisticsService.getBatteryStatistics(filters),

        statisticsService.getSolarStatistics(filters),

        statisticsService.getGeneratorStatistics(filters),

        reliabilityService.getReliabilityMetrics(filters),

        forecastService.getForecastDashboard(
            siteId
        )

    ]);

    const recommendations = [];

    /*
    |--------------------------------------------------------------------------
    | Battery
    |--------------------------------------------------------------------------
    */

    if ((battery.health ?? 100) < 80) {

        recommendations.push({

            category: "Battery",

            severity: "high",

            title: "Battery replacement recommended",

            message:
                `Battery SOH is ${battery.health}% which is below the recommended threshold.`

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Solar
    |--------------------------------------------------------------------------
    */

    if ((solar.efficiency ?? 1) < 0.75) {

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

    if ((generator.fuelLevel ?? 100) < 20) {

        recommendations.push({

            category: "Generator",

            severity: "medium",

            title: "Generator fuel level is low",

            message:
                `Generator fuel level is only ${generator.fuelLevel}%`
        });

    }

    /*
    |--------------------------------------------------------------------------
    | Reliability
    |--------------------------------------------------------------------------
    */

    const TARGET_SAIDI = 60;

    if ((reliability.saidi ?? 0) > TARGET_SAIDI) {

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

    if ((forecast?.expectedDeficit ?? 0) > 0) {

        recommendations.push({

            category: "Forecast",

            severity: "medium",

            title: "Energy deficit expected",

            message:
                `Expected energy deficit: ${(forecast?.expectedDeficit ?? 0).toFixed(2)} kWh`

        });

    }

    const insights = {

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

    /*
|--------------------------------------------------------------------------
| Realtime Analytics Update
|--------------------------------------------------------------------------
*/

    emitAnalytics(

        siteId,

        {

            module: "insights",

            generatedAt: insights.generatedAt,

            summary: insights.summary,

            recommendations: insights.recommendations

        }

    );

    /*
|--------------------------------------------------------------------------
| Notify Users
|--------------------------------------------------------------------------
*/

    for (const recommendation of insights.recommendations) {

        if (

            recommendation.severity === "high"

        ) {

            emitNotification(

                siteId,

                {

                    type: "INSIGHT",

                    priority: "HIGH",

                    title:

                        recommendation.title,

                    message:

                        recommendation.message,

                    category:

                        recommendation.category,

                    timestamp:

                        new Date()

                }

            );

        }

    }

    return insights;

    /*
    |--------------------------------------------------------------------------
    | Realtime Analytics Update
    |--------------------------------------------------------------------------
    */

    emitAnalytics(

        siteId,

        {

            module: "insights",

            generatedAt: insights.generatedAt,

            summary: insights.summary,

            recommendations: insights.recommendations

        }

    );

}

/**
 * Executive summary.
 */
export async function generateExecutiveSummary(options = {}) {

    const insights =
        await generateInsights(options);

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
        await generateInsights(options);

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
        await generateInsights(options);

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
        await generateInsights(options);

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

    generateInsights,

    generateExecutiveSummary,

    maintenanceRecommendations,

    reliabilityRecommendations,

    optimizationRecommendations,

    getDashboardInsights

};