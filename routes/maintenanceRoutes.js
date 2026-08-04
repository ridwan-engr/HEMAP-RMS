import { Router } from "express";

import maintenanceController from "../controllers/maintenanceController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {
    maintenanceScheduleValidator,
    maintenanceHistoryValidator,
    maintenanceIdValidator,
    createMaintenanceValidator,
    updateMaintenanceValidator,
    completeMaintenanceValidator
} from "../validators/maintenanceValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Maintenance Schedule
|--------------------------------------------------------------------------
*/

router.get(
    "/schedule",
    validate({
        query: maintenanceScheduleValidator
    }),
    maintenanceController.getMaintenanceSchedule
);

/*
|--------------------------------------------------------------------------
| Maintenance History
|--------------------------------------------------------------------------
*/

router.get(
    "/history",
    validate({
        query: maintenanceHistoryValidator
    }),
    maintenanceController.getMaintenanceHistory
);

/*
|--------------------------------------------------------------------------
| Maintenance Details
|--------------------------------------------------------------------------
*/

router.get(
    "/:maintenanceId",
    validate({
        params: maintenanceIdValidator
    }),
    maintenanceController.getMaintenanceById
);

/*
|--------------------------------------------------------------------------
| Create Maintenance
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
        body: createMaintenanceValidator
    }),
    maintenanceController.createMaintenance
);

/*
|--------------------------------------------------------------------------
| Update Maintenance
|--------------------------------------------------------------------------
*/

router.put(
    "/:maintenanceId",
    authorize(
        "ADMIN",
        "SUPERVISOR",
        "ENGINEER"
    ),
    validate({
        params: maintenanceIdValidator,
        body: updateMaintenanceValidator
    }),
    maintenanceController.updateMaintenance
);

/*
|--------------------------------------------------------------------------
| Complete Maintenance
|--------------------------------------------------------------------------
*/

router.patch(
    "/:maintenanceId/complete",
    authorize(
        "ADMIN",
        "SUPERVISOR",
        "ENGINEER"
    ),
    validate({
        params: maintenanceIdValidator,
        body: completeMaintenanceValidator
    }),
    maintenanceController.completeMaintenance
);

/*
|--------------------------------------------------------------------------
| Delete Maintenance
|--------------------------------------------------------------------------
*/

router.delete(
    "/:maintenanceId",
    authorize("ADMIN"),
    validate({
        params: maintenanceIdValidator
    }),
    maintenanceController.deleteMaintenance
);

export default router;