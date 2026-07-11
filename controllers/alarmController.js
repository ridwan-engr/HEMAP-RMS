// controllers/alarmController.js

import Alarm from "../models/Alarm.js";
import Site from "../models/Site.js";
import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Create Alarm
|--------------------------------------------------------------------------
*/

export async function createAlarm(req, res, next) {

    try {

        const alarm = await Alarm.create(req.body);

        logger.success(`Alarm created: ${alarm._id}`);

        return res.status(201).json({

            success: true,

            message: "Alarm created successfully.",

            data: alarm

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Get All Alarms
|--------------------------------------------------------------------------
*/

export async function getAlarms(req, res, next) {

    try {

        const {

            page = 1,

            limit = 20,

            severity,

            status,

            category,

            site,

            search,

            sort = "-createdAt"

        } = req.query;

        const filter = {};

        if (severity)

            filter.severity = severity;

        if (status)

            filter.status = status;

        if (category)

            filter.category = category;

        if (site)

            filter.site = site;

        if (search) {

            filter.$or = [

                {

                    name: {

                        $regex: search,

                        $options: "i"

                    }

                },

                {

                    message: {

                        $regex: search,

                        $options: "i"

                    }

                }

            ];

        }

        const total = await Alarm.countDocuments(filter);

        const alarms = await Alarm.find(filter)

            .populate(

                "site",

                "name siteCode installationId"

            )

            .sort(sort)

            .skip(

                (page - 1) * limit

            )

            .limit(Number(limit));

        return res.json({

            success: true,

            total,

            page: Number(page),

            pages: Math.ceil(total / limit),

            data: alarms

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Get Alarm By ID
|--------------------------------------------------------------------------
*/

export async function getAlarm(req, res, next) {

    try {

        const alarm = await Alarm.findById(

            req.params.id

        ).populate(

            "site"

        );

        if (!alarm) {

            return res.status(404).json({

                success: false,

                message: "Alarm not found."

            });

        }

        return res.json({

            success: true,

            data: alarm

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Active Alarms
|--------------------------------------------------------------------------
*/

export async function getActiveAlarms(req, res, next) {

    try {

        const alarms = await Alarm.find({

            status: "ACTIVE"

        })

        .populate(

            "site",

            "name siteCode"

        )

        .sort("-startedAt");

        return res.json({

            success: true,

            count: alarms.length,

            data: alarms

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Resolve Alarm
|--------------------------------------------------------------------------
*/

export async function resolveAlarm(req, res, next) {

    try {

        const alarm = await Alarm.findById(

            req.params.id

        );

        if (!alarm) {

            return res.status(404).json({

                success: false,

                message: "Alarm not found."

            });

        }

        alarm.status = "RESOLVED";

        alarm.resolvedAt = new Date();

        await alarm.save();

        logger.success(

            `Alarm resolved ${alarm._id}`

        );

        return res.json({

            success: true,

            message: "Alarm resolved.",

            data: alarm

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Acknowledge Alarm
|--------------------------------------------------------------------------
*/

export async function acknowledgeAlarm(

    req,

    res,

    next

) {

    try {

        const alarm = await Alarm.findById(

            req.params.id

        );

        if (!alarm) {

            return res.status(404).json({

                success: false,

                message: "Alarm not found."

            });

        }

        alarm.status = "ACKNOWLEDGED";

        await alarm.save();

        logger.success(

            `Alarm acknowledged ${alarm._id}`

        );

        return res.json({

            success: true,

            message:

                "Alarm acknowledged.",

            data: alarm

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Delete Alarm
|--------------------------------------------------------------------------
*/

export async function deleteAlarm(

    req,

    res,

    next

) {

    try {

        const alarm = await Alarm.findByIdAndDelete(

            req.params.id

        );

        if (!alarm) {

            return res.status(404).json({

                success: false,

                message: "Alarm not found."

            });

        }

        logger.warn(

            `Alarm deleted ${alarm._id}`

        );

        return res.json({

            success: true,

            message:

                "Alarm deleted."

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Alarm Statistics
|--------------------------------------------------------------------------
*/

export async function getAlarmStatistics(

    req,

    res,

    next

) {

    try {

        const stats = await Alarm.aggregate([

            {

                $group: {

                    _id: "$status",

                    total: {

                        $sum: 1

                    }

                }

            }

        ]);

        return res.json({

            success: true,

            data: stats

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Get Site Alarms
|--------------------------------------------------------------------------
*/

export async function getSiteAlarms(

    req,

    res,

    next

) {

    try {

        const alarms = await Alarm.find({

            site: req.params.siteId

        })

        .sort("-startedAt");

        return res.json({

            success: true,

            count: alarms.length,

            data: alarms

        });

    }

    catch (error) {

        next(error);

    }

}

export default {

    createAlarm,

    getAlarms,

    getAlarm,

    getActiveAlarms,

    acknowledgeAlarm,

    resolveAlarm,

    deleteAlarm,

    getAlarmStatistics,

    getSiteAlarms

};