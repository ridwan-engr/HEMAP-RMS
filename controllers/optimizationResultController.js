import asyncHandler from "express-async-handler";

import OptimizationRun from "../models/OptimizationRun.js";

import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Get Optimization by ID
|--------------------------------------------------------------------------
*/

export const getOptimization = asyncHandler(async (req, res) => {

    const optimization = await OptimizationRun.findById(req.params.id)
        .populate("site", "name siteCode")
        .populate("createdBy", "firstName lastName")
        .lean();

    if (!optimization) {

        return res.status(404).json({

            success: false,

            message: "Optimization not found."

        });

    }

    res.json({

        success: true,

        data: optimization

    });

});


/*
|--------------------------------------------------------------------------
| Get Latest Optimization
|--------------------------------------------------------------------------
*/

export const getLatestOptimization = asyncHandler(async (req, res) => {

    const { siteId } = req.params;

    const optimization = await OptimizationRun.findOne({

        site: siteId,

        status: "COMPLETED"

    })

        .sort({

            createdAt: -1,

            _id: -1

        })

        .populate("site", "name siteCode")

        .lean();

    if (!optimization) {

        return res.status(404).json({

            success: false,

            message: "No optimization found."

        });

    }

    res.json({

        success: true,

        data: optimization

    });

});


/*
|--------------------------------------------------------------------------
| Optimization History
|--------------------------------------------------------------------------
*/

export const getOptimizationHistory = asyncHandler(async (req, res) => {

    const page = Number(req.query.page || 1);

    const limit = Number(req.query.limit || 20);

    const filter = {};

    if (req.query.site)

        filter.site = req.query.site;

    if (req.query.status)

        filter.status = req.query.status;

    const total = await OptimizationRun.countDocuments(filter);

    const history = await OptimizationRun.find(filter)

        .sort({

            createdAt: -1,

            _id: -1

        })

        .skip((page - 1) * limit)

        .limit(limit)

        .populate("site", "name siteCode")

        .populate("createdBy", "firstName lastName")

        .lean();

    res.json({

        success: true,

        total,

        page,

        pages: Math.ceil(total / limit),

        data: history

    });

});


/*
|--------------------------------------------------------------------------
| Dispatch Schedule
|--------------------------------------------------------------------------
*/

export const getDispatchSchedule = asyncHandler(async (req, res) => {

    const optimization = await OptimizationRun.findById(req.params.id)

        .select("dispatchSchedule")

        .lean();

    if (!optimization) {

        return res.status(404).json({

            success: false,

            message: "Optimization not found."

        });

    }

    res.json({

        success: true,

        data: optimization.dispatchSchedule ?? []

    });

});


/*
|--------------------------------------------------------------------------
| Energy Summary
|--------------------------------------------------------------------------
*/

export const getEnergySummary = asyncHandler(async (req, res) => {

    const optimization = await OptimizationRun.findById(req.params.id)

        .select("energy")

        .lean();

    if (!optimization) {

        return res.status(404).json({

            success: false,

            message: "Optimization not found."

        });

    }

    res.json({

        success: true,

        data: optimization.energy ?? {}

    });

});


/*
|--------------------------------------------------------------------------
| Economics
|--------------------------------------------------------------------------
*/

export const getEconomics = asyncHandler(async (req, res) => {

    const optimization = await OptimizationRun.findById(req.params.id)

        .select("economics")

        .lean();

    if (!optimization) {

        return res.status(404).json({

            success: false,

            message: "Optimization not found."

        });

    }

    res.json({

        success: true,

        data: optimization.economics ?? {}

    });

});


/*
|--------------------------------------------------------------------------
| Emissions
|--------------------------------------------------------------------------
*/

export const getEmissions = asyncHandler(async (req, res) => {

    const optimization = await OptimizationRun.findById(req.params.id)

        .select("emissions")

        .lean();

    if (!optimization) {

        return res.status(404).json({

            success: false,

            message: "Optimization not found."

        });

    }

    res.json({

        success: true,

        data: optimization.emissions ?? {}

    });

});


/*
|--------------------------------------------------------------------------
| Reliability
|--------------------------------------------------------------------------
*/

export const getReliability = asyncHandler(async (req, res) => {

    const optimization = await OptimizationRun.findById(req.params.id)

        .select("reliability")

        .lean();

    if (!optimization) {

        return res.status(404).json({

            success: false,

            message: "Optimization not found."

        });

    }

    res.json({

        success: true,

        data: optimization.reliability ?? {}

    });

});


/*
|--------------------------------------------------------------------------
| Solver Information
|--------------------------------------------------------------------------
*/

export const getSolver = asyncHandler(async (req, res) => {

    const optimization = await OptimizationRun.findById(req.params.id)

        .select("solver executionTime status")

        .lean();

    if (!optimization) {

        return res.status(404).json({

            success: false,

            message: "Optimization not found."

        });

    }

    res.json({

        success: true,

        data: {

            status: optimization.status,

            executionTime: optimization.executionTime,

            solver: optimization.solver

        }

    });

});


export default {

    getOptimization,

    getLatestOptimization,

    getOptimizationHistory,

    getDispatchSchedule,

    getEnergySummary,

    getEconomics,

    getEmissions,

    getReliability,

    getSolver

};