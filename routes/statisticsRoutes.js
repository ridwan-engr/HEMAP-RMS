import { Router } from "express";

import statisticController from "../controllers/statisticController.js";

import authenticate from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";

import {

    dashboardStatisticsValidator,
    energyStatisticsValidator,
    batteryStatisticsValidator,
    solarStatisticsValidator,
    generatorStatisticsValidator,
    gridStatisticsValidator,
    kpiStatisticsValidator,
    siteLocationValidator

} from "../validators/statisticsValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

router.get(

    "/dashboard",

    validate({

        query: dashboardStatisticsValidator

    }),

    statisticController.getDashboardStatistics

);

/*
|--------------------------------------------------------------------------
| Energy Statistics
|--------------------------------------------------------------------------
*/

router.get(

    "/energy",

    validate({

        query: energyStatisticsValidator

    }),

    statisticController.getEnergyStatistics

);

/*
|--------------------------------------------------------------------------
| Battery Statistics
|--------------------------------------------------------------------------
*/

router.get(

    "/battery",

    validate({

        query: batteryStatisticsValidator

    }),

    statisticController.getBatteryStatistics

);

/*
|--------------------------------------------------------------------------
| Solar Statistics
|--------------------------------------------------------------------------
*/

router.get(

    "/solar",

    validate({

        query: solarStatisticsValidator

    }),

    statisticController.getSolarStatistics

);

/*
|--------------------------------------------------------------------------
| Generator Statistics
|--------------------------------------------------------------------------
*/

router.get(

    "/generator",

    validate({

        query: generatorStatisticsValidator

    }),

    statisticController.getGeneratorStatistics

);

/*
|--------------------------------------------------------------------------
| Grid Statistics
|--------------------------------------------------------------------------
*/

router.get(

    "/grid",

    validate({

        query: gridStatisticsValidator

    }),

    statisticController.getGridStatistics

);

/*
|--------------------------------------------------------------------------
| KPI Statistics
|--------------------------------------------------------------------------
*/

router.get(

    "/kpis",

    validate({

        query: kpiStatisticsValidator

    }),

    statisticController.getKPIs

);

/*
|--------------------------------------------------------------------------
| Site Locations
|--------------------------------------------------------------------------
*/

router.get(

    "/locations",

    validate({

        query: siteLocationValidator

    }),

    statisticController.getSiteLocations

);

export default router;