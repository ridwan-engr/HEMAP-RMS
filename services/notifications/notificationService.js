import Notification from "../../models/Notification.js";
import User from "../../models/User.js";
import Site from "../../models/Site.js";

/*
|--------------------------------------------------------------------------
| Create Notification
|--------------------------------------------------------------------------
*/

export async function createNotification(data) {

    const notification = await Notification.create({

        user: data.user ?? null,

        site: data.site ?? null,

        title: data.title,

        message: data.message,

        type: data.type ?? "INFO",

        priority: data.priority ?? "NORMAL",

        category: data.category ?? "SYSTEM",

        metadata: data.metadata ?? {},

        isRead: false,

        isArchived: false,

        expiresAt: data.expiresAt ?? null

    });

    return notification.populate([
        { path: "user", select: "firstName lastName email" },
        { path: "site", select: "name code" }
    ]);

}

/*
|--------------------------------------------------------------------------
| Bulk Create Notifications
|--------------------------------------------------------------------------
*/

export async function createBulkNotifications(notifications = []) {

    if (!notifications.length) {

        return [];

    }

    const docs = notifications.map(item => ({

        user: item.user ?? null,

        site: item.site ?? null,

        title: item.title,

        message: item.message,

        type: item.type ?? "INFO",

        priority: item.priority ?? "NORMAL",

        category: item.category ?? "SYSTEM",

        metadata: item.metadata ?? {},

        isRead: false,

        isArchived: false,

        expiresAt: item.expiresAt ?? null

    }));

    return Notification.insertMany(docs);

}

/*
|--------------------------------------------------------------------------
| Get Notification By ID
|--------------------------------------------------------------------------
*/

export async function getNotificationById(id) {

    return Notification.findById(id)

        .populate("user", "firstName lastName email")

        .populate("site", "name code");

}

/*
|--------------------------------------------------------------------------
| Get Notifications
|--------------------------------------------------------------------------
*/

export async function getNotifications({

    page = 1,

    limit = 20,

    user,

    site,

    type,

    priority,

    isRead,

    isArchived = false

} = {}) {

    const query = {

        isArchived

    };

    if (user) query.user = user;

    if (site) query.site = site;

    if (type) query.type = type;

    if (priority) query.priority = priority;

    if (typeof isRead === "boolean") {

        query.isRead = isRead;

    }

    const skip =

        (page - 1) * limit;

    const [

        notifications,

        total

    ] = await Promise.all([

        Notification.find(query)

            .populate("user", "firstName lastName")

            .populate("site", "name")

            .sort({

                createdAt: -1

            })

            .skip(skip)

            .limit(limit),

        Notification.countDocuments(query)

    ]);

    return {

        notifications,

        pagination: {

            total,

            page,

            limit,

            pages: Math.ceil(total / limit)

        }

    };

}

/*
|--------------------------------------------------------------------------
| Get Notifications By User
|--------------------------------------------------------------------------
*/

export async function getUserNotifications(

    userId,

    options = {}

) {

    return getNotifications({

        ...options,

        user: userId

    });

}

/*
|--------------------------------------------------------------------------
| Get Notifications By Site
|--------------------------------------------------------------------------
*/

export async function getSiteNotifications(

    siteId,

    options = {}

) {

    return getNotifications({

        ...options,

        site: siteId

    });

}

/*
|--------------------------------------------------------------------------
| Broadcast Notification To Site
|--------------------------------------------------------------------------
*/

export async function broadcastToSite(

    siteId,

    notification

) {

    const users = await User.find({

        assignedSites: siteId,

        isActive: true

    }).select("_id");

    const ids = users.map(

        user => user._id

    );

    return broadcastToUsers(

        ids,

        {

            ...notification,

            site: siteId

        }

    );

}

/*
|--------------------------------------------------------------------------
| Broadcast Notification To Role
|--------------------------------------------------------------------------
*/

