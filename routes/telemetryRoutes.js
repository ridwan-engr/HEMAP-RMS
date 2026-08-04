import { Router } from "express";

import telemetryController from "../controllers/telemetryController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {

    telemetryQueryValidator,

    telemetryHistoryValidator,

    installationTelemetryValidator

} from "../validators/telemetryValidator.js";

const router = Router();

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Current Telemetry
|--------------------------------------------------------------------------
*/

router.get(

    "/",

    validate({

        query: telemetryQueryValidator

    }),

    telemetryController.getTelemetry

);

/*
|--------------------------------------------------------------------------
| Historical Telemetry
|--------------------------------------------------------------------------
*/

router.get(

    "/history",

    validate({

        query: telemetryHistoryValidator

    }),

    telemetryController.getTelemetryHistory

);

/*
|--------------------------------------------------------------------------
| Telemetry Summary
|--------------------------------------------------------------------------
*/

router.get(
    "/summary",
    validate({
        query: telemetryQueryValidator
    }),
    telemetryController.getTelemetrySummary
);

/*
|--------------------------------------------------------------------------
| Latest Telemetry
|--------------------------------------------------------------------------
*/

router.get(

    "/:installationId/latest",

    validate({

        params: installationTelemetryValidator

    }),

    telemetryController.getLatestTelemetry

);

/*
|--------------------------------------------------------------------------
| Device Status
|--------------------------------------------------------------------------
*/

router.get(

    "/:installationId/status",

    validate({

        params: installationTelemetryValidator

    }),

    telemetryController.getDeviceStatus

);

/*
|--------------------------------------------------------------------------
| Synchronize Telemetry
|--------------------------------------------------------------------------
*/

router.post(

    "/:installationId/synchronize",

    authorize("ADMIN"),

    validate({

        params: installationTelemetryValidator

    }),

    telemetryController.synchronizeTelemetry

);

export default router;