import Optimization from "../../models/Optimization.js";

/*
|--------------------------------------------------------------------------
| Run Optimization
|--------------------------------------------------------------------------
*/

export async function optimize(payload = {}, user) {

    const optimization = await Optimization.create({

        ...payload,

        status: "COMPLETED",

        optimizedBy: user._id,

        optimizedAt: new Date()

    });

    return getOptimizationById(

        optimization._id

    );

}

/*
|--------------------------------------------------------------------------
| Optimization Summary
|--------------------------------------------------------------------------
*/

export async function getOptimizationSummary(filters = {}) {

    const query = {};

    if (filters.siteId) {

        query.site = filters.siteId;

    }

    if (filters.installationId) {

        query.installation = filters.installationId;

    }

    if (filters.startDate || filters.endDate) {

        query.optimizedAt = {};

        if (filters.startDate) {

            query.optimizedAt.$gte = new Date(

                filters.startDate

            );

        }

        if (filters.endDate) {

            query.optimizedAt.$lte = new Date(

                filters.endDate

            );

        }

    }

    const records = await Optimization.find(query);

    return {

        totalOptimizations: records.length,

        completed: records.filter(

            item => item.status === "COMPLETED"

        ).length,

        pending: records.filter(

            item => item.status === "PENDING"

        ).length,

        failed: records.filter(

            item => item.status === "FAILED"

        ).length,

        records

    };

}

/*
|--------------------------------------------------------------------------
| Optimization History
|--------------------------------------------------------------------------
*/

export async function getOptimizationHistory(filters = {}) {

    const query = {};

    if (filters.siteId) {

        query.site = filters.siteId;

    }

    if (filters.installationId) {

        query.installation = filters.installationId;

    }

    return Optimization.find(query)

        .populate(

            "site"

        )

        .populate(

            "installation"

        )

        .populate(

            "optimizedBy",

            "firstName lastName email"

        )

        .sort({

            optimizedAt: -1

        });

}

/*
|--------------------------------------------------------------------------
| Optimization Details
|--------------------------------------------------------------------------
*/

export async function getOptimizationById(

    optimizationId

) {

    const optimization = await Optimization.findById(

        optimizationId

    )

    .populate(

        "site"

    )

    .populate(

        "installation"

    )

    .populate(

        "optimizedBy",

        "firstName lastName email"

    );

    if (!optimization) {

        throw new Error(

            "Optimization record not found."

        );

    }

    return optimization;

}

/*
|--------------------------------------------------------------------------
| Delete Optimization
|--------------------------------------------------------------------------
*/

export async function deleteOptimization(

    optimizationId

) {

    const optimization = await getOptimizationById(

        optimizationId

    );

    await optimization.deleteOne();

    return true;

}

export default {

    optimize,

    getOptimizationSummary,

    getOptimizationHistory,

    getOptimizationById,

    deleteOptimization

};