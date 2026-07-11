import { Router } from "express";

import {authenticate} from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

import {

    createForecast,

    getForecasts,

    getForecastById,

    updateForecast,

    deleteForecast,

    runForecast

} from "../controllers/energyForecastController.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Forecasts
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authenticate,
    authorize("Administrator", "Engineer"),
    createForecast
);

router.get(
    "/",
    authenticate,
    getForecasts
);

router.get(
    "/:id",
    authenticate,
    getForecastById
);

router.put(
    "/:id",
    authenticate,
    authorize("Administrator", "Engineer"),
    updateForecast
);

router.delete(
    "/:id",
    authenticate,
    authorize("Administrator"),
    deleteForecast
);

/*
|--------------------------------------------------------------------------
| Execute Forecast
|--------------------------------------------------------------------------
*/

router.post(
    "/:id/run",
    authenticate,
    authorize("Administrator", "Engineer"),
    runForecast
);

export default router;