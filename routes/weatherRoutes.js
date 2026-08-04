import { Router } from "express";

import weatherController from "../controllers/weatherController.js";

import authenticate from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";

import {
    currentWeatherValidator,
    forecastValidator,
    historyValidator,
    irradianceValidator,
    windValidator,
    weatherSummaryValidator
} from "../validators/weatherValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Current Weather
|--------------------------------------------------------------------------
*/

router.get(
    "/current",
    validate({
        query: currentWeatherValidator
    }),
    weatherController.getCurrentWeather
);

/*
|--------------------------------------------------------------------------
| Weather Forecast
|--------------------------------------------------------------------------
*/

router.get(
    "/forecast",
    validate({
        query: forecastValidator
    }),
    weatherController.getForecast
);

/*
|--------------------------------------------------------------------------
| Historical Weather
|--------------------------------------------------------------------------
*/

router.get(
    "/history",
    validate({
        query: historyValidator
    }),
    weatherController.getHistory
);

/*
|--------------------------------------------------------------------------
| Solar Irradiance
|--------------------------------------------------------------------------
*/

router.get(
    "/irradiance",
    validate({
        query: irradianceValidator
    }),
    weatherController.getSolarIrradiance
);

/*
|--------------------------------------------------------------------------
| Wind Data
|--------------------------------------------------------------------------
*/

router.get(
    "/wind",
    validate({
        query: windValidator
    }),
    weatherController.getWindData
);

/*
|--------------------------------------------------------------------------
| Weather Summary
|--------------------------------------------------------------------------
*/

router.get(
    "/summary",
    validate({
        query: weatherSummaryValidator
    }),
    weatherController.getWeatherSummary
);

export default router;