import { Router } from "express";

import deviceController from "../controllers/deviceController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Device List
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    deviceController.getDevices
);

/*
|--------------------------------------------------------------------------
| Device Summary
|--------------------------------------------------------------------------
*/

router.get(
    "/summary",
    deviceController.getDeviceSummary
);

/*
|--------------------------------------------------------------------------
| Device Statistics
|--------------------------------------------------------------------------
*/

router.get(
    "/statistics",
    deviceController.getDeviceStatistics
);

/*
|--------------------------------------------------------------------------
| Device Health
|--------------------------------------------------------------------------
*/

router.get(
    "/health",
    deviceController.getDeviceHealth
);

/*
|--------------------------------------------------------------------------
| Firmware Versions
|--------------------------------------------------------------------------
*/

router.get(
    "/firmware",
    deviceController.getFirmwareVersions
);

/*
|--------------------------------------------------------------------------
| Device Types
|--------------------------------------------------------------------------
*/

router.get(
    "/types",
    deviceController.getDeviceTypes
);

/*
|--------------------------------------------------------------------------
| Manufacturers
|--------------------------------------------------------------------------
*/

router.get(
    "/manufacturers",
    deviceController.getManufacturers
);

/*
|--------------------------------------------------------------------------
| Refresh Devices
|--------------------------------------------------------------------------
*/

router.post(
    "/refresh",
    authorize("ADMIN"),
    deviceController.refreshDevices
);

/*
|--------------------------------------------------------------------------
| Device By Internal ID
|--------------------------------------------------------------------------
*/

router.get(
    "/:id",
    deviceController.getDevice
);

/*
|--------------------------------------------------------------------------
| Device By Device ID
|--------------------------------------------------------------------------
*/

router.get(
    "/device-id/:deviceId",
    deviceController.getDeviceByDeviceId
);

/*
|--------------------------------------------------------------------------
| Create Device
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authorize(
        "ADMIN",
        "ENGINEER"
    ),
    deviceController.createDevice
);

/*
|--------------------------------------------------------------------------
| Update Device
|--------------------------------------------------------------------------
*/

router.put(
    "/:id",
    authorize(
        "ADMIN",
        "ENGINEER"
    ),
    deviceController.updateDevice
);

/*
|--------------------------------------------------------------------------
| Delete Device
|--------------------------------------------------------------------------
*/

router.delete(
    "/:id",
    authorize("ADMIN"),
    deviceController.deleteDevice
);

export default router;