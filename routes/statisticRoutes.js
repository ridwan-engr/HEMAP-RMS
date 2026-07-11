import { Router } from "express";

import authenticate from "../middlewares/auth.js";

import {

    getStatistics,

    getStatistic,

    createStatistic,

    updateStatistic,

    deleteStatistic

} from "../controllers/statisticController.js";

const router = Router();

router.post(
    "/",
    authenticate,
    createStatistic
);

router.get(
    "/",
    authenticate,
    getStatistics
);

router.get(
    "/:id",
    authenticate,
    getStatistic
);

router.put(
    "/:id",
    authenticate,
    updateStatistic
);

router.delete(
    "/:id",
    authenticate,
    deleteStatistic
);

export default router;