import { Router } from "express";

import notificationController from "../controllers/notificationController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {
    notificationQueryValidator,
    notificationIdValidator,
    createNotificationValidator
} from "../validators/notificationValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Get Notifications
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    validate({
        query: notificationQueryValidator
    }),
    notificationController.getNotifications
);

/*
|--------------------------------------------------------------------------
| Get Notification By ID
|--------------------------------------------------------------------------
*/

router.get(
    "/:notificationId",
    validate({
        params: notificationIdValidator
    }),
    notificationController.getNotificationById
);

/*
|--------------------------------------------------------------------------
| Create Notification
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authorize(
        "ADMIN",
        "SUPERVISOR"
    ),
    validate({
        body: createNotificationValidator
    }),
    notificationController.createNotification
);

/*
|--------------------------------------------------------------------------
| Mark Notification As Read
|--------------------------------------------------------------------------
*/

router.patch(
    "/:notificationId/read",
    validate({
        params: notificationIdValidator
    }),
    notificationController.markAsRead
);

/*
|--------------------------------------------------------------------------
| Mark All Notifications As Read
|--------------------------------------------------------------------------
*/

router.patch(
    "/read-all",
    notificationController.markAllAsRead
);

/*
|--------------------------------------------------------------------------
| Delete Notification
|--------------------------------------------------------------------------
*/

router.delete(
    "/:notificationId",
    validate({
        params: notificationIdValidator
    }),
    notificationController.deleteNotification
);

export default router;