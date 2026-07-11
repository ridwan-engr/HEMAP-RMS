import { Router } from "express";

import reportController from "../controllers/reportController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {

    reportFilterSchema,

    exportReportSchema,

    permissionSchema

} from "../validators/reportValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Report Generation
|--------------------------------------------------------------------------
*/

router.post(
    "/generate/site-overview",
    authenticate,
    validate({ body: reportFilterSchema }),
    reportController.siteOverviewReport
);

router.post(
    "/generate/energy",
    authenticate,
    validate({ body: reportFilterSchema }),
    reportController.energyReport
);

router.post(
    "/generate/battery",
    authenticate,
    validate({ body: reportFilterSchema }),
    reportController.batteryReport
);

router.post(
    "/generate/reliability",
    authenticate,
    validate({ body: reportFilterSchema }),
    reportController.reliabilityReport
);

router.post(
    "/generate/alarms",
    authenticate,
    validate({ body: reportFilterSchema }),
    reportController.alarmReport
);

router.post(
    "/generate/maintenance",
    authenticate,
    validate({ body: reportFilterSchema }),
    reportController.maintenanceReport
);

router.post(
    "/generate/dashboard",
    authenticate,
    validate({ body: reportFilterSchema }),
    reportController.dashboardReport
);

router.post(
    "/generate/executive",
    authenticate,
    authorize("admin"),
    validate({ body: reportFilterSchema }),
    reportController.executiveReport
);

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

router.post(
    "/export",
    authenticate,
    validate({ body: exportReportSchema }),
    reportController.exportReport
);

/*
|--------------------------------------------------------------------------
| Permissions
|--------------------------------------------------------------------------
*/

router.post(
    "/permission/check",
    authenticate,
    validate({ body: permissionSchema }),
    reportController.checkReportPermission
);

/*
|--------------------------------------------------------------------------
| Report Response
|--------------------------------------------------------------------------
*/

router.get(
    "/response/:reportId",
    authenticate,
    reportController.reportResponse
);

export default router;