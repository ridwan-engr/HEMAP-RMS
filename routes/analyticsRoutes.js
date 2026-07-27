import { Router } from "express";

import analyticsController from "../controllers/analyticsController.js";

import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { validate } from "../middlewares/validate.js";

import {

    dashboardQuerySchema,

    statisticsQuerySchema,

    forecastSchema,

    optimizationSchema,

    reliabilitySchema,

    insightsSchema

} from "../validators/analyticsValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
    "/dashboard",
    authenticate,
    validate({ query: dashboardQuerySchema }),
    analyticsController.analyticsDashboard
);

router.get(
    "/kpis",
    authenticate,
    analyticsController.overallKPIs
);

router.get(
    "/energy",
    authenticate,
    validate({ query: statisticsQuerySchema }),
    analyticsController.energyStatistics
);

router.get(
    "/power-flow",
    authenticate,
    analyticsController.powerFlowSummary
);

router.get(
    "/renewable-penetration",
    authenticate,
    analyticsController.renewablePenetration
);

router.get(
    "/carbon-savings",
    authenticate,
    analyticsController.carbonSavings
);

router.get(
    "/fuel-savings",
    authenticate,
    analyticsController.fuelSavings
);

router.get(
    "/efficiency",
    authenticate,
    analyticsController.systemEfficiency
);

/*
|--------------------------------------------------------------------------
| Forecasting
|--------------------------------------------------------------------------
*/

router.post(
    "/forecast/energy",
    authenticate,
    validate({ body: forecastSchema }),
    analyticsController.energyForecast
);

router.post(
    "/forecast/solar",
    authenticate,
    validate({ body: forecastSchema }),
    analyticsController.solarForecast
);

router.post(
    "/forecast/load",
    authenticate,
    validate({ body: forecastSchema }),
    analyticsController.loadForecast
);

router.post(
    "/forecast/battery",
    authenticate,
    validate({ body: forecastSchema }),
    analyticsController.batteryForecast
);

router.post(
    "/forecast/weather",
    authenticate,
    validate({ body: forecastSchema }),
    analyticsController.weatherForecast
);

/*
|--------------------------------------------------------------------------
| Optimization
|--------------------------------------------------------------------------
*/

router.post(
    "/optimization/energy",
    authenticate,
    authorize("ADMIN"),
    validate({ body: optimizationSchema }),
    analyticsController.optimizeEnergy
);

router.post(
    "/optimization/generator",
    authenticate,
    authorize("ADMIN"),
    validate({ body: optimizationSchema }),
    analyticsController.optimizeGeneratorDispatch
);

router.post(
    "/optimization/battery",
    authenticate,
    authorize("ADMIN"),
    validate({ body: optimizationSchema }),
    analyticsController.optimizeBattery
);

router.post(
    "/optimization/grid",
    authenticate,
    authorize("ADMIN"),
    validate({ body: optimizationSchema }),
    analyticsController.optimizeGrid
);

router.post(
    "/optimization/hybrid",
    authenticate,
    authorize("ADMIN"),
    validate({ body: optimizationSchema }),
    analyticsController.optimizeHybridDispatch
);

/*
|--------------------------------------------------------------------------
| Reliability & Asset Analytics
|--------------------------------------------------------------------------
*/

router.get(
    "/reliability/dashboard",
    authenticate,
    validate({ query: reliabilitySchema }),
    analyticsController.reliabilityDashboard
);

router.get(
    "/reliability/indices",
    authenticate,
    validate({ query: reliabilitySchema }),
    analyticsController.reliabilityIndices
);

router.get(
    "/battery-health",
    authenticate,
    analyticsController.batteryHealth
);

router.get(
    "/solar-performance",
    authenticate,
    analyticsController.solarPerformance
);

router.get(
    "/generator-efficiency",
    authenticate,
    analyticsController.generatorEfficiency
);

router.get(
    "/power-quality",
    authenticate,
    analyticsController.powerQuality
);

router.get(
    "/financial",
    authenticate,
    analyticsController.financialAnalytics
);

router.get(
    "/maintenance",
    authenticate,
    analyticsController.maintenanceAnalytics
);

router.get(
    "/insights",
    authenticate,
    validate({ query: insightsSchema }),
    analyticsController.operationalInsights
);

router.get(
    "/asset-risk",
    authenticate,
    analyticsController.assetRiskAssessment
);

/*
|--------------------------------------------------------------------------
| Reports
|--------------------------------------------------------------------------
*/

router.post(
    "/reports/generate",
    authenticate,
    analyticsController.generateReport
);

router.get(
    "/reports/export",
    authenticate,
    analyticsController.exportReport
);

router.get(
    "/reports/scheduled",
    authenticate,
    analyticsController.scheduledAnalytics
);

router.get(
    "/benchmark",
    authenticate,
    analyticsController.benchmarkComparison
);

router.get(
    "/portfolio",
    authenticate,
    analyticsController.portfolioAnalytics
);

router.get(
    "/executive-dashboard",
    authenticate,
    analyticsController.executiveDashboard
);

router.get(
    "/dashboard",
    authenticate,
    analyticsController.analyticsDashboard
);

/*router.post(
    "/refresh",
    authenticate,
    authorize("ADMIN"),
    analyticsController.refreshAnalytics
);

router.get(
    "/history/:site",
    authenticate,
    analyticsController.analyticsHistory
);*/

export default router;