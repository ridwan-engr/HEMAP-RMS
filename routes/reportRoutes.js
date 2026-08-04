import { Router } from "express";

import reportController from "../controllers/reportController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {
    reportQueryValidator,
    reportIdValidator,
    generateReportValidator
} from "../validators/reportValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Generate Report
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authorize(
        "ADMIN",
        "SUPERVISOR",
        "ENGINEER"
    ),
    validate({
        body: generateReportValidator
    }),
    reportController.generateReport
);

/*
|--------------------------------------------------------------------------
| Get Reports
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    validate({
        query: reportQueryValidator
    }),
    reportController.getReports
);

/*
|--------------------------------------------------------------------------
| Get Report By ID
|--------------------------------------------------------------------------
*/

router.get(
    "/:reportId",
    validate({
        params: reportIdValidator
    }),
    reportController.getReportById
);

/*
|--------------------------------------------------------------------------
| Download Report
|--------------------------------------------------------------------------
*/

router.get(
    "/:reportId/download",
    validate({
        params: reportIdValidator
    }),
    reportController.downloadReport
);

/*
|--------------------------------------------------------------------------
| Delete Report
|--------------------------------------------------------------------------
*/

router.delete(
    "/:reportId",
    authorize("ADMIN"),
    validate({
        params: reportIdValidator
    }),
    reportController.deleteReport
);

export default router;