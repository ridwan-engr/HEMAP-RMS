import asyncHandler from "../utils/asyncHandler.js";
import Grid from "../models/Grid.js";
import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Get All Grids
|--------------------------------------------------------------------------
*/

export const getGrids = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.site) {
        filter.site = req.query.site;
    }

    const total = await Grid.countDocuments(filter);

    const grids = await Grid.find(filter)
        .populate("site", "name siteCode")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return res.status(200).json({
        success: true,
        message: "Grids retrieved successfully.",
        total,
        page,
        pages: Math.ceil(total / limit),
        data: grids
    });

});

/*
|--------------------------------------------------------------------------
| Get Grid
|--------------------------------------------------------------------------
*/

export const getGrid = asyncHandler(async (req, res) => {

    const grid = await Grid.findById(req.params.id)
        .populate("site", "name siteCode");

    if (!grid) {
        return res.status(404).json({
            success: false,
            message: "Grid not found."
        });
    }

    return res.status(200).json({
        success: true,
        message: "Grid retrieved successfully.",
        data: grid
    });

});

/*
|--------------------------------------------------------------------------
| Create Grid
|--------------------------------------------------------------------------
*/

export const createGrid = asyncHandler(async (req, res) => {

    const grid = await Grid.create(req.body);

    logger.info(`Grid ${grid._id} created.`);

    return res.status(201).json({
        success: true,
        message: "Grid created successfully.",
        data: grid
    });

});

/*
|--------------------------------------------------------------------------
| Update Grid
|--------------------------------------------------------------------------
*/

export const updateGrid = asyncHandler(async (req, res) => {

    const grid = await Grid.findById(req.params.id);

    if (!grid) {
        return res.status(404).json({
            success: false,
            message: "Grid not found."
        });
    }

    Object.assign(grid, req.body);

    await grid.save();

    logger.info(`Grid ${grid._id} updated.`);

    return res.status(200).json({
        success: true,
        message: "Grid updated successfully.",
        data: grid
    });

});

/*
|--------------------------------------------------------------------------
| Delete Grid
|--------------------------------------------------------------------------
*/

export const deleteGrid = asyncHandler(async (req, res) => {

    const grid = await Grid.findById(req.params.id);

    if (!grid) {
        return res.status(404).json({
            success: false,
            message: "Grid not found."
        });
    }

    await grid.deleteOne();

    logger.info(`Grid ${grid._id} deleted.`);

    return res.status(200).json({
        success: true,
        message: "Grid deleted successfully."
    });

});

export default {

    getGrids,

    getGrid,

    createGrid,

    updateGrid,

    deleteGrid
    
};