import asyncHandler from "../utils/asyncHandler.js";
import * as auditLogService from "../services/audit/auditLogService.js";

/*
|--------------------------------------------------------------------------
| Get Audit Logs
|--------------------------------------------------------------------------
*/

export const getAuditLogs = asyncHandler(async (req, res) => {

    const logs = await auditLogService.getAuditLogs(

        req.query

    );

    return res.status(200).json({

        success: true,

        message: "Audit logs retrieved successfully.",

        data: logs

    });

});

/*
|--------------------------------------------------------------------------
| Get Audit Log
|--------------------------------------------------------------------------
*/

export const getAuditLogById = asyncHandler(async (req, res) => {

    const log = await auditLogService.getAuditLogById(

        req.params.auditLogId

    );

    return res.status(200).json({

        success: true,

        message: "Audit log retrieved successfully.",

        data: log

    });

});

/*
|--------------------------------------------------------------------------
| Create Audit Log
|--------------------------------------------------------------------------
*/

export const createAuditLog = asyncHandler(async (req, res) => {

    const log = await auditLogService.createAuditLog(

        req.body,

        req.user

    );

    return res.status(201).json({

        success: true,

        message: "Audit log created successfully.",

        data: log

    });

});

/*
|--------------------------------------------------------------------------
| Delete Audit Log
|--------------------------------------------------------------------------
*/

export const deleteAuditLog = asyncHandler(async (req, res) => {

    await auditLogService.deleteAuditLog(

        req.params.auditLogId

    );

    return res.status(200).json({

        success: true,

        message: "Audit log deleted successfully."

    });

});

/*
|--------------------------------------------------------------------------
| Export Audit Logs
|--------------------------------------------------------------------------
*/

export const exportAuditLogs = asyncHandler(async (req, res) => {

    const result = await auditLogService.exportAuditLogs(

        req.query

    );

    return res.status(200).json({

        success: true,

        message: "Audit logs exported successfully.",

        data: result

    });

});

export default {

    getAuditLogs,

    getAuditLogById,

    createAuditLog,

    deleteAuditLog,

    exportAuditLogs

};