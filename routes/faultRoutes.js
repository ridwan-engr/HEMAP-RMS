import { Router } from "express";

import faultController from "../controllers/faultController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {
    faultQueryValidator,
    faultIdValidator,
    createFaultValidator,
    updateFaultValidator,
    resolveFaultValidator
} from "../validators/faultValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Get Faults
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    validate({
        query: faultQueryValidator
    }),
    faultController.getFaults
);

/*
|--------------------------------------------------------------------------
| Get Fault By ID
|--------------------------------------------------------------------------
*/

router.get(
    "/:faultId",
    validate({
        params: faultIdValidator
    }),
    faultController.getFaultById
);

/*
|--------------------------------------------------------------------------
| Create Fault
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authorize(
        "ADMIN",
        "SUPERVISOR",
        "ENGINEER"
    ),
    validate({
        body: createFaultValidator
    }),
    faultController.createFault
);

/*
|--------------------------------------------------------------------------
| Update Fault
|--------------------------------------------------------------------------
*/

router.put(
    "/:faultId",
    authorize(
        "ADMIN",
        "SUPERVISOR",
        "ENGINEER"
    ),
    validate({
        params: faultIdValidator,
        body: updateFaultValidator
    }),
    faultController.updateFault
);

/*
|--------------------------------------------------------------------------
| Resolve Fault
|--------------------------------------------------------------------------
*/

router.patch(
    "/:faultId/resolve",
    authorize(
        "ADMIN",
        "SUPERVISOR",
        "ENGINEER"
    ),
    validate({
        params: faultIdValidator,
        body: resolveFaultValidator
    }),
    faultController.resolveFault
);

/*
|--------------------------------------------------------------------------
| Delete Fault
|--------------------------------------------------------------------------
*/

router.delete(
    "/:faultId",
    authorize("ADMIN"),
    validate({
        params: faultIdValidator
    }),
    faultController.deleteFault
);

export default router;