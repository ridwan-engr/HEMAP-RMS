import asyncHandler from "express-async-handler";

import OptimizationResult from "../models/OptimizationResult.js";

import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Get Optimization Results
|--------------------------------------------------------------------------
*/

export const getOptimizations = asyncHandler(async (req, res) => {

    const page = Number(req.body.page) || 1;

    const limit = Number(req.body.limit) || 20;

    const skip = (page - 1) * limit;

    const filter = {};

    if (req.body.site) {

        filter.site = req.body.site;

    }

    if (req.body.algorithm) {

        filter.algorithm = req.body.algorithm;

    }

    if (req.body.status) {

        filter.status = req.body.status;

    }

    const total = await OptimizationResult.countDocuments(filter);

    const results = await OptimizationResult.find(filter)

        .populate("site", "name siteCode")

        .populate("forecast")

        .sort({

            createdAt: -1

        })

        .skip(skip)

        .limit(limit);

    res.json({

        success: true,

        total,

        page,

        pages: Math.ceil(total / limit),

        data: results

    });

});

/*
|--------------------------------------------------------------------------
| Get One Result
|--------------------------------------------------------------------------
*/

export const getOptimization = asyncHandler(async (req, res) => {

    const result = await OptimizationResult.findById(

        req.body.id

    )

        .populate("site", "name siteCode")

        .populate("forecast");

    if (!result) {

        res.status(404);

        throw new Error(

            "Optimization result not found."

        );

    }

    res.json({

        success: true,

        data: result

    });

});

/*
|--------------------------------------------------------------------------
| Create Result
|--------------------------------------------------------------------------
*/

export const createOptimization = asyncHandler(async (req, res) => {

    const result = await OptimizationResult.create(

        req.body

    );

    logger.success(

        `Optimization result ${result._id} created.`

    );

    res.status(201).json({

        success: true,

        data: result

    });

});

/*
|--------------------------------------------------------------------------
| Update Result
|--------------------------------------------------------------------------
*/

export const updateOptimization = asyncHandler(async (req, res) => {

    const result = await OptimizationResult.findById(

        req.body.id

    );

    if (!result) {

        res.status(404);

        throw new Error(

            "Optimization result not found."

        );

    }

    Object.assign(

        result,

        req.body

    );

    await result.save();

    logger.info(

        `Optimization result ${result._id} updated.`

    );

    res.json({

        success: true,

        data: result

    });

});

/*
|--------------------------------------------------------------------------
| Delete Result
|--------------------------------------------------------------------------
*/

export const deleteOptimization = asyncHandler(async (req, res) => {

    const result = await OptimizationResult.findById(

        req.body.id

    );

    if (!result) {

        res.status(404);

        throw new Error(

            "Optimization result not found."

        );

    }

    await result.deleteOne();

    logger.warn(

        `Optimization result ${result._id} deleted.`

    );

    res.json({

        success: true,

        message: "Optimization result removed."

    });

});

/*
|--------------------------------------------------------------------------
| Get Latest Result For Site
|--------------------------------------------------------------------------
*/

export const getLatestOptimization = asyncHandler(async (req, res) => {

    const { siteId } = req.body;

    const result = await OptimizationResult.findOne({

        site: siteId

    })

        .sort({

            createdAt: -1

        })

        .populate("site", "name siteCode")

        .populate("forecast");

    if (!result) {

        res.status(404);

        throw new Error(

            "No optimization result found."

        );

    }

    res.json({

        success: true,

        data: result

    });

});

/*
|--------------------------------------------------------------------------
| Get Optimization History
|--------------------------------------------------------------------------
*/

export const getOptimizationHistory = asyncHandler(async (req, res) => {

    const { siteId } = req.body;

    const history = await OptimizationResult.find({

        site: siteId

    })

        .sort({

            createdAt: -1

        })

        .populate("site", "name siteCode");

    res.json({

        success: true,

        count: history.length,

        data: history

    });

});

/*
|--------------------------------------------------------------------------
| Execute Optimization
|--------------------------------------------------------------------------
| Placeholder.
| This endpoint will later call the
| Pyomo optimization engine.
|--------------------------------------------------------------------------
*/

export const executeOptimization = asyncHandler(async (req, res) => {

    const { siteId } = req.body;

    logger.info(

        `Optimization requested for site ${siteId}.`

    );

    res.json({

        success: true,

        message:

            "Optimization request accepted.",

        siteId

    });

});

export default {

    getOptimizations,

    getOptimization,

    updateOptimization,

    createOptimization,

    deleteOptimization,

    getLatestOptimization,

    getOptimizationHistory,

    executeOptimization

};