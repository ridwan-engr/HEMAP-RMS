import OptimizationRun from "../models/OptimizationRun.js";
import Site from "../models/Site.js";

import * as optimizerService from "../services/optimization/optimizerService.js";
import * as reportService from "../services/reports/reportService.js";

import logger from "../utils/logger.js";

export async function createOptimization(

    req,

    res,

    next

) {

    try {

        const {

            site,

            runType,

            optimizationPeriod,

            startDate,

            endDate,

            solver,

            objectives,

            constraints

        } = req.body;

        const siteExists = await Site.findById(site);

        if (!siteExists) {

            return res.status(404).json({

                success: false,

                message: "Site not found."

            });

        }

        const optimization = await OptimizationRun.create({

            site,

            createdBy: req.user._id,

            runType,

            optimizationPeriod,

            startDate,

            endDate,

            status: "PENDING"

        });

        optimizerService

            .runOptimization(

                optimization._id,

                {

                    solver,

                    objectives,

                    constraints

                }

            )

            .catch(logger.error);

        res.status(202).json({

            success: true,

            message: "Optimization started.",

            data: optimization

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

export async function getOptimization(

    req,

    res,

    next

) {

    try {

        const optimization = await OptimizationRun.findById(

            req.params.id

        )

        .populate(

            "site",

            "name siteCode"

        )

        .populate(

            "createdBy",

            "firstName lastName"

        );

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

    }

    catch (error) {

        next(error);

    }

}

export async function getOptimizationHistory(

    req,

    res,

    next

) {

    try {

        const {

            page = 1,

            limit = 20,

            site,

            status

        } = req.query;

        const filter = {};

        if (site)

            filter.site = site;

        if (status)

            filter.status = status;

        const total = await OptimizationRun.countDocuments(

            filter

        );

        const runs = await OptimizationRun.find(

            filter

        )

        .sort({

            createdAt: -1

        })

        .skip(

            (page - 1) * Number(limit)

        )

        .limit(

            Number(limit)

        )

        .populate(

            "site",

            "name"

        );

        res.json({

            success: true,

            total,

            page,

            pages: Math.ceil(

                total / limit

            ),

            data: runs

        });

    }

    catch (error) {

        next(error);

    }

}

export async function cancelOptimization(

    req,

    res,

    next

) {

    try {

        const optimization = await OptimizationRun.findById(

            req.params.id

        );

        if (!optimization) {

            return res.status(404).json({

                success: false,

                message: "Optimization not found."

            });

        }

        if (

            optimization.status === "COMPLETED"

        ) {

            return res.status(400).json({

                success: false,

                message: "Completed optimization cannot be cancelled."

            });

        }

        optimization.status = "CANCELLED";

        await optimization.save();

        res.json({

            success: true,

            message: "Optimization cancelled."

        });

    }

    catch (error) {

        next(error);

    }

}

export async function deleteOptimization(

    req,

    res,

    next

) {

    try {

        const optimization = await OptimizationRun.findById(

            req.params.id

        );

        if (!optimization) {

            return res.status(404).json({

                success: false,

                message: "Optimization not found."

            });

        }

        await optimization.deleteOne();

        res.json({

            success: true,

            message: "Optimization deleted."

        });

    }

    catch (error) {

        next(error);

    }

}

export async function exportOptimization(

    req,

    res,

    next

) {

    try {

        const report = await reportService.exportOptimization(

            req.params.id,

            req.body.format

        );

        res.json({

            success: true,

            data: report

        });

    }

    catch (error) {

        next(error);

    }

}

export default {

    createOptimization,

    getOptimization,

    getOptimizationHistory,

    cancelOptimization,

    deleteOptimization,

    exportOptimization

};