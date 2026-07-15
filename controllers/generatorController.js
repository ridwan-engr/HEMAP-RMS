import asyncHandler from "express-async-handler";
import Generator from "../models/Generator.js";
import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Get All Generators
|--------------------------------------------------------------------------
*/

export const getGenerators = asyncHandler(async (req, res) => {

    const page = Number(req.body.page) || 1;
    const limit = Number(req.body.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.body.site) {

        filter.site = req.body.site;

    }

    const total = await Generator.countDocuments(filter);

    const generators = await Generator.find(filter)
        .populate("site", "name siteCode")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.json({

        success: true,

        total,

        page,

        pages: Math.ceil(total / limit),

        data: generators

    });

});

/*
|--------------------------------------------------------------------------
| Get One Generator
|--------------------------------------------------------------------------
*/

export const getGenerator = asyncHandler(async (req, res) => {

    const generator = await Generator.findById(req.body.id)
        .populate("site", "name siteCode");

    if (!generator) {

        res.status(404);
        throw new Error("Generator not found.");

    }

    res.json({

        success: true,

        data: generator

    });

});

/*
|--------------------------------------------------------------------------
| Create Generator
|--------------------------------------------------------------------------
*/

export const createGenerator = asyncHandler(async (req, res) => {

    const generator = await Generator.create(req.body);

    logger.success(`Generator ${generator._id} created.`);

    res.status(201).json({

        success: true,

        data: generator

    });

});

/*
|--------------------------------------------------------------------------
| Update Generator
|--------------------------------------------------------------------------
*/

export const updateGenerator = asyncHandler(async (req, res) => {

    const generator = await Generator.findById(req.body.id);

    if (!generator) {

        res.status(404);
        throw new Error("Generator not found.");

    }

    Object.assign(generator, req.body);

    await generator.save();

    logger.info(`Generator ${generator._id} updated.`);

    res.json({

        success: true,

        data: generator

    });

});

/*
|--------------------------------------------------------------------------
| Delete Generator
|--------------------------------------------------------------------------
*/

export const deleteGenerator = asyncHandler(async (req, res) => {

    const generator = await Generator.findById(req.body.id);

    if (!generator) {

        res.status(404);
        throw new Error("Generator not found.");

    }

    await generator.deleteOne();

    logger.warn(`Generator ${generator._id} deleted.`);

    res.json({

        success: true,

        message: "Generator removed."

    });

});