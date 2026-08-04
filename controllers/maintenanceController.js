import asyncHandler from "../utils/asyncHandler.js";

import * as maintenanceService from "../services/maintenance/maintenanceService.js";

/*
|--------------------------------------------------------------------------
| Maintenance Schedule
|--------------------------------------------------------------------------
*/

export const getMaintenanceSchedule = asyncHandler(async (req, res) => {

    const schedule = await maintenanceService.getMaintenanceSchedule(

        req.query

    );

    return res.status(200).json({

        success: true,

        message: "Maintenance schedule retrieved successfully.",

        data: schedule

    });

});

/*
|--------------------------------------------------------------------------
| Maintenance History
|--------------------------------------------------------------------------
*/

export const getMaintenanceHistory = asyncHandler(async (req, res) => {

    const history = await maintenanceService.getMaintenanceHistory(

        req.query

    );

    return res.status(200).json({

        success: true,

        message: "Maintenance history retrieved successfully.",

        data: history

    });

});

/*
|--------------------------------------------------------------------------
| Maintenance Details
|--------------------------------------------------------------------------
*/

export const getMaintenanceById = asyncHandler(async (req, res) => {

    const maintenance = await maintenanceService.getMaintenanceById(

        req.params.maintenanceId

    );

    return res.status(200).json({

        success: true,

        message: "Maintenance record retrieved successfully.",

        data: maintenance

    });

});

/*
|--------------------------------------------------------------------------
| Create Maintenance
|--------------------------------------------------------------------------
*/

export const createMaintenance = asyncHandler(async (req, res) => {

    const maintenance = await maintenanceService.createMaintenance(

        req.body,

        req.user

    );

    return res.status(201).json({

        success: true,

        message: "Maintenance record created successfully.",

        data: maintenance

    });

});

/*
|--------------------------------------------------------------------------
| Update Maintenance
|--------------------------------------------------------------------------
*/

export const updateMaintenance = asyncHandler(async (req, res) => {

    const maintenance = await maintenanceService.updateMaintenance(

        req.params.maintenanceId,

        req.body,

        req.user

    );

    return res.status(200).json({

        success: true,

        message: "Maintenance record updated successfully.",

        data: maintenance

    });

});

/*
|--------------------------------------------------------------------------
| Complete Maintenance
|--------------------------------------------------------------------------
*/

export const completeMaintenance = asyncHandler(async (req, res) => {

    const maintenance = await maintenanceService.completeMaintenance(

        req.params.maintenanceId,

        req.body,

        req.user

    );

    return res.status(200).json({

        success: true,

        message: "Maintenance completed successfully.",

        data: maintenance

    });

});

/*
|--------------------------------------------------------------------------
| Delete Maintenance
|--------------------------------------------------------------------------
*/

export const deleteMaintenance = asyncHandler(async (req, res) => {

    await maintenanceService.deleteMaintenance(

        req.params.maintenanceId

    );

    return res.status(200).json({

        success: true,

        message: "Maintenance record deleted successfully."

    });

});

export default {

    getMaintenanceSchedule,

    getMaintenanceHistory,

    getMaintenanceById,

    createMaintenance,

    updateMaintenance,

    completeMaintenance,

    deleteMaintenance

};