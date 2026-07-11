import { Router } from "express";

import authenticate from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

import {

    createOptimization,

    getOptimizations,

    getOptimization,

    updateOptimization,

    deleteOptimization

} from "../controllers/optimizationResultController.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Optimization
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authenticate,
    authorize("Administrator", "Engineer"),
    createOptimization
);

router.get(
    "/",
    authenticate,
    getOptimizations
);

router.get(
    "/:id",
    authenticate,
    getOptimization
);

router.post(
    "/:id/run",
    authenticate,
    authorize("Administrator", "Engineer"),
    updateOptimization
);

router.delete(
    "/:id",
    authenticate,
    authorize("Administrator"),
    deleteOptimization
);

export default router;