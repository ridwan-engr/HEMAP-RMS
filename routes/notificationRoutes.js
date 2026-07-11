import { Router } from "express";

import notificationController from "../controllers/notificationController.js";

import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { validate } from "../middlewares/validate.js";

import {

    sendEmailSchema,
    sendSMSSchema,
    sendOTPSchema,
    verifyOTPSchema,
    alarmNotificationSchema,
    maintenanceNotificationSchema,
    pushNotificationSchema,
    notificationPreferenceSchema,
    notificationTemplateSchema,
    escalationRuleSchema

} from "../validators/notificationValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Email
|--------------------------------------------------------------------------
*/

router.post(
    "/email",
    authenticate,
    authorize("admin"),
    validate({ body: sendEmailSchema }),
    notificationController.sendEmail
);

router.post(
    "/email/bulk",
    authenticate,
    authorize("admin"),
    validate({ body: sendEmailSchema }),
    notificationController.sendBulkEmail
);

/*
|--------------------------------------------------------------------------
| SMS
|--------------------------------------------------------------------------
*/

router.post(
    "/sms",
    authenticate,
    authorize("admin"),
    validate({ body: sendSMSSchema }),
    notificationController.sendSMS
);

router.post(
    "/sms/bulk",
    authenticate,
    authorize("admin"),
    validate({ body: sendSMSSchema }),
    notificationController.sendBulkSMS
);

router.post(
    "/otp/send",
    authenticate,
    validate({ body: sendOTPSchema }),
    notificationController.sendOTP
);

router.post(
    "/otp/verify",
    authenticate,
    validate({ body: verifyOTPSchema }),
    notificationController.verifyOTP
);

/*
|--------------------------------------------------------------------------
| Operational Alerts
|--------------------------------------------------------------------------
*/

router.post(
    "/alarms",
    authenticate,
    validate({ body: alarmNotificationSchema }),
    notificationController.sendAlarmNotification
);

router.post(
    "/alarms/critical",
    authenticate,
    authorize("admin"),
    validate({ body: alarmNotificationSchema }),
    notificationController.sendCriticalAlarm
);

router.post(
    "/maintenance",
    authenticate,
    validate({ body: maintenanceNotificationSchema }),
    notificationController.maintenanceNotification
);

router.post(
    "/alerts/battery-low-soc",
    authenticate,
    notificationController.batteryLowSOCAlert
);

router.post(
    "/alerts/generator-fault",
    authenticate,
    notificationController.generatorFaultAlert
);

router.post(
    "/alerts/grid-outage",
    authenticate,
    notificationController.gridOutageAlert
);

router.get(
    "/summary/daily",
    authenticate,
    notificationController.dailyOperationsSummary
);

router.get(
    "/summary/weekly",
    authenticate,
    notificationController.weeklyOperationsReport
);

/*
|--------------------------------------------------------------------------
| Preferences
|--------------------------------------------------------------------------
*/

router.get(
    "/preferences",
    authenticate,
    notificationController.getNotificationPreferences
);

router.put(
    "/preferences",
    authenticate,
    validate({ body: notificationPreferenceSchema }),
    notificationController.updateNotificationPreferences
);

/*
|--------------------------------------------------------------------------
| History
|--------------------------------------------------------------------------
*/

router.get(
    "/history",
    authenticate,
    notificationController.getNotificationHistory
);

/*
|--------------------------------------------------------------------------
| Templates
|--------------------------------------------------------------------------
*/

router.get(
    "/templates",
    authenticate,
    authorize("admin"),
    notificationController.getNotificationTemplates
);

router.post(
    "/templates",
    authenticate,
    authorize("admin"),
    validate({ body: notificationTemplateSchema }),
    notificationController.createNotificationTemplate
);

router.put(
    "/templates/:templateId",
    authenticate,
    authorize("admin"),
    validate({ body: notificationTemplateSchema }),
    notificationController.updateNotificationTemplate
);

router.delete(
    "/templates/:templateId",
    authenticate,
    authorize("admin"),
    notificationController.deleteNotificationTemplate
);

/*
|--------------------------------------------------------------------------
| Escalation Rules
|--------------------------------------------------------------------------
*/

router.get(
    "/escalation",
    authenticate,
    authorize("admin"),
    notificationController.getEscalationRules
);

router.put(
    "/escalation",
    authenticate,
    authorize("admin"),
    validate({ body: escalationRuleSchema }),
    notificationController.updateEscalationRules
);

/*
|--------------------------------------------------------------------------
| Push Notifications
|--------------------------------------------------------------------------
*/

router.post(
    "/push",
    authenticate,
    authorize("admin"),
    validate({ body: pushNotificationSchema }),
    notificationController.sendPushNotification
);

/*
|--------------------------------------------------------------------------
| Administration
|--------------------------------------------------------------------------
*/

router.get(
    "/statistics",
    authenticate,
    authorize("admin"),
    notificationController.notificationStatistics
);

router.post(
    "/test",
    authenticate,
    authorize("admin"),
    notificationController.sendTestNotification
);

router.patch(
    "/:notificationId/read",
    authenticate,
    notificationController.markNotificationAsRead
);

router.patch(
    "/read-all",
    authenticate,
    notificationController.markAllNotificationsAsRead
);

router.delete(
    "/:notificationId",
    authenticate,
    authorize("admin"),
    notificationController.deleteNotification
);

router.post(
    "/:notificationId/retry",
    authenticate,
    authorize("admin"),
    notificationController.retryNotification
);

router.get(
    "/health",
    authenticate,
    authorize("admin"),
    notificationController.notificationHealth
);

export default router;