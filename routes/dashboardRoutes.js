import { Router } from "express";

import dashboardController from "../controllers/dashboardController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {

    dashboardQuerySchema,

    refreshDashboardSchema

} from "../validators/dashboardValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Dashboard
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

/*
|--------------------------------------------------------------------------
| Executive Dashboard
|--------------------------------------------------------------------------
*/

router.get(

    "/executive",

    authenticate,

    authorize("ADMIN"),

    validate({

        query: dashboardQuerySchema

    }),

    dashboardController.getExecutiveDashboard

);

/*
|--------------------------------------------------------------------------
| Dashboard Cards
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

/*
|--------------------------------------------------------------------------
| KPIs
|--------------------------------------------------------------------------
*/

router.get(

    "/kpis",

    authenticate,

    validate({

        query: dashboardQuerySchema

    }),

    dashboardController.getKPIs

);

/*
|--------------------------------------------------------------------------
| Map
|--------------------------------------------------------------------------
*/

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
| Optimization Summary
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
| Refresh Dashboard
|--------------------------------------------------------------------------
*/

router.post(

    "/refresh",

    authenticate,

    authorize("ADMIN"),

    validate({

        body: refreshDashboardSchema

    }),

    dashboardController.refreshDashboard

);

router.get(
    "/charts",
    dashboardController.getDashboardCharts
);

export default router;