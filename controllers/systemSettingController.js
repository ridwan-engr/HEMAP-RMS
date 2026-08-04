import asyncHandler from "../utils/asyncHandler.js";
import SystemSetting from "../models/SystemSetting.js";

/*
|--------------------------------------------------------------------------
| Create System Setting
|--------------------------------------------------------------------------
*/

export const createSetting = asyncHandler(async (req, res) => {

    const setting = await SystemSetting.create(req.body);

    return res.status(201).json({

        success: true,

        message: "System setting created successfully.",

        data: setting

    });

});

/*
|--------------------------------------------------------------------------
| Get All System Settings
|--------------------------------------------------------------------------
*/

export const getSettings = asyncHandler(async (req, res) => {

    const settings = await SystemSetting.find()

        .sort({

            category: 1,

            key: 1

        });

    return res.status(200).json({

        success: true,

        message: "System settings retrieved successfully.",

        count: settings.length,

        data: settings

    });

});

/*
|--------------------------------------------------------------------------
| Get System Setting By ID
|--------------------------------------------------------------------------
*/

export const getSetting = asyncHandler(async (req, res) => {

    const setting = await SystemSetting.findById(

        req.params.id

    );

    if (!setting) {

        return res.status(404).json({

            success: false,

            message: "System setting not found."

        });

    }

    return res.status(200).json({

        success: true,

        message: "System setting retrieved successfully.",

        data: setting

    });

});

/*
|--------------------------------------------------------------------------
| Get System Setting By Key
|--------------------------------------------------------------------------
*/

export const getSystemSettingByKey = asyncHandler(async (req, res) => {

    const setting = await SystemSetting.findOne({

        key: req.params.key

    });

    if (!setting) {

        return res.status(404).json({

            success: false,

            message: "System setting not found."

        });

    }

    return res.status(200).json({

        success: true,

        message: "System setting retrieved successfully.",

        data: setting

    });

});

/*
|--------------------------------------------------------------------------
| Update Setting By ID
|--------------------------------------------------------------------------
*/

export const updateSetting = asyncHandler(async (req, res) => {

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

    return res.status(200).json({

        success: true,

        message: "System setting updated successfully.",

        data: setting

    });

});

/*
|--------------------------------------------------------------------------
| Update Setting By Key
|--------------------------------------------------------------------------
*/

export const updateSystemSettingByKey = asyncHandler(async (req, res) => {

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

    return res.status(200).json({

        success: true,

        message: "System setting updated successfully.",

        data: setting

    });

});

/*
|--------------------------------------------------------------------------
| Delete Setting
|--------------------------------------------------------------------------
*/

export const deleteSetting = asyncHandler(async (req, res) => {

    const setting = await SystemSetting.findByIdAndDelete(

        req.params.id

    );

    if (!setting) {

        return res.status(404).json({

            success: false,

            message: "System setting not found."

        });

    }

    return res.status(200).json({

        success: true,

        message: "System setting deleted successfully."

    });

});

/*
|--------------------------------------------------------------------------
| Initialize Default Settings
|--------------------------------------------------------------------------
*/

export const initializeDefaults = asyncHandler(async (req, res) => {

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

    return res.status(200).json({

        success: true,

        message: "Default system settings initialized successfully."

    });

});

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