import { Router } from "express";

import authenticate from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

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
| System Settings
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authenticate,
    authorize("Administrator"),
    createSetting
);

router.get(
    "/",
    authenticate,
    authorize("Administrator"),
    getSettings
);

router.get(
    "/:id",
    authenticate,
    authorize("Administrator"),
    getSetting
);

router.put(
    "/:id",
    authenticate,
    authorize("Administrator"),
    updateSetting
);

router.delete(
    "/:id",
    authenticate,
    authorize("Administrator"),
    deleteSetting
);

export default router;