import { Router } from "express";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";

import {

    createSetting,

    getSettings,

    getSetting,

    updateSetting,

    deleteSetting
    
} from "../controllers/systemSettingController.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| System Settings
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authorize("ADMIN"),
    createSetting
);

router.get(
    "/",
    authorize("ADMIN"),
    getSettings
);

router.get(
    "/:id",
    authorize("ADMIN"),
    getSetting
);

router.put(
    "/:id",
    authorize("ADMIN"),
    updateSetting
);

router.delete(
    "/:id",
    authorize("ADMIN"),
    deleteSetting
);

export default router;