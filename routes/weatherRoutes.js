import { Router } from "express";

import authenticate from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

import {
    createWeather,
    getWeatherHistory,
    getLatestWeather,
    getWeatherById,
    updateWeather,
    deleteWeather
} from "../controllers/weatherController.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Site Weather
|--------------------------------------------------------------------------
*/

router.get(
    "/site/:siteId",
    authenticate,
    getLatestWeather
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
    createWeather
);

router.get(
    "/",
    authenticate,
    getWeatherHistory
);

router.get(
    "/:id",
    authenticate,
    getWeatherById
);

router.put(
    "/:id",
    authenticate,
    authorize("Administrator", "Engineer"),
    updateWeather
);

router.delete(
    "/:id",
    authenticate,
    authorize("Administrator"),
    deleteWeather
);

export default router;