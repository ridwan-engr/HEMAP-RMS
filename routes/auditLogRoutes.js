import { Router } from "express";

import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

import {

    createAuditLog,

    getAuditLogs,

    getAuditLog,

    updateAuditLog,

    deleteAuditLog,

    getAuditSummary,

    getAuditStatistics

} from "../controllers/auditLogController.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Audit Logs
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authenticate,
    authorize("Administrator"),
    createAuditLog
);

router.get(
    "/",
    authenticate,
    authorize("Administrator"),
    getAuditLogs
);

router.get(
    "/:id",
    authenticate,
    authorize("Administrator"),
    getAuditLog
);

router.patch(
    "/:id",
    authenticate,
    authorize("Administrator"),
    updateAuditLog
);

router.delete(
    "/:id",
    authenticate,
    authorize("Administrator"),
    deleteAuditLog
);

router.get(

    "/summary",
    authenticate,
    authorize("Administrator"),
    getAuditSummary

);

router.get(

    "/statistics",
    authenticate,
    authorize("Administrator"),
    getAuditStatistics

);

export default router;