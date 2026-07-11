import SystemSetting from "../models/SystemSetting.js";
import logger from "../utils/logger.js";

/**
 * Create System Setting
 */
export async function createSetting(req, res, next) {

    try {

        const setting = await SystemSetting.create(req.body);

        logger.success(
            `System setting created: ${setting._id}`
        );

        return res.status(201).json({
            success: true,
            data: setting
        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/**
 * Get All System Settings
 */
export async function getSettings(req, res, next) {

    try {

        const settings = await SystemSetting
            .find()
            .sort({
                category: 1,
                key: 1
            });

        return res.json({

            success: true,

            count: settings.length,

            data: settings

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/**
 * Get System Setting by ID
 */
export async function getSetting(req, res, next) {

    try {

        const setting = await SystemSetting.findById(
            req.params.id
        );

        if (!setting) {

            return res.status(404).json({

                success: false,

                message: "System setting not found."

            });

        }

        return res.json({

            success: true,

            data: setting

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/**
 * Get Setting by Key
 */
export async function getSystemSettingByKey(req, res, next) {

    try {

        const setting = await SystemSetting.findOne({

            key: req.params.key

        });

        if (!setting) {

            return res.status(404).json({

                success: false,

                message: "System setting not found."

            });

        }

        return res.json({

            success: true,

            data: setting

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/**
 * Update Setting by ID
 */
export async function updateSetting(req, res, next) {

    try {

        const setting = await SystemSetting.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new: true,

                runValidators: true

            }

        );

        if (!setting) {

            return res.status(404).json({

                success: false,

                message: "System setting not found."

            });

        }

        logger.success(
            `System setting updated: ${setting._id}`
        );

        return res.json({

            success: true,

            data: setting

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/**
 * Update Setting by Key
 */
export async function updateSystemSettingByKey(req, res, next) {

    try {

        const setting = await SystemSetting.findOneAndUpdate(

            {

                key: req.params.key

            },

            req.body,

            {

                new: true,

                runValidators: true

            }

        );

        if (!setting) {

            return res.status(404).json({

                success: false,

                message: "System setting not found."

            });

        }

        logger.success(
            `System setting updated: ${setting.key}`
        );

        return res.json({

            success: true,

            data: setting

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/**
 * Delete System Setting
 */
export async function deleteSetting(req, res, next) {

    try {

        const setting = await SystemSetting.findByIdAndDelete(

            req.params.id

        );

        if (!setting) {

            return res.status(404).json({

                success: false,

                message: "System setting not found."

            });

        }

        logger.success(
            `System setting deleted: ${req.params.id}`
        );

        return res.json({

            success: true,

            message: "System setting deleted successfully."

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/**
 * Initialize Default Settings
 */
export async function initializeDefaults(req, res, next) {

    try {

        const defaults = [

            {
                category: "system",
                key: "timezone",
                value: "Africa/Lagos",
                description: "Application timezone"
            },

            {
                category: "system",
                key: "vrmSyncInterval",
                value: "*/1 * * * *",
                description: "VRM synchronization schedule"
            },

            {
                category: "dashboard",
                key: "refreshInterval",
                value: 30,
                description: "Dashboard refresh interval (seconds)"
            }

        ];

        for (const item of defaults) {

            await SystemSetting.updateOne(

                {

                    key: item.key

                },

                item,

                {

                    upsert: true

                }

            );

        }

        return res.json({

            success: true,

            message: "Default system settings initialized."

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

export default {

    createSetting,

    getSettings,

    getSetting,

    getSystemSettingByKey,

    updateSetting,

    updateSystemSettingByKey,

    deleteSetting,

    initializeDefaults

};