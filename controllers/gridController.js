import asyncHandler from "express-async-handler";
import Generator from "../models/Grid.js";
import logger from "../utils/logger.js";
import Grid from "../models/Grid.js";

/*
|--------------------------------------------------------------------------
| Get All Grids
|--------------------------------------------------------------------------
*/

export const getGrids = asyncHandler(async (req, res) => {

    const page = Number(req.body.page) || 1;
    const limit = Number(req.body.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.body.site) {

        filter.site = req.body.site;

    }

    const total = await Grid.countDocuments(filter);

    const grids = await Grid.find(filter)
        .populate("site", "name siteCode")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.json({

        success: true,

        total,

        page,

        pages: Math.ceil(total / limit),

        data: Grid

    });

});

/*
|--------------------------------------------------------------------------
| Get One Grid
|--------------------------------------------------------------------------
*/

export const getGrid = asyncHandler(async (req, res) => {

    const grid = await Grid.findById(req.body.id)
        .populate("site", "name siteCode");

    if (!grid) {

        res.status(404);
        throw new Error("Grid not found.");

    }

    res.json({

        success: true,

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

    logger.success(`Grid ${grid._id} created.`);

    res.status(201).json({

        success: true,

        data: grid

    });

});

/*
|--------------------------------------------------------------------------
| Update Grid
|--------------------------------------------------------------------------
*/

export const updateGrid = asyncHandler(async (req, res) => {

    const grid = await Grid.findById(req.body.id);

    if (!grid) {

        res.status(404);
        throw new Error("Grid not found.");

    }

    Object.assign(grid, req.body);

    await grid.save();

    logger.info(`Grid ${grid._id} updated.`);

    res.json({

        success: true,

        data: grid

    });

});

/*
|--------------------------------------------------------------------------
| Delete Grid
|--------------------------------------------------------------------------
*/

export const deleteGrid = asyncHandler(async (req, res) => {

    const grid = await Grid.findById(req.body.id);

    if (!grid) {

        res.status(404);
        throw new Error("Grid not found.");

    }

    await grid.deleteOne();

    logger.warn(`Grid ${grid._id} deleted.`);

    res.json({

        success: true,

        message: "Grid removed."

    });

});