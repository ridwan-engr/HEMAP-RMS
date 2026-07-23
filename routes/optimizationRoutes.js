import { Router } from "express";

import optimizationController from "../controllers/optimizationController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {

    createOptimizationSchema,

    refreshOptimizationSchema,

    historySchema,

    exportOptimizationSchema,

    cancelOptimizationSchema

} from "../validators/optimizationValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Optimization
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Create Optimization
|--------------------------------------------------------------------------
*/

router.post(

    "/",

    authenticate,

    authorize(

        "ADMIN",

        "ENGINEER",

        "SUPERVISOR"

    ),

    validate({

        body: createOptimizationSchema

    }),

    optimizationController.createOptimization

);

/*
|--------------------------------------------------------------------------
| Refresh Optimization
|--------------------------------------------------------------------------
*/

router.post(

    "/refresh",

    authenticate,

    authorize(

        "ADMIN",

        "ENGINEER"

    ),

    validate({

        body: refreshOptimizationSchema

    }),

    optimizationController.createOptimization

);

/*
|--------------------------------------------------------------------------
| Optimization History
|--------------------------------------------------------------------------
*/

router.get(

    "/history",

    authenticate,

    validate({

        query: historySchema

    }),

    optimizationController.getOptimizationHistory

);

/*
|--------------------------------------------------------------------------
| Get Optimization By ID
|--------------------------------------------------------------------------
*/

router.get(

    "/:id",

    authenticate,

    optimizationController.getOptimization

);

/*
|--------------------------------------------------------------------------
| Cancel Optimization
|--------------------------------------------------------------------------
*/

router.patch(

    "/:id/cancel",

    authenticate,

    authorize(

        "ADMIN",

        "ENGINEER"

    ),

    validate({

        params: cancelOptimizationSchema

    }),

    optimizationController.cancelOptimization

);

/*
|--------------------------------------------------------------------------
| Export Optimization
|--------------------------------------------------------------------------
*/

router.post(

    "/:id/export",

    authenticate,

    validate({

        body: exportOptimizationSchema

    }),

    optimizationController.exportOptimization

);

/*
|--------------------------------------------------------------------------
| Delete Optimization
|--------------------------------------------------------------------------
*/

router.delete(

    "/:id",

    authenticate,

    authorize("ADMIN"),

    optimizationController.deleteOptimization

);

export default router;