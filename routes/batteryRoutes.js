import { Router } from "express";

import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

import {
    createBattery,
    getBatteries,
    getBatteryById,
    updateBattery,
    deleteBattery,
    getBatteryBySite
} from "../controllers/batteryController.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Site Batteries
|--------------------------------------------------------------------------
*/

router.get(
    "/site/:siteId",
    authenticate,
    getBatteryBySite
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
    createBattery
);

router.get(
    "/",
    authenticate,
    getBatteries
);

router.get(
    "/:id",
    authenticate,
    getBatteryById
);

router.put(
    "/:id",
    authenticate,
    authorize("Administrator", "Engineer"),
    updateBattery
);

router.delete(
    "/:id",
    authenticate,
    authorize("Administrator"),
    deleteBattery
);

export default router;