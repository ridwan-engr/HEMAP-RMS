import { Router } from "express";

import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

import {

    createAuditLog,

    getAuditLogs,

    getAuditLog,

    updateAuditLog,

    deleteAuditLog

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

export default router;