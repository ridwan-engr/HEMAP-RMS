import asyncHandler from "express-async-handler";

import Maintenance from "../models/Maintenance.js";

import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Create Maintenance Record
|--------------------------------------------------------------------------
*/

export const createMaintenance = asyncHandler(async (req, res) => {

    const maintenance = await Maintenance.create(req.body);

    logger.success(

        `Maintenance ${maintenance._id} created.`

    );

    res.status(201).json({

        success: true,

        data: maintenance

    });

});

/*
|--------------------------------------------------------------------------
| Get All Maintenance Records
|--------------------------------------------------------------------------
*/

export const getMaintenanceRecords = asyncHandler(async (req, res) => {

    const records = await Maintenance.find()

        .populate("site")

        .populate("device")

        .populate("assignedTo")

        .sort({

            scheduledDate: -1

        });

    res.json({

        success: true,

        count: records.length,

        data: records

    });

});

/*
|--------------------------------------------------------------------------
| Get Maintenance By ID
|--------------------------------------------------------------------------
*/

export const getMaintenanceById = asyncHandler(async (req, res) => {

    const maintenance = await Maintenance.findById(req.body.id)

        .populate("site")

        .populate("device")

        .populate("assignedTo");

    if (!maintenance) {

        res.status(404);

        throw new Error(

            "Maintenance record not found."

        );

    }

    res.json({

        success: true,

        data: maintenance

    });

});

/*
|--------------------------------------------------------------------------
| Get Maintenance By Site
|--------------------------------------------------------------------------
*/

export const getMaintenanceBySite = asyncHandler(async (req, res) => {

    const records = await Maintenance.find({

        site: req.body.siteId

    })

    .populate("device")

    .populate("assignedTo")

    .sort({

        scheduledDate: -1

    });

    res.json({

        success: true,

        count: records.length,

        data: records

    });

});

/*
|--------------------------------------------------------------------------
| Update Maintenance
|--------------------------------------------------------------------------
*/

export const updateMaintenance = asyncHandler(async (req, res) => {

    const maintenance = await Maintenance.findById(req.body.id);

    if (!maintenance) {

        res.status(404);

        throw new Error(

            "Maintenance record not found."

        );

    }

    Object.assign(

        maintenance,

        req.body

    );

    await maintenance.save();

    logger.success(

        `Maintenance ${maintenance._id} updated.`

    );

    res.json({

        success: true,

        data: maintenance

    });

});

/*
|--------------------------------------------------------------------------
| Complete Maintenance
|--------------------------------------------------------------------------
*/

export const completeMaintenance = asyncHandler(async (req, res) => {

    const maintenance = await Maintenance.findById(req.body.id);

    if (!maintenance) {

        res.status(404);

        throw new Error(

            "Maintenance record not found."

        );

    }

    maintenance.status = "COMPLETED";

    maintenance.completedDate = new Date();

    if (req.body.actualHours !== undefined) {

        maintenance.actualHours = req.body.actualHours;

    }

    if (req.body.remarks) {

        maintenance.remarks = req.body.remarks;

    }

    if (req.body.cost !== undefined) {

        maintenance.cost = req.body.cost;

    }

    await maintenance.save();

    logger.success(

        `Maintenance ${maintenance._id} completed.`

    );

    res.json({

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

    const maintenance = await Maintenance.findById(req.body.id);

    if (!maintenance) {

        res.status(404);

        throw new Error(

            "Maintenance record not found."

        );

    }

    await maintenance.deleteOne();

    logger.success(

        `Maintenance ${maintenance._id} deleted.`

    );

    res.json({

        success: true,

        message: "Maintenance deleted successfully."

    });

});

export default {

    createMaintenance,

    getMaintenanceRecords,

    getMaintenanceById,

    getMaintenanceBySite,

    updateMaintenance,

    completeMaintenance,

    deleteMaintenance

};