export async function broadcastToRole(

    roleName,

    notification

) {

    const role = await Role.findOne({

        name: roleName

    });

    if (!role) {

        return [];

    }

    const users = await User.find({

        role: role._id,

        isActive: true

    }).select("_id");

    return broadcastToUsers(

        users.map(

            user => user._id

        ),

        notification

    );

}

/*
|--------------------------------------------------------------------------
| System Notification
|--------------------------------------------------------------------------
*/

export async function sendSystemNotification(

    notification

) {

    return broadcastToRole(

        "Administrator",

        {

            ...notification,

            category: "SYSTEM",

            type: "INFO"

        }

    );

}

/*
|--------------------------------------------------------------------------
| Alarm Notification
|--------------------------------------------------------------------------
*/

export async function sendAlarmNotification(

    siteId,

    alarm

) {

    return broadcastToSite(

        siteId,

        {

            title: "Alarm Triggered",

            message: alarm.message,

            priority: "HIGH",

            type: "WARNING",

            category: "ALARM",

            metadata: alarm

        }

    );

}

/*
|--------------------------------------------------------------------------
| Fault Notification
|--------------------------------------------------------------------------
*/

export async function sendFaultNotification(

    siteId,

    fault

) {

    return broadcastToSite(

        siteId,

        {

            title: "Fault Detected",

            message: fault.description,

            priority: "CRITICAL",

            type: "ERROR",

            category: "FAULT",

            metadata: fault

        }

    );

}

/*
|--------------------------------------------------------------------------
| Forecast Notification
|--------------------------------------------------------------------------
*/

export async function sendForecastNotification(

    siteId,

    forecast

) {

    return broadcastToSite(

        siteId,

        {

            title: "Forecast Update",

            message:

                "New forecast generated.",

            priority: "LOW",

            type: "INFO",

            category: "FORECAST",

            metadata: forecast

        }

    );

}

/*
|--------------------------------------------------------------------------
| Optimization Notification
|--------------------------------------------------------------------------
*/

export async function sendOptimizationNotification(

    siteId,

    optimization

) {

    return broadcastToSite(

        siteId,

        {

            title: "Optimization Completed",

            message:

                "A new dispatch recommendation is available.",

            priority: "NORMAL",

            type: "SUCCESS",

            category: "OPTIMIZATION",

            metadata: optimization

        }

    );

}

/*
|--------------------------------------------------------------------------
| Reliability Notification
|--------------------------------------------------------------------------
*/

export async function sendReliabilityNotification(

    siteId,

    reliability

) {

    if (

        reliability.risk !== "HIGH"

    ) {

        return null;

    }

    return broadcastToSite(

        siteId,

        {

            title: "Reliability Warning",

            message:

                "System reliability has degraded.",

            priority: "CRITICAL",

            type: "WARNING",

            category: "RELIABILITY",

            metadata: reliability

        }

    );

}

/*
|--------------------------------------------------------------------------
| Broadcast System Wide Notification
|--------------------------------------------------------------------------
*/

export async function broadcastSystemWide(

    notification

) {

    const users = await User.find({

        isActive: true

    })

        .select("_id");


    return broadcastToUsers(

        users.map(

            user => user._id

        ),

        {

            ...notification,

            category: "SYSTEM"

        }

    );

}


/*
|--------------------------------------------------------------------------
| Notify Maintenance Team
|--------------------------------------------------------------------------
*/

export async function notifyMaintenanceTeam(

    siteId,

    message,

    metadata = {}

) {

    return broadcastToRole(

        "Maintenance",

        {

            site: siteId,

            title:

                "Maintenance Notification",

            message,

            type:

                "INFO",

            priority:

                "NORMAL",

            category:

                "MAINTENANCE",

            metadata

        }

    );

}


/*
|--------------------------------------------------------------------------
| Notify Site Engineers
|--------------------------------------------------------------------------
*/

