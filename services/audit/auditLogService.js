import AuditLog from "../../models/AuditLog.js";

/*
|--------------------------------------------------------------------------
| Get Audit Logs
|--------------------------------------------------------------------------
*/

export async function getAuditLogs(filters = {}) {

    const query = {};

    if (filters.userId) {

        query.user = filters.userId;

    }

    if (filters.action) {

        query.action = filters.action;

    }

    if (filters.module) {

        query.module = filters.module;

    }

    if (filters.status) {

        query.status = filters.status;

    }

    if (filters.startDate || filters.endDate) {

        query.createdAt = {};

        if (filters.startDate) {

            query.createdAt.$gte = new Date(

                filters.startDate

            );

        }

        if (filters.endDate) {

            query.createdAt.$lte = new Date(

                filters.endDate

            );

        }

    }

    return AuditLog.find(query)

        .populate(

            "user",

            "firstName lastName email"

        )

        .sort({

            createdAt: -1

        });

}

/*
|--------------------------------------------------------------------------
| Get Audit Log
|--------------------------------------------------------------------------
*/

export async function getAuditLogById(auditLogId) {

    const log = await AuditLog.findById(

        auditLogId

    )

    .populate(

        "user",

        "firstName lastName email"

    );

    if (!log) {

        throw new Error(

            "Audit log not found."

        );

    }

    return log;

}

/*
|--------------------------------------------------------------------------
| Create Audit Log
|--------------------------------------------------------------------------
*/

export async function createAuditLog(

    payload,

    user

) {

    const log = await AuditLog.create({

        ...payload,

        user: user._id,

        createdAt: new Date()

    });

    return getAuditLogById(

        log._id

    );

}

/*
|--------------------------------------------------------------------------
| Delete Audit Log
|--------------------------------------------------------------------------
*/

export async function deleteAuditLog(

    auditLogId

) {

    const log = await getAuditLogById(

        auditLogId

    );

    await log.deleteOne();

    return true;

}

/*
|--------------------------------------------------------------------------
| Export Audit Logs
|--------------------------------------------------------------------------
*/

export async function exportAuditLogs(filters = {}) {

    const logs = await getAuditLogs(filters);

    return {

        exportedAt: new Date(),

        totalRecords: logs.length,

        records: logs

    };

}

export default {

    getAuditLogs,

    getAuditLogById,

    createAuditLog,

    deleteAuditLog,

    exportAuditLogs

};