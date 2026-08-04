import Notification from "../../models/Notification.js";
import User from "../../models/User.js";

import logger from "../../utils/logger.js";

import {

    emitNotification

} from "../../websocket/eventEmitters.js";

/*
|--------------------------------------------------------------------------
| Get Notifications
|--------------------------------------------------------------------------
*/

export async function getNotifications(filters = {}, user) {

    const query = {

        recipient: user._id

    };

    if (filters.type) {

        query.type = filters.type;

    }

    if (filters.priority) {

        query.priority = filters.priority;

    }

    if (filters.read !== undefined) {

        query.read = filters.read === "true";

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

    return Notification.find(query)

        .populate(

            "recipient",

            "firstName lastName email"

        )

        .populate(

            "createdBy",

            "firstName lastName"

        )

        .sort({

            createdAt: -1

        });

}

/*
|--------------------------------------------------------------------------
| Notification Details
|--------------------------------------------------------------------------
*/

export async function getNotificationById(

    notificationId,

    user

) {

    const notification = await Notification.findOne({

        _id: notificationId,

        recipient: user._id

    })

    .populate(

        "recipient",

        "firstName lastName email"

    )

    .populate(

        "createdBy",

        "firstName lastName"

    );

    if (!notification) {

        throw new Error(

            "Notification not found."

        );

    }

    return notification;

}

/*
|--------------------------------------------------------------------------
| Create Notification
|--------------------------------------------------------------------------
*/

export async function createNotification(

    payload,

    user

) {

    const notification = await Notification.create({

        ...payload,

        createdBy: user?._id ?? null

    });

    const populated = await Notification.findById(

        notification._id

    )

    .populate(

        "recipient",

        "firstName lastName email"

    )

    .populate(

        "createdBy",

        "firstName lastName"

    );

    /*
    |--------------------------------------------------------------------------
    | Realtime Notification
    |--------------------------------------------------------------------------
    */

    emitNotification(

        String(populated.recipient._id),

        populated

    );

    logger.info({

        message:

            "Notification created.",

        notificationId:

            populated._id

    });

    return populated;

}

/*
|--------------------------------------------------------------------------
| Mark As Read
|--------------------------------------------------------------------------
*/

export async function markAsRead(

    notificationId,

    user

) {

    const notification = await getNotificationById(

        notificationId,

        user

    );

    notification.read = true;

    notification.readAt = new Date();

    await notification.save();

    return notification;

}

/*
|--------------------------------------------------------------------------
| Mark All As Read
|--------------------------------------------------------------------------
*/

export async function markAllAsRead(user) {

    const result = await Notification.updateMany(

        {

            recipient: user._id,

            read: false

        },

        {

            $set: {

                read: true,

                readAt: new Date()

            }

        }

    );

    return {

        modifiedCount: result.modifiedCount

    };

}

/*
|--------------------------------------------------------------------------
| Delete Notification
|--------------------------------------------------------------------------
*/

export async function deleteNotification(

    notificationId,

    user

) {

    const notification = await getNotificationById(

        notificationId,

        user

    );

    await notification.deleteOne();

    return true;

}

/*
|--------------------------------------------------------------------------
| Broadcast Notification
|--------------------------------------------------------------------------
*/

export async function broadcastNotification(

    payload,

    user = null

) {

    const users = await User.find()

        .select("_id");

    const notifications = [];

    for (const recipient of users) {

        const notification = await createNotification(

            {

                ...payload,

                recipient: recipient._id

            },

            user

        );

        notifications.push(notification);

    }

    return notifications;

}

/*
|--------------------------------------------------------------------------
| Site Notification
|--------------------------------------------------------------------------
*/

export async function sendSiteNotification(

    siteId,

    recipients = [],

    payload,

    user = null

) {

    const notifications = [];

    for (const recipient of recipients) {

        const notification = await createNotification(

            {

                ...payload,

                site: siteId,

                recipient

            },

            user

        );

        notifications.push(notification);

    }

    return notifications;

}

/*
|--------------------------------------------------------------------------
| Critical Alarm Notification
|--------------------------------------------------------------------------
*/

export async function sendCriticalAlarm(

    siteId,

    recipient,

    alarm,

    user = null

) {

    return createNotification(

        {

            recipient,

            site: siteId,

            type: "ALARM",

            priority: "CRITICAL",

            title: "Critical Alarm",

            message: alarm.message,

            metadata: alarm

        },

        user

    );

}

/*
|--------------------------------------------------------------------------
| Report Ready Notification
|--------------------------------------------------------------------------
*/

export async function sendReportReady(

    recipient,

    report,

    user = null

) {

    return createNotification(

        {

            recipient,

            type: "REPORT",

            priority: "NORMAL",

            title: "Report Ready",

            message:

                `${report.type} report is ready.`,

            metadata: {

                reportId: report._id

            }

        },

        user

    );

}

/*
|--------------------------------------------------------------------------
| Forecast Notification
|--------------------------------------------------------------------------
*/

export async function sendForecastNotification(

    recipient,

    forecast,

    user = null

) {

    return createNotification(

        {

            recipient,

            type: "FORECAST",

            priority: "LOW",

            title: "Forecast Update",

            message:

                "New forecast available.",

            metadata: forecast

        },

        user

    );

}

/*
|--------------------------------------------------------------------------
| Optimization Notification
|--------------------------------------------------------------------------
*/

export async function sendOptimizationNotification(

    recipient,

    optimization,

    user = null

) {

    return createNotification(

        {

            recipient,

            type: "OPTIMIZATION",

            priority: "LOW",

            title: "Optimization Completed",

            message:

                "New optimization results are available.",

            metadata: optimization

        },

        user

    );

}

/*
|--------------------------------------------------------------------------
| Reliability Notification
|--------------------------------------------------------------------------
*/

export async function sendReliabilityNotification(

    recipient,

    reliability,

    user = null

) {

    return createNotification(

        {

            recipient,

            type: "RELIABILITY",

            priority: "MEDIUM",

            title: "Reliability Alert",

            message:

                "Reliability KPI exceeded threshold.",

            metadata: reliability

        },

        user

    );

}

/*
|--------------------------------------------------------------------------
| Maintenance Reminder
|--------------------------------------------------------------------------
*/

export async function sendMaintenanceReminder(

    recipient,

    maintenance,

    user = null

) {

    return createNotification(

        {

            recipient,

            type: "MAINTENANCE",

            priority: "MEDIUM",

            title: "Scheduled Maintenance",

            message:

                maintenance.description,

            metadata: maintenance

        },

        user

    );

}

/*
|--------------------------------------------------------------------------
| Unread Count
|--------------------------------------------------------------------------
*/

export async function getUnreadCount(user) {

    return Notification.countDocuments({

        recipient: user._id,

        read: false

    });

}

/*
|--------------------------------------------------------------------------
| Notification Summary
|--------------------------------------------------------------------------
*/

export async function getNotificationSummary(user) {

    const [

        total,

        unread,

        critical

    ] = await Promise.all([

        Notification.countDocuments({

            recipient: user._id

        }),

        Notification.countDocuments({

            recipient: user._id,

            read: false

        }),

        Notification.countDocuments({

            recipient: user._id,

            priority: "CRITICAL"

        })

    ]);

    return {

        total,

        unread,

        critical

    };

}

/*
|--------------------------------------------------------------------------
| Archive Notification
|--------------------------------------------------------------------------
*/

export async function archiveNotification(

    notificationId,

    user

) {

    const notification =

        await getNotificationById(

            notificationId,

            user

        );

    notification.archived = true;

    notification.archivedAt = new Date();

    await notification.save();

    return notification;

}


export default {

    getNotifications,

    getNotificationById,

    createNotification,

    broadcastNotification,

    sendSiteNotification,

    sendCriticalAlarm,

    sendReportReady,

    sendForecastNotification,

    sendOptimizationNotification,

    sendReliabilityNotification,

    sendMaintenanceReminder,

    markAsRead,

    markAllAsRead,

    archiveNotification,

    deleteNotification,

    getUnreadCount,

    getNotificationSummary

};