export async function notifySiteEngineers(

    siteId,

    message,

    metadata = {}

) {

    return broadcastToSite(

        siteId,

        {

            title:

                "Engineering Alert",

            message,

            type:

                "WARNING",

            priority:

                "HIGH",

            category:

                "ENGINEERING",

            metadata

        }

    );

}


/*
|--------------------------------------------------------------------------
| Notify Administrators
|--------------------------------------------------------------------------
*/

export async function notifyAdministrators(

    message,

    metadata = {}

) {

    return sendSystemNotification({

        title:

            "Administrator Alert",

        message,

        priority:

            "HIGH",

        metadata

    });

}


/*
|--------------------------------------------------------------------------
| Schedule Notification
|--------------------------------------------------------------------------
*/

export async function scheduleNotification(

    data

) {

    return Notification.create({

        ...data,

        scheduled: true,

        scheduledAt:

            data.scheduledAt,

        status:

            "PENDING"

    });

}


/*
|--------------------------------------------------------------------------
| Cancel Scheduled Notification
|--------------------------------------------------------------------------
*/

export async function cancelScheduledNotification(

    notificationId

) {

    return Notification.findByIdAndUpdate(

        notificationId,

        {

            status:

                "CANCELLED"

        },

        {

            new: true

        }

    );

}


/*
|--------------------------------------------------------------------------
| Process Scheduled Notifications
|--------------------------------------------------------------------------
*/

export async function processScheduledNotifications() {

    const notifications =

        await Notification.find({

            scheduled: true,

            status: "PENDING",

            scheduledAt: {

                $lte: new Date()

            }

        });


    for (

        const notification of notifications

    ) {

        await createNotification({

            user:

                notification.user,

            site:

                notification.site,

            title:

                notification.title,

            message:

                notification.message,

            type:

                notification.type,

            priority:

                notification.priority,

            category:

                notification.category,

            metadata:

                notification.metadata

        });


        notification.status = "SENT";


        await notification.save();

    }


    return notifications.length;

}


/*
|--------------------------------------------------------------------------
| Cleanup Notifications
|--------------------------------------------------------------------------
*/

export async function cleanupNotifications(

    days = 90

) {

    const expiryDate =

        new Date(

            Date.now() -

            days *

            24 *

            60 *

            60 *

            1000

        );


    return Notification.deleteMany({

        createdAt: {

            $lt: expiryDate

        },

        isArchived: true

    });

}


/*
|--------------------------------------------------------------------------
| Notification Statistics
|--------------------------------------------------------------------------
*/

export async function getNotificationStatistics(

    filters = {}

) {

    const query = {};


    if (filters.site) {

        query.site = filters.site;

    }


    if (filters.user) {

        query.user = filters.user;

    }


    const [

        total,

        unread,

        critical,

        warnings,

        errors

    ] = await Promise.all([


        Notification.countDocuments(query),


        Notification.countDocuments({

            ...query,

            isRead: false

        }),


        Notification.countDocuments({

            ...query,

            priority: "CRITICAL"

        }),


        Notification.countDocuments({

            ...query,

            type: "WARNING"

        }),


        Notification.countDocuments({

            ...query,

            type: "ERROR"

        })

    ]);


    return {

        total,

        unread,

        critical,

        warnings,

        errors,

        generatedAt:

            new Date()

    };

}


/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    createNotification,

    createBulkNotifications,

    getNotificationById,

    getNotifications,

    getUserNotifications,

    getSiteNotifications,

    broadcastToSite,

    broadcastToRole,


    sendSystemNotification,

    sendAlarmNotification,

    sendFaultNotification,

    sendForecastNotification,

    sendOptimizationNotification,

    sendReliabilityNotification,


    broadcastSystemWide,

    notifyMaintenanceTeam,

    notifySiteEngineers,

    notifyAdministrators,


    scheduleNotification,

    cancelScheduledNotification,

    processScheduledNotifications,


    cleanupNotifications,

    getNotificationStatistics

};