import AuditLog from "../models/AuditLog.js";
import User from "../models/User.js";
import Site from "../models/Site.js";

import asyncHandler from "express-async-handler";

import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Create Audit Log
|--------------------------------------------------------------------------
|
| Normally this endpoint is used internally by services whenever
| important activities occur (login, logout, CRUD operations,
| synchronization, configuration changes, etc.)
|
*/

export async function createAuditLog(req, res, next) {

    try {

        const {

            user,

            site,

            action,

            module,

            description,

            ipAddress,

            userAgent,

            metadata

        } = req.body;

        const audit = await AuditLog.create({

            user,

            site,

            action,

            module,

            description,

            ipAddress,

            userAgent,

            metadata

        });

        logger.success(

            `Audit log created (${audit._id})`

        );

        return res.status(201).json({

            success: true,

            message: "Audit log created successfully.",

            data: audit

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Get Audit Logs
|--------------------------------------------------------------------------
|
| Features
|
| ✔ Pagination
| ✔ Search
| ✔ Filter by:
|      module
|      action
|      user
|      site
| ✔ Sorting
|
*/

export async function getAuditLogs(req, res, next) {

    try {

        const {

            page = 1,

            limit = 20,

            module,

            action,

            user,

            site,

            search,

            sort = "-createdAt"

        } = req.query;

        const filter = {};

        if (module)

            filter.module = module;

        if (action)

            filter.action = action;

        if (user)

            filter.user = user;

        if (site)

            filter.site = site;

        if (search) {

            filter.$or = [

                {

                    description: {

                        $regex: search,

                        $options: "i"

                    }

                },

                {

                    module: {

                        $regex: search,

                        $options: "i"

                    }

                },

                {

                    action: {

                        $regex: search,

                        $options: "i"

                    }

                }

            ];

        }

        const total = await AuditLog.countDocuments(

            filter

        );

        const logs = await AuditLog.find(

            filter

        )

        .populate(

            "user",

            "firstName lastName email"

        )

        .populate(

            "site",

            "name siteCode installationId"

        )

        .sort(sort)

        .skip(

            (page - 1) * Number(limit)

        )

        .limit(

            Number(limit)

        );

        return res.status(200).json({

            success: true,

            page: Number(page),

            pages: Math.ceil(

                total / Number(limit)

            ),

            total,

            count: logs.length,

            data: logs

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Get Audit Log By ID
|--------------------------------------------------------------------------
*/

export async function getAuditLog(

    req,

    res,

    next

) {

    try {

        const audit = await AuditLog.findById(

            req.params.id

        )

        .populate(

            "user",

            "firstName lastName email"

        )

        .populate(

            "site",

            "name siteCode installationId"

        );

        if (!audit) {

            return res.status(404).json({

                success: false,

                message:

                    "Audit log not found."

            });

        }

        return res.status(200).json({

            success: true,

            data: audit

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Update Audit Log
|--------------------------------------------------------------------------
*/

export const updateAuditLog = asyncHandler(async (req, res) => {

    const auditLog = await AuditLog.findById(req.params.id);

    if (!auditLog) {

        res.status(404);

        throw new Error("Audit log not found.");

    }

    Object.assign(auditLog, req.body);

    await auditLog.save();

    logger.warn(

        `Audit log ${auditLog._id} updated.`

    );

    res.json({

        success: true,

        data: auditLog

    });

});

/*
|--------------------------------------------------------------------------
| Delete Audit Log
|--------------------------------------------------------------------------
*/

export const deleteAuditLog = asyncHandler(async (req, res) => {

    const auditLog = await AuditLog.findById(req.params.id);

    if (!auditLog) {

        res.status(404);

        throw new Error("Audit log not found.");

    }

    await auditLog.deleteOne();

    logger.warn(

        `Audit log ${auditLog._id} deleted.`

    );

    res.json({

        success: true,

        message: "Audit log deleted successfully."

    });

});

/*
|--------------------------------------------------------------------------
| Audit Summary
|--------------------------------------------------------------------------
*/

export async function getAuditSummary(req, res, next) {

    try {

        const [

            totalLogs,

            todayLogs,

            uniqueUsers,

            uniqueSites

        ] = await Promise.all([

            AuditLog.countDocuments(),

            AuditLog.countDocuments({

                createdAt: {

                    $gte: new Date(

                        new Date().setHours(

                            0,
                            0,
                            0,
                            0

                        )

                    )

                }

            }),

            AuditLog.distinct("user"),

            AuditLog.distinct("site")

        ]);

        return res.status(200).json({

            success: true,

            data: {

                totalLogs,

                todayLogs,

                totalUsers: uniqueUsers.length,

                totalSites: uniqueSites.length

            }

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Audit Statistics
|--------------------------------------------------------------------------
*/

export async function getAuditStatistics(req, res, next) {

    try {

        const statistics = await AuditLog.aggregate([

            {

                $group: {

                    _id: "$module",

                    count: {

                        $sum: 1

                    }

                }

            },

            {

                $project: {

                    _id: 0,

                    module: "$_id",

                    count: 1

                }

            },

            {

                $sort: {

                    count: -1

                }

            }

        ]);

        return res.status(200).json({

            success: true,

            data: statistics

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}