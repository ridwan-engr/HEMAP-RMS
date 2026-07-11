import { Router } from "express";

import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

import {
    createMaintenance,
    getMaintenanceRecords,
    getMaintenanceById,
    getMaintenanceBySite,
    updateMaintenance,
    completeMaintenance,
    deleteMaintenance
} from "../controllers/maintenanceController.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Site Maintenance
|--------------------------------------------------------------------------
*/

router.get(
    "/site/:siteId",
    authenticate,
    getMaintenanceBySite
);

/*
|--------------------------------------------------------------------------
| CRUD
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authenticate,
    authorize("Administrator", "Engineer"),
    createMaintenance
);

router.get(
    "/",
    authenticate,
    getMaintenanceRecords
);

router.get(
    "/:id",
    authenticate,
    getMaintenanceById
);

router.put(
    "/:id",
    authenticate,
    authorize("Administrator", "Engineer"),
    updateMaintenance
);

router.patch(
    "/:id/complete",
    authenticate,
    authorize("Administrator", "Engineer"),
    completeMaintenance
);

router.delete(
    "/:id",
    authenticate,
    authorize("Administrator"),
    deleteMaintenance
);

export default router;