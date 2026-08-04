import { Router } from "express";

import optimizationController from "../controllers/optimizationController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {
    optimizationQueryValidator,
    optimizationIdValidator
} from "../validators/optimizationValidator.js";

const router = Router();

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Latest Optimization
|--------------------------------------------------------------------------
*/

router.get(
    "/latest/:siteId",
    optimizationController.getLatestOptimization
);

/*
|--------------------------------------------------------------------------
| History
|--------------------------------------------------------------------------
*/

router.get(
    "/history",
    validate({
        query: optimizationQueryValidator
    }),
    optimizationController.getOptimizationHistory
);

/*
|--------------------------------------------------------------------------
| Optimization Details
|--------------------------------------------------------------------------
*/

router.get(
    "/:id",
    validate({
        params: optimizationIdValidator
    }),
    optimizationController.getOptimization
);

/*
|--------------------------------------------------------------------------
| Dispatch Schedule
|--------------------------------------------------------------------------
*/

router.get(
    "/:id/dispatch",
    optimizationController.getDispatchSchedule
);

/*
|--------------------------------------------------------------------------
| Energy Summary
|--------------------------------------------------------------------------
*/

router.get(
    "/:id/energy",
    optimizationController.getEnergySummary
);

/*
|--------------------------------------------------------------------------
| Economics
|--------------------------------------------------------------------------
*/

router.get(
    "/:id/economics",
    optimizationController.getEconomics
);

/*
|--------------------------------------------------------------------------
| Emissions
|--------------------------------------------------------------------------
*/

router.get(
    "/:id/emissions",
    optimizationController.getEmissions
);

/*
|--------------------------------------------------------------------------
| Reliability
|--------------------------------------------------------------------------
*/

router.get(
    "/:id/reliability",
    optimizationController.getReliability
);

/*
|--------------------------------------------------------------------------
| Solver
|--------------------------------------------------------------------------
*/

router.get(
    "/:id/solver",
    optimizationController.getSolver
);

export default router;