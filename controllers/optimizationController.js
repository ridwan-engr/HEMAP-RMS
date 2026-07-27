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

            solver,

            objectives,

            constraints,

            status: "PENDING"

        });

        setImmediate(async () => {

            try {

                await optimizerService.runOptimization(

                    optimization._id,

                    {
                        solver,
                        objectives,
                        constraints,
                        userId: req.user._id,
                        siteId: site
                    }
                )
            }

            catch (error) {

                logger.error(error);

            }

        });

        res.status(202).json({

            success: true,

            message: "Optimization started.",

            data: {

                optimizationId: optimization._id,

                status: optimization.status,

                site: optimization.site,

                createdAt: optimization.createdAt

            }

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

                createdAt: -1,

                _id: -1

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

            ["COMPLETED", "FAILED", "CANCELLED"]

                .includes(optimization.status)

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

        await OptimizationRun.findByIdAndDelete(

            req.params.id

        );

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

export async function getLatestOptimization(req,res,next){

    try{

        const latest=

        await OptimizationRun

        .findOne()

        .sort({

            createdAt:-1

        })

        .populate("site","name")

        .lean();

        if(!latest){

            return res.status(404).json({

                success:false,

                message:"No optimization found."

            });

        }

        res.json({

            success:true,

            data:latest

        });

    }

    catch(error){

        next(error);

    }

}

export default {

    createOptimization,

    getOptimization,

    getOptimizationHistory,

    cancelOptimization,

    deleteOptimization,

    exportOptimization,

    getLatestOptimization

};