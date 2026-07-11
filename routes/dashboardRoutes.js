import { Router } from "express";

import dashboardController from "../controllers/dashboardController.js";

import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { validate } from "../middlewares/validate.js";

import {

    dashboardQuerySchema,
    refreshDashboardSchema

} from "../validators/dashboardValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Main Dashboard
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    authenticate,
    validate({
        query: dashboardQuerySchema
    }),
    dashboardController.getDashboard
);

router.get(
    "/executive",
    authenticate,
    authorize("admin"),
    validate({
        query: dashboardQuerySchema
    }),
    dashboardController.getExecutiveDashboard
);

/*
|--------------------------------------------------------------------------
| Dashboard Components
|--------------------------------------------------------------------------
*/

router.get(
    "/cards",
    authenticate,
    validate({
        query: dashboardQuerySchema
    }),
    dashboardController.getDashboardCards
);

router.get(
    "/kpis",
    authenticate,
    validate({
        query: dashboardQuerySchema
    }),
    dashboardController.getKPIs
);

router.get(
    "/map",
    authenticate,
    validate({
        query: dashboardQuerySchema
    }),
    dashboardController.getMap
);

/*
|--------------------------------------------------------------------------
| Optimization
|--------------------------------------------------------------------------
*/

router.get(
    "/optimization",
    authenticate,
    validate({
        query: dashboardQuerySchema
    }),
    dashboardController.getOptimizationSummary
);

/*
|--------------------------------------------------------------------------
| Refresh
|--------------------------------------------------------------------------
*/

router.post(
    "/refresh",
    authenticate,
    authorize("admin"),
    validate({
        body: refreshDashboardSchema
    }),
    dashboardController.refreshDashboard
);

export default router;