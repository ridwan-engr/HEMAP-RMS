import { Router } from "express";

import { authenticate } from "../middlewares/auth.js";

import {

    createAlarm,

    getAlarms,

    getAlarm,

    acknowledgeAlarm,

    resolveAlarm,

    deleteAlarm

} from "../controllers/alarmController.js";

const router = Router();

router.post(
    "/",
    authenticate,
    createAlarm
);

router.get(
    "/",
    authenticate,
    getAlarms
);

router.get(
    "/:id",
    authenticate,
    getAlarm
);

router.patch(
    "/:id/acknowledge",
    authenticate,
    acknowledgeAlarm
);

router.patch(
    "/:id/resolve",
    authenticate,
    resolveAlarm
);

router.delete(
    "/:id",
    authenticate,
    deleteAlarm
);

export default router;