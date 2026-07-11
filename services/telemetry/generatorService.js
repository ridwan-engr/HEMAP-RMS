import Generator from "../../models/Generator.js";
import Site from "../../models/Site.js";
import Telemetry from "../../models/Telemetry.js";

/*
|--------------------------------------------------------------------------
| Create Generator
|--------------------------------------------------------------------------
*/

export async function createGenerator(data) {

    const site = await Site.findById(data.site);

    if (!site) {

        throw new Error(
            "Site not found."
        );

    }

    return await Generator.create(data);

}

/*
|--------------------------------------------------------------------------
| Get All Generators
|--------------------------------------------------------------------------
*/

export async function getGenerators(filters = {}) {

    const query = {};

    if (filters.site) {

        query.site = filters.site;

    }

    if (filters.status) {

        query.status = filters.status;

    }

    return await Generator.find(query)

        .populate("site")

        .sort({

            createdAt: -1

        });

}

/*
|--------------------------------------------------------------------------
| Get Generator By ID
|--------------------------------------------------------------------------
*/

export async function getGeneratorById(id) {

    const generator = await Generator.findById(id)

        .populate("site");

    if (!generator) {

        throw new Error(
            "Generator not found."
        );

    }

    return generator;

}

/*
|--------------------------------------------------------------------------
| Update Generator
|--------------------------------------------------------------------------
*/

export async function updateGenerator(

    id,

    payload

) {

    const generator = await Generator.findByIdAndUpdate(

        id,

        payload,

        {

            new: true,

            runValidators: true

        }

    ).populate("site");

    if (!generator) {

        throw new Error(
            "Generator not found."
        );

    }

    return generator;

}

/*
|--------------------------------------------------------------------------
| Delete Generator
|--------------------------------------------------------------------------
*/

export async function deleteGenerator(id) {

    const generator = await Generator.findByIdAndDelete(id);

    if (!generator) {

        throw new Error(
            "Generator not found."
        );

    }

    return generator;

}

/*
|--------------------------------------------------------------------------
| Latest Generator Telemetry
|--------------------------------------------------------------------------
*/

export async function getLatestGeneratorStatus(siteId) {

    const telemetry = await Telemetry.findOne({

        site: siteId

    })

    .sort({

        timestamp: -1

    });

    if (!telemetry) {

        return null;

    }

    return {

        power:

            telemetry.generatorPower,

        load:

            telemetry.loadPower,

        frequency:

            telemetry.frequency,

        timestamp:

            telemetry.timestamp

    };

}

/*
|--------------------------------------------------------------------------
| Generator History
|--------------------------------------------------------------------------
*/

export async function getGeneratorHistory(

    siteId,

    limit = 500

) {

    return await Telemetry.find({

        site: siteId

    })

    .select(

        "timestamp generatorPower"

    )

    .sort({

        timestamp: -1

    })

    .limit(limit);

}

/*
|--------------------------------------------------------------------------
| Calculate Generator Runtime
|--------------------------------------------------------------------------
*/

export async function calculateGeneratorRuntime(siteId) {

    const history = await Telemetry.find({

        site: siteId,

        generatorPower: { $gt: 0 }

    }).sort({

        timestamp: 1

    });

    if (!history.length) {

        return {

            runtimeHours: 0

        };

    }

    /*
        Assumes 5-minute telemetry interval.
        Replace with timestamp integration for
        production deployments.
    */

    const runtimeHours =

        (history.length * 5) / 60;

    return {

        runtimeHours:

            Number(runtimeHours.toFixed(2))

    };

}

/*
|--------------------------------------------------------------------------
| Estimate Fuel Consumption
|--------------------------------------------------------------------------
*/

export async function estimateFuelConsumption(siteId) {

    const generator = await Generator.findOne({

        site: siteId

    });

    const runtime = await calculateGeneratorRuntime(

        siteId

    );

    if (!generator || !runtime) {

        return null;

    }

    /*
        Generator model should expose
        fuelConsumptionRate (L/hr)
    */

    const rate =

        generator.fuelConsumptionRate ?? 0;

    const litres =

        runtime.runtimeHours * rate;

    return {

        runtimeHours:

            runtime.runtimeHours,

        fuelRate:

            rate,

        estimatedFuel:

            Number(litres.toFixed(2))

    };

}

/*
|--------------------------------------------------------------------------
| Generator Efficiency
|--------------------------------------------------------------------------
*/

export async function calculateGeneratorEfficiency(siteId) {

    const telemetry = await getLatestGeneratorStatus(

        siteId

    );

    const generator = await Generator.findOne({

        site: siteId

    });

    if (!telemetry || !generator) {

        return null;

    }

    const ratedPower =

        generator.capacity ?? 0;

    const efficiency =

        ratedPower > 0

            ? (telemetry.power / ratedPower) * 100

            : 0;

    return {

        ratedPower,

        outputPower:

            telemetry.power,

        efficiency:

            Number(efficiency.toFixed(2))

    };

}

/*
|--------------------------------------------------------------------------
| Peak Generator Load
|--------------------------------------------------------------------------
*/

export async function getPeakGeneratorLoad(siteId) {

    const record = await Telemetry.findOne({

        site: siteId

    })

    .sort({

        generatorPower: -1

    });

    if (!record) {

        return null;

    }

    return {

        peakPower:

            record.generatorPower,

        timestamp:

            record.timestamp

    };

}

/*
|--------------------------------------------------------------------------
| Update Generator Telemetry
|--------------------------------------------------------------------------
*/

export async function updateGeneratorTelemetry(

    siteId,

    telemetry

) {

    const generator = await Generator.findOne({

        site: siteId

    });

    if (!generator) {

        return null;

    }

    generator.lastPower =

        telemetry.generatorPower;

    generator.lastRuntime =

        new Date();

    generator.lastUpdated =

        new Date();

    await generator.save();

    return generator;

}

/*
|--------------------------------------------------------------------------
| Generator KPIs
|--------------------------------------------------------------------------
*/

export async function getGeneratorKPIs(siteId) {

    const [

        runtime,

        fuel,

        efficiency,

        peak

    ] = await Promise.all([

        calculateGeneratorRuntime(siteId),

        estimateFuelConsumption(siteId),

        calculateGeneratorEfficiency(siteId),

        getPeakGeneratorLoad(siteId)

    ]);

    return {

        runtime,

        fuel,

        efficiency,

        peak

    };

}

/*
|--------------------------------------------------------------------------
| Generator Dashboard
|--------------------------------------------------------------------------
*/

export async function getGeneratorDashboard(siteId) {

    const [

        latest,

        history,

        kpis

    ] = await Promise.all([

        getLatestGeneratorStatus(siteId),

        getGeneratorHistory(siteId, 100),

        getGeneratorKPIs(siteId)

    ]);

    return {

        latest,

        history,

        kpis

    };

}

export default {

    createGenerator,

    getGenerators,

    getGeneratorById,

    updateGenerator,

    deleteGenerator,

    getLatestGeneratorStatus,

    getGeneratorHistory,

    calculateGeneratorRuntime,

    estimateFuelConsumption,

    calculateGeneratorEfficiency,

    getPeakGeneratorLoad,

    updateGeneratorTelemetry,

    getGeneratorKPIs,

    getGeneratorDashboard

};