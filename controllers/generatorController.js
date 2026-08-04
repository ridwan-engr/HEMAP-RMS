import asyncHandler from "../utils/asyncHandler.js";
import Generator from "../models/Generator.js";
import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Get All Generators
|--------------------------------------------------------------------------
*/

export const getGenerators = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.site) {
        filter.site = req.query.site;
    }

    const total = await Generator.countDocuments(filter);

    const generators = await Generator.find(filter)
        .populate("site", "name siteCode")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return res.status(200).json({
        success: true,
        message: "Generators retrieved successfully.",
        total,
        page,
        pages: Math.ceil(total / limit),
        data: generators
    });

});

/*
|--------------------------------------------------------------------------
| Get Generator
|--------------------------------------------------------------------------
*/

export const getGenerator = asyncHandler(async (req, res) => {

    const generator = await Generator.findById(req.params.id)
        .populate("site", "name siteCode");

    if (!generator) {
        return res.status(404).json({
            success: false,
            message: "Generator not found."
        });
    }

    return res.status(200).json({
        success: true,
        message: "Generator retrieved successfully.",
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

    logger.info(`Generator ${generator._id} created.`);

    return res.status(201).json({
        success: true,
        message: "Generator created successfully.",
        data: generator
    });

});

/*
|--------------------------------------------------------------------------
| Update Generator
|--------------------------------------------------------------------------
*/

export const updateGenerator = asyncHandler(async (req, res) => {

    const generator = await Generator.findById(req.params.id);

    if (!generator) {
        return res.status(404).json({
            success: false,
            message: "Generator not found."
        });
    }

    Object.assign(generator, req.body);

    await generator.save();

    logger.info(`Generator ${generator._id} updated.`);

    return res.status(200).json({
        success: true,
        message: "Generator updated successfully.",
        data: generator
    });

});

/*
|--------------------------------------------------------------------------
| Delete Generator
|--------------------------------------------------------------------------
*/

export const deleteGenerator = asyncHandler(async (req, res) => {

    const generator = await Generator.findById(req.params.id);

    if (!generator) {
        return res.status(404).json({
            success: false,
            message: "Generator not found."
        });
    }

    await generator.deleteOne();

    logger.info(`Generator ${generator._id} deleted.`);

    return res.status(200).json({
        success: true,
        message: "Generator deleted successfully."
    });

});

export default {

    getGenerators,

    getGenerator,

    createGenerator,

    updateGenerator,

    deleteGenerator
    
};