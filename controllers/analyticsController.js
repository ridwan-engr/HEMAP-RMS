import * as statisticsService from "../services/analytics/statisticsService.js";
import * as forecastService from "../services/analytics/forecastService.js";
import * as optimizationService from "../services/analytics/optimizationService.js";
import * as reliabilityService from "../services/analytics/reliabilityService.js";
import * as insightsService from "../services/analytics/insightsService.js";
import * as reportService from "../services/reports/reportService.js";
/*
|--------------------------------------------------------------------------
| Analytics Dashboard
|--------------------------------------------------------------------------
*/

export async function analyticsDashboard(req, res) {

    try {

        const dashboard =
            await statisticsService.getAnalyticsDashboard({

                siteId: req.body.siteId,

                region: req.body.region,

                start: req.body.start,

                end: req.body.end

            });

        return res.status(200).json({

            success: true,

            data: dashboard

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

/*
|--------------------------------------------------------------------------
| Energy Statistics
|--------------------------------------------------------------------------
*/

export async function energyStatistics(req, res) {

    try {

        const statistics =
            await statisticsService.getEnergyStatistics(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: statistics

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Power Flow Summary
|--------------------------------------------------------------------------
*/

export async function powerFlowSummary(req, res) {

    try {

        const summary =
            await statisticsService.getPowerFlowSummary(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: summary

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Renewable Energy Penetration
|--------------------------------------------------------------------------
*/

export async function renewablePenetration(req, res) {

    try {

        const penetration =
            await statisticsService.getRenewablePenetration(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: penetration

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Carbon Savings
|--------------------------------------------------------------------------
*/

export async function carbonSavings(req, res) {

    try {

        const carbon =
            await statisticsService.getCarbonSavings(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: carbon

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Fuel Savings
|--------------------------------------------------------------------------
*/

export async function fuelSavings(req, res) {

    try {

        const savings =
            await statisticsService.getFuelSavings(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: savings

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| System Efficiency
|--------------------------------------------------------------------------
*/

export async function systemEfficiency(req, res) {

    try {

        const efficiency =
            await statisticsService.getSystemEfficiency(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: efficiency

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Energy Forecast
|--------------------------------------------------------------------------
*/

export async function energyForecast(req, res) {

    try {

        const forecast =
            await forecastService.generateEnergyForecast({

                siteId: req.body.siteId,

                horizon: req.body.horizon || "24h",

                interval: req.body.interval || "1h"

            });

        return res.status(200).json({

            success: true,

            data: forecast

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Solar Forecast
|--------------------------------------------------------------------------
*/

export async function solarForecast(req, res) {

    try {

        const forecast =
            await forecastService.generateSolarForecast(req.body);

        return res.status(200).json({

            success: true,

            data: forecast

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Load Forecast
|--------------------------------------------------------------------------
*/

export async function loadForecast(req, res) {

    try {

        const forecast =
            await forecastService.generateLoadForecast(req.body);

        return res.status(200).json({

            success: true,

            data: forecast

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Battery Forecast
|--------------------------------------------------------------------------
*/

export async function batteryForecast(req, res) {

    try {

        const forecast =
            await forecastService.generateBatteryForecast(req.body);

        return res.status(200).json({

            success: true,

            data: forecast

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Weather Forecast
|--------------------------------------------------------------------------
*/

export async function weatherForecast(req, res) {

    try {

        const forecast =
            await forecastService.generateWeatherForecast(req.body);

        return res.status(200).json({

            success: true,

            data: forecast

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Energy Optimization
|--------------------------------------------------------------------------
*/

export async function optimizeEnergy(req, res) {

    try {

        const result =
            await optimizationService.optimizeEnergySystem(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Generator Dispatch Optimization
|--------------------------------------------------------------------------
*/

export async function optimizeGeneratorDispatch(req, res) {

    try {

        const dispatch =
            await optimizationService.optimizeGeneratorDispatch(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: dispatch

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Battery Optimization
|--------------------------------------------------------------------------
*/

export async function optimizeBattery(req, res) {

    try {

        const optimization =
            await optimizationService.optimizeBatteryOperation(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: optimization

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Grid Optimization
|--------------------------------------------------------------------------
*/

export async function optimizeGrid(req, res) {

    try {

        const optimization =
            await optimizationService.optimizeGridUsage(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: optimization

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Hybrid Dispatch Optimization
|--------------------------------------------------------------------------
*/

export async function optimizeHybridDispatch(req, res) {

    try {

        const result =
            await optimizationService.optimizeHybridDispatch(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Reliability Dashboard
|--------------------------------------------------------------------------
*/

export async function reliabilityDashboard(req, res) {

    try {

        const dashboard =
            await reliabilityService.getReliabilityDashboard(req.body);

        return res.status(200).json({
            success: true,
            data: dashboard
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Reliability Indices
|--------------------------------------------------------------------------
*/

export async function reliabilityIndices(req, res) {

    try {

        const indices =
            await reliabilityService.calculateReliabilityIndices(req.body);

        return res.status(200).json({
            success: true,
            data: indices
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Battery Health
|--------------------------------------------------------------------------
*/

export async function batteryHealth(req, res) {

    try {

        const report =
            await statisticsService.getBatteryHealth(req.body);

        return res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Solar Performance
|--------------------------------------------------------------------------
*/

export async function solarPerformance(req, res) {

    try {

        const report =
            await statisticsService.getSolarPerformance(req.body);

        return res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Generator Efficiency
|--------------------------------------------------------------------------
*/

export async function generatorEfficiency(req, res) {

    try {

        const report =
            await statisticsService.getGeneratorEfficiency(req.body);

        return res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Power Quality Analytics
|--------------------------------------------------------------------------
*/

export async function powerQuality(req, res) {

    try {

        const report =
            await statisticsService.getPowerQuality(req.body);

        return res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Financial Analytics
|--------------------------------------------------------------------------
*/

export async function financialAnalytics(req, res) {

    try {

        const report =
            await statisticsService.getFinancialAnalytics(req.body);

        return res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Maintenance Analytics
|--------------------------------------------------------------------------
*/

export async function maintenanceAnalytics(req, res) {

    try {

        const report =
            await statisticsService.getMaintenanceAnalytics(req.body);

        return res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| AI Operational Insights
|--------------------------------------------------------------------------
*/

export async function operationalInsights(req, res) {

    try {

        const insights =
            await insightsService.generateOperationalInsights(req.body);

        return res.status(200).json({
            success: true,
            data: insights
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Asset Risk Assessment
|--------------------------------------------------------------------------
*/

export async function assetRiskAssessment(req, res) {

    try {

        const assessment =
            await reliabilityService.assessAssetRisk(req.body);

        return res.status(200).json({
            success: true,
            data: assessment
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Generate Analytics Report
|--------------------------------------------------------------------------
*/

export async function generateReport(req, res) {

    try {

        const report =
            await reportService.generateAnalyticsReport(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: report

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Export Report
|--------------------------------------------------------------------------
*/

export async function exportReport(req, res) {

    try {

        const file =
            await reportService.exportReport(

                req.body.reportId,

                req.body.format || "pdf"

            );

        return res.status(200).json({

            success: true,

            data: file

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Scheduled Analytics
|--------------------------------------------------------------------------
*/

export async function scheduledAnalytics(req, res) {

    try {

        const result =
            await reportService.scheduleAnalytics(

                req.body

            );

        return res.status(201).json({

            success: true,

            data: result

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Benchmark Comparison
|--------------------------------------------------------------------------
*/

export async function benchmarkComparison(req, res) {

    try {

        const comparison =
            await statisticsService.compareBenchmarks(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: comparison

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Portfolio Analytics
|--------------------------------------------------------------------------
*/

export async function portfolioAnalytics(req, res) {

    try {

        const portfolio =
            await statisticsService.getPortfolioAnalytics(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: portfolio

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Executive Dashboard
|--------------------------------------------------------------------------
*/

export async function executiveDashboard(req, res) {

    try {

        const dashboard =
            await statisticsService.getExecutiveDashboard(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: dashboard

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

export const overallKPIs = async (req, res, next) => {

    try {

        // TODO: Replace with actual KPI calculations

        res.json({

            success: true,

            data: {

                totalSites: 0,

                activeSites: 0,

                renewableEnergy: 0,

                batterySOC: 0,

                gridAvailability: 0

            }

        });

    } catch (error) {

        next(error);

    }

};
export default {

    // Dashboard
    analyticsDashboard,

    overallKPIs,

    //overallKPIs,

    energyStatistics,

    powerFlowSummary,

    renewablePenetration,

    carbonSavings,

    fuelSavings,

    systemEfficiency,

    // Forecasting

    energyForecast,

    solarForecast,

    loadForecast,

    batteryForecast,

    weatherForecast,

    // Optimization

    optimizeEnergy,

    optimizeGeneratorDispatch,

    optimizeBattery,

    optimizeGrid,

    optimizeHybridDispatch,

    // Reliability

    reliabilityDashboard,

    reliabilityIndices,

    batteryHealth,

    solarPerformance,

    generatorEfficiency,

    powerQuality,

    financialAnalytics,

    maintenanceAnalytics,

    operationalInsights,

    assetRiskAssessment,

    // Reports

    generateReport,

    exportReport,

    scheduledAnalytics,

    benchmarkComparison,

    portfolioAnalytics,

    executiveDashboard

};