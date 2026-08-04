import { Router } from "express";

import auditLogController from "../controllers/auditLogController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {
    auditLogQuerySchema,
    auditLogIdSchema,
    createAuditLogSchema
} from "../validators/auditLogValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Get Audit Logs
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    authorize("ADMIN"),
    validate({
        query: auditLogQuerySchema
    }),
    auditLogController.getAuditLogs
);

/*
|--------------------------------------------------------------------------
| Export Audit Logs
|--------------------------------------------------------------------------
*/

router.get(
    "/export",
    authorize("ADMIN"),
    validate({
        query: auditLogQuerySchema
    }),
    auditLogController.exportAuditLogs
);

/*
|--------------------------------------------------------------------------
| Get Audit Log
|--------------------------------------------------------------------------
*/

router.get(
    "/:auditLogId",
    authorize("ADMIN"),
    validate({
        params: auditLogIdSchema
    }),
    auditLogController.getAuditLogById
);

/*
|--------------------------------------------------------------------------
| Create Audit Log
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authorize("ADMIN"),
    validate({
        body: createAuditLogSchema
    }),
    auditLogController.createAuditLog
);

/*
|--------------------------------------------------------------------------
| Delete Audit Log
|--------------------------------------------------------------------------
*/

router.delete(
    "/:auditLogId",
    authorize("ADMIN"),
    validate({
        params: auditLogIdSchema
    }),
    auditLogController.deleteAuditLog
);

export default router;