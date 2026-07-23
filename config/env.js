import dotenv from "dotenv";

dotenv.config();

export const env = {

    nodeEnv:
        process.env.NODE_ENV || "development",

    port:
        Number(process.env.PORT || 3101),

    timezone:
        process.env.TZ || "Africa/Lagos",

    mongodbUri:
        process.env.MONGODB_URI,

    jwtSecret:
        process.env.JWT_SECRET,

    jwtExpiresIn:
        process.env.JWT_EXPIRES_IN || "7d",

    clientOrigins:
        process.env.CLIENT_ORIGIN
            ? process.env.CLIENT_ORIGIN
                .split(",")
                .map(origin => origin.trim())
            : ["http://localhost:5173"],

    /*
        |--------------------------------------------------------------------------
        | Victron VRM
        |--------------------------------------------------------------------------
        */

    vrmApiBaseUrl: process.env.VRM_API_BASE_URL,

    vrmAccessToken: process.env.VRM_ACCESS_TOKEN,

    vrmUserId: Number(process.env.VRM_USER_ID),

    vrmInstallationId: Number(process.env.VRM_INSTALLATION_ID),

    vrmSyncCron: process.env.VRM_SYNC_CRON || "*/1 * * * *",

    /*
    |--------------------------------------------------------------------------
    | Requests
    |--------------------------------------------------------------------------
    */

    requestTimeout: Number(process.env.REQUEST_TIMEOUT || 30000),

    /*
       |--------------------------------------------------------------------------
       | Mail
       |--------------------------------------------------------------------------
       */

    email: process.env.EMAIL_FROM,

    smtpHost: process.env.SMTP_HOST,

    smtpPort: Number(process.env.SMTP_PORT || 587),

    smtpUser: process.env.SMTP_USER,

    smtpPassword: process.env.SMTP_PASSWORD,

    smtpSecure: process.env.SMTP_SECURE === "true",

    /*
    |--------------------------------------------------------------------------
    | SMS Configuration
    |--------------------------------------------------------------------------
    */

    smsProvider: process.env.SMS_PROVIDER || "termii",

    smsApiKey: process.env.SMS_API_KEY,

    smsSenderId: process.env.SMS_SENDER_ID || "HEMAP",

    smsBaseUrl: process.env.SMS_BASE_URL,

    interval: process.env.OPTIMIZATION_INTERVAL || "15mins"

};

export default env;
