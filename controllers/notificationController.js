import * as emailService from "../services/notifications/emailService.js";
import * as smsService from "../services/notifications/smsService.js";
import * as notificationService from "../services/notifications/notificationService.js";
/*
|--------------------------------------------------------------------------
| Send Email
|--------------------------------------------------------------------------
*/

export async function sendEmail(req, res) {

    try {

        const result = await emailService.sendEmail({

            to: req.body.to,

            cc: req.body.cc,

            bcc: req.body.bcc,

            subject: req.body.subject,

            text: req.body.text,

            html: req.body.html,

            attachments: req.body.attachments

        });

        return res.status(200).json({

            success: true,

            message: "Email sent successfully.",

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Send Bulk Email
|--------------------------------------------------------------------------
*/

export async function sendBulkEmail(req, res) {

    try {

        const result = await emailService.sendBulkEmail(

            req.body.recipients,

            req.body.message

        );

        return res.status(200).json({

            success: true,

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Send SMS
|--------------------------------------------------------------------------
*/

export async function sendSMS(req, res) {

    try {

        const result = await smsService.sendSMS({

            to: req.body.to,

            message: req.body.message

        });

        return res.status(200).json({

            success: true,

            message: "SMS sent successfully.",

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Send Bulk SMS
|--------------------------------------------------------------------------
*/

export async function sendBulkSMS(req, res) {

    try {

        const result = await smsService.sendBulkSMS(

            req.body.recipients,

            req.body.message

        );

        return res.status(200).json({

            success: true,

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Send OTP
|--------------------------------------------------------------------------
*/

export async function sendOTP(req, res) {

    try {

        const result = await smsService.sendOTP(

            req.body.phoneNumber

        );

        return res.status(200).json({

            success: true,

            message: "OTP sent successfully.",

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Verify OTP
|--------------------------------------------------------------------------
*/

export async function verifyOTP(req, res) {

    try {

        const result = await smsService.verifyOTP(

            req.body.phoneNumber,

            req.body.code

        );

        return res.status(200).json({

            success: true,

            data: result

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Send Alarm Notification
|--------------------------------------------------------------------------
*/

export async function sendAlarmNotification(req, res) {

    try {

        const result =
            await notificationService.sendAlarmNotification(

                req.body

            );

        return res.status(200).json({

            success: true,

            message: "Alarm notification sent successfully.",

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Send Critical Alarm
|--------------------------------------------------------------------------
*/

export async function sendCriticalAlarm(req, res) {

    try {

        const result =
            await notificationService.sendCriticalAlarm(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Maintenance Notification
|--------------------------------------------------------------------------
*/

export async function maintenanceNotification(req, res) {

    try {

        const result =
            await notificationService.sendMaintenanceNotification(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Battery Low SOC Alert
|--------------------------------------------------------------------------
*/

export async function batteryLowSOCAlert(req, res) {

    try {

        const result =
            await notificationService.sendBatteryLowSOCAlert(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Generator Fault Alert
|--------------------------------------------------------------------------
*/

export async function generatorFaultAlert(req, res) {

    try {

        const result =
            await notificationService.sendGeneratorFaultAlert(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Grid Outage Alert
|--------------------------------------------------------------------------
*/

export async function gridOutageAlert(req, res) {

    try {

        const result =
            await notificationService.sendGridOutageAlert(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Daily Operations Summary
|--------------------------------------------------------------------------
*/

export async function dailyOperationsSummary(req, res) {

    try {

        const result =
            await notificationService.sendDailySummary(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Weekly Operations Report
|--------------------------------------------------------------------------
*/

export async function weeklyOperationsReport(req, res) {

    try {

        const result =
            await notificationService.sendWeeklyReport(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Get Notification Preferences
|--------------------------------------------------------------------------
*/

export async function getNotificationPreferences(req, res) {

    try {

        const preferences =
            await notificationService.getNotificationPreferences(

                req.params.userId

            );

        return res.status(200).json({

            success: true,

            data: preferences

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Update Notification Preferences
|--------------------------------------------------------------------------
*/

export async function updateNotificationPreferences(req, res) {

    try {

        const preferences =
            await notificationService.updateNotificationPreferences(

                req.params.userId,

                req.body

            );

        return res.status(200).json({

            success: true,

            message: "Notification preferences updated successfully.",

            data: preferences

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Notification History
|--------------------------------------------------------------------------
*/

export async function getNotificationHistory(req, res) {

    try {

        const history =
            await notificationService.getNotificationHistory({

                userId: req.params.userId,

                ...req.query

            });

        return res.status(200).json({

            success: true,

            data: history

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Notification Templates
|--------------------------------------------------------------------------
*/

export async function getNotificationTemplates(req, res) {

    try {

        const templates =
            await notificationService.getNotificationTemplates();

        return res.status(200).json({

            success: true,

            data: templates

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


export async function createNotificationTemplate(req, res) {

    try {

        const template =
            await notificationService.createNotificationTemplate(

                req.body

            );

        return res.status(201).json({

            success: true,

            data: template

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


export async function updateNotificationTemplate(req, res) {

    try {

        const template =
            await notificationService.updateNotificationTemplate(

                req.params.templateId,

                req.body

            );

        return res.status(200).json({

            success: true,

            data: template

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


export async function deleteNotificationTemplate(req, res) {

    try {

        await notificationService.deleteNotificationTemplate(

            req.params.templateId

        );

        return res.status(200).json({

            success: true,

            message: "Notification template deleted successfully."

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Escalation Rules
|--------------------------------------------------------------------------
*/

export async function getEscalationRules(req, res) {

    try {

        const rules =
            await notificationService.getEscalationRules();

        return res.status(200).json({

            success: true,

            data: rules

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


export async function updateEscalationRules(req, res) {

    try {

        const rules =
            await notificationService.updateEscalationRules(

                req.body

            );

        return res.status(200).json({

            success: true,

            data: rules

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Push Notification
|--------------------------------------------------------------------------
*/

export async function sendPushNotification(req, res) {

    try {

        const result =
            await notificationService.sendPushNotification(

                req.body

            );

        return res.status(200).json({

            success: true,

            message: "Push notification sent successfully.",

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Notification Statistics
|--------------------------------------------------------------------------
*/

export async function notificationStatistics(req, res) {

    try {

        const statistics =
            await notificationService.getNotificationStatistics(req.query);

        return res.status(200).json({

            success: true,

            data: statistics

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Send Test Notification
|--------------------------------------------------------------------------
*/

export async function sendTestNotification(req, res) {

    try {

        const result =
            await notificationService.sendTestNotification(req.body);

        return res.status(200).json({

            success: true,

            message: "Test notification sent successfully.",

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Mark Notification as Read
|--------------------------------------------------------------------------
*/

export async function markNotificationAsRead(req, res) {

    try {

        const notification =
            await notificationService.markNotificationAsRead(

                req.params.notificationId

            );

        return res.status(200).json({

            success: true,

            data: notification

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Mark All Notifications as Read
|--------------------------------------------------------------------------
*/

export async function markAllNotificationsAsRead(req, res) {

    try {

        const result =
            await notificationService.markAllNotificationsAsRead(

                req.params.userId

            );

        return res.status(200).json({

            success: true,

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Delete Notification
|--------------------------------------------------------------------------
*/

export async function deleteNotification(req, res) {

    try {

        await notificationService.deleteNotification(

            req.params.notificationId

        );

        return res.status(200).json({

            success: true,

            message: "Notification deleted successfully."

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Retry Failed Notification
|--------------------------------------------------------------------------
*/

export async function retryNotification(req, res) {

    try {

        const result =
            await notificationService.retryNotification(

                req.params.notificationId

            );

        return res.status(200).json({

            success: true,

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Notification Health Check
|--------------------------------------------------------------------------
*/

export async function notificationHealth(req, res) {

    try {

        const health =
            await notificationService.healthCheck();

        return res.status(200).json({

            success: true,

            data: health

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

export default {

    // Email
    sendEmail,
    sendBulkEmail,

    // SMS
    sendSMS,
    sendBulkSMS,
    sendOTP,
    verifyOTP,

    // Operational Alerts
    sendAlarmNotification,
    sendCriticalAlarm,
    maintenanceNotification,
    batteryLowSOCAlert,
    generatorFaultAlert,
    gridOutageAlert,
    dailyOperationsSummary,
    weeklyOperationsReport,

    // Preferences
    getNotificationPreferences,
    updateNotificationPreferences,

    // History
    getNotificationHistory,

    // Templates
    getNotificationTemplates,
    createNotificationTemplate,
    updateNotificationTemplate,
    deleteNotificationTemplate,

    // Escalation
    getEscalationRules,
    updateEscalationRules,

    // Push
    sendPushNotification,

    // Administration
    notificationStatistics,
    sendTestNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    retryNotification,
    notificationHealth

};