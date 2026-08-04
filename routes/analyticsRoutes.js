import { Router } from "express";

import analyticsController from "../controllers/analyticsController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {
    dashboardAnalyticsValidator,
    energyAnalyticsValidator,
    batteryAnalyticsValidator,
    solarAnalyticsValidator,
    generatorAnalyticsValidator,
    gridAnalyticsValidator,
    reliabilityAnalyticsValidator
} from "../validators/analyticsValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(

    authenticate

);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(

    "/dashboard",

    authorize(

        "ADMIN",

        "ENGINEER",

        "SUPERVISOR"

    ),

    validate({
    query: dashboardAnalyticsValidator
}),

    analyticsController.getDashboardAnalytics

);

/*
|--------------------------------------------------------------------------
| Energy
|--------------------------------------------------------------------------
*/

router.get(

    "/energy",

    authorize(

        "ADMIN",

        "ENGINEER",

        "SUPERVISOR"

    ),

    validate({
    query: energyAnalyticsValidator
}),

    analyticsController.getEnergyAnalytics

);

/*
|--------------------------------------------------------------------------
| Battery
|--------------------------------------------------------------------------
*/

router.get(

    "/battery",

    authorize(

        "ADMIN",

        "ENGINEER",

        "SUPERVISOR"

    ),

    validate({
    query: batteryAnalyticsValidator
}),

    analyticsController.getBatteryAnalytics

);

/*
|--------------------------------------------------------------------------
| Solar
|--------------------------------------------------------------------------
*/

router.get(

    "/solar",

    authorize(

        "ADMIN",

        "ENGINEER",

        "SUPERVISOR"

    ),

    validate({
    query: solarAnalyticsValidator
}),

    analyticsController.getSolarAnalytics

);

/*
|--------------------------------------------------------------------------
| Generator
|--------------------------------------------------------------------------
*/

router.get(

    "/generator",

    authorize(

        "ADMIN",

        "ENGINEER",

        "SUPERVISOR"

    ),

    validate({
    query: generatorAnalyticsValidator
}),

    analyticsController.getGeneratorAnalytics

);

/*
|--------------------------------------------------------------------------
| Grid
|--------------------------------------------------------------------------
*/

router.get(

    "/grid",

    authorize(

        "ADMIN",

        "ENGINEER",

        "SUPERVISOR"

    ),

    validate({
    query: gridAnalyticsValidator
}),

    analyticsController.getGridAnalytics

);

/*
|--------------------------------------------------------------------------
| Reliability
|--------------------------------------------------------------------------
*/

router.get(

    "/reliability",

    authorize(

        "ADMIN",

        "ENGINEER",

        "SUPERVISOR"

    ),

    validate({
    query: reliabilityAnalyticsValidator
}),

    analyticsController.getReliabilityAnalytics

);

console.log("analytics router =", router);

export default router;