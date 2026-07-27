import { Router } from "express";

import authenticate from "../middlewares/auth.js";

import optimizationResultController from "../controllers/optimizationResultController.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Optimization History
|--------------------------------------------------------------------------
*/

router.get(

    "/",

    authenticate,

    optimizationResultController.getOptimizationHistory

);

/*
|--------------------------------------------------------------------------
| Get Optimization
|--------------------------------------------------------------------------
*/

router.get(

    "/:id",

    authenticate,

    optimizationResultController.getOptimization

);

/*
|--------------------------------------------------------------------------
| Latest Optimization
|--------------------------------------------------------------------------
*/

router.get(

    "/latest/:siteId",

    authenticate,

    optimizationResultController.getLatestOptimization

);

/*
|--------------------------------------------------------------------------
| Dispatch Schedule
|--------------------------------------------------------------------------
*/

router.get(

    "/:id/dispatch",

    authenticate,

    optimizationResultController.getDispatchSchedule

);

/*
|--------------------------------------------------------------------------
| Energy Summary
|--------------------------------------------------------------------------
*/

router.get(

    "/:id/energy",

    authenticate,

    optimizationResultController.getEnergySummary

);

/*
|--------------------------------------------------------------------------
| Economics
|--------------------------------------------------------------------------
*/

router.get(

    "/:id/economics",

    authenticate,

    optimizationResultController.getEconomics

);

/*
|--------------------------------------------------------------------------
| Emissions
|--------------------------------------------------------------------------
*/

router.get(

    "/:id/emissions",

    authenticate,

    optimizationResultController.getEmissions

);

/*
|--------------------------------------------------------------------------
| Reliability
|--------------------------------------------------------------------------
*/

router.get(

    "/:id/reliability",

    authenticate,

    optimizationResultController.getReliability

);

/*
|--------------------------------------------------------------------------
| Solver Information
|--------------------------------------------------------------------------
*/

router.get(

    "/:id/solver",

    authenticate,

    optimizationResultController.getSolver

);

export default router;