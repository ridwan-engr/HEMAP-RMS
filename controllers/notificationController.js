import asyncHandler from "../utils/asyncHandler.js";

import * as notificationService from "../services/notifications/notificationService.js";

/*
|--------------------------------------------------------------------------
| Get Notifications
|--------------------------------------------------------------------------
*/

export const getNotifications = asyncHandler(async (req, res) => {

    const notifications = await notificationService.getNotifications(

        req.query,

        req.user

    );

    return res.status(200).json({

        success: true,

        message: "Notifications retrieved successfully.",

        data: notifications

    });

});

/*
|--------------------------------------------------------------------------
| Notification Details
|--------------------------------------------------------------------------
*/

export const getNotificationById = asyncHandler(async (req, res) => {

    const notification = await notificationService.getNotificationById(

        req.params.notificationId,

        req.user

    );

    return res.status(200).json({

        success: true,

        message: "Notification retrieved successfully.",

        data: notification

    });

});

/*
|--------------------------------------------------------------------------
| Create Notification
|--------------------------------------------------------------------------
*/

export const createNotification = asyncHandler(async (req, res) => {

    const notification = await notificationService.createNotification(

        req.body,

        req.user

    );

    return res.status(201).json({

        success: true,

        message: "Notification created successfully.",

        data: notification

    });

});

/*
|--------------------------------------------------------------------------
| Mark As Read
|--------------------------------------------------------------------------
*/

export const markAsRead = asyncHandler(async (req, res) => {

    const notification = await notificationService.markAsRead(

        req.params.notificationId,

        req.user

    );

    return res.status(200).json({

        success: true,

        message: "Notification marked as read.",

        data: notification

    });

});

/*
|--------------------------------------------------------------------------
| Mark All As Read
|--------------------------------------------------------------------------
*/

export const markAllAsRead = asyncHandler(async (req, res) => {

    const result = await notificationService.markAllAsRead(

        req.user

    );

    return res.status(200).json({

        success: true,

        message: "All notifications marked as read.",

        data: result

    });

});

/*
|--------------------------------------------------------------------------
| Delete Notification
|--------------------------------------------------------------------------
*/

export const deleteNotification = asyncHandler(async (req, res) => {

    await notificationService.deleteNotification(

        req.params.notificationId,

        req.user

    );

    return res.status(200).json({

        success: true,

        message: "Notification deleted successfully."

    });

});

export default {

    getNotifications,

    getNotificationById,

    createNotification,

    markAsRead,

    markAllAsRead,

    deleteNotification

};