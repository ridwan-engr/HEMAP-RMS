import { Router } from "express";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";

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
| Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Site Batteries
|--------------------------------------------------------------------------
|
| NOTE:
| batteryController currently expects req.body.siteId.
| If you later update the controller to use req.params.siteId,
| change this route back to "/site/:siteId".
|
*/

router.post(
    "/site",
    getBatteryBySite
);

/*
|--------------------------------------------------------------------------
| CRUD
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authorize("ADMIN", "ENGINEER"),
    createBattery
);

router.get(
    "/",
    getBatteries
);

router.post(
    "/details",
    getBatteryById
);

router.put(
    "/",
    authorize("ADMIN", "ENGINEER"),
    updateBattery
);

router.delete(
    "/",
    authorize("ADMIN"),
    deleteBattery
);

export default router;