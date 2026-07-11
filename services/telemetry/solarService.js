import Solar from "../../models/Solar.js";
import Site from "../../models/Site.js";
import Telemetry from "../../models/Telemetry.js";
import Weather from "../../models/Weather.js";

/*
|--------------------------------------------------------------------------
| Create Solar Asset
|--------------------------------------------------------------------------
*/

export async function createSolar(data) {

    const site = await Site.findById(data.site);

    if (!site) {

        throw new Error(
            "Site not found."
        );

    }

    return await Solar.create(data);

}

/*
|--------------------------------------------------------------------------
| Get All Solar Assets
|--------------------------------------------------------------------------
*/

export async function getSolarSystems(filters = {}) {

    const query = {};

    if (filters.site) {

        query.site = filters.site;

    }

    if (filters.status) {

        query.status = filters.status;

    }

    return await Solar.find(query)

        .populate("site")

        .sort({

            createdAt: -1

        });

}

/*
|--------------------------------------------------------------------------
| Get Solar Asset
|--------------------------------------------------------------------------
*/

export async function getSolarById(id) {

    const solar = await Solar.findById(id)

        .populate("site");

    if (!solar) {

        throw new Error(
            "Solar system not found."
        );

    }

    return solar;

}

/*
|--------------------------------------------------------------------------
| Update Solar Asset
|--------------------------------------------------------------------------
*/

export async function updateSolar(

    id,

    payload

) {

    const solar = await Solar.findByIdAndUpdate(

        id,

        payload,

        {

            new: true,

            runValidators: true

        }

    ).populate("site");

    if (!solar) {

        throw new Error(
            "Solar system not found."
        );

    }

    return solar;

}

/*
|--------------------------------------------------------------------------
| Delete Solar Asset
|--------------------------------------------------------------------------
*/

export async function deleteSolar(id) {

    const solar = await Solar.findByIdAndDelete(id);

    if (!solar) {

        throw new Error(
            "Solar system not found."
        );

    }

    return solar;

}

/*
|--------------------------------------------------------------------------
| Latest Solar Telemetry
|--------------------------------------------------------------------------
*/

export async function getLatestSolarTelemetry(siteId) {

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

            telemetry.solarPower,

        inverter:

            telemetry.inverterPower,

        load:

            telemetry.loadPower,

        timestamp:

            telemetry.timestamp

    };

}

/*
|--------------------------------------------------------------------------
| Solar Production History
|--------------------------------------------------------------------------
*/

export async function getSolarHistory(

    siteId,

    limit = 500

) {

    return await Telemetry.find({

        site: siteId

    })

    .select(

        "timestamp solarPower"

    )

    .sort({

        timestamp: -1

    })

    .limit(limit);

}

/*
|--------------------------------------------------------------------------
| Calculate Solar Efficiency
|--------------------------------------------------------------------------
*/

export async function calculateSolarEfficiency(siteId) {

    const solar = await Solar.findOne({

        site: siteId

    });

    const telemetry = await getLatestSolarTelemetry(siteId);

    if (!solar || !telemetry) {

        return null;

    }

    const ratedPower = solar.capacity || 0;

    const efficiency =

        ratedPower > 0

            ? (telemetry.power / ratedPower) * 100

            : 0;

    return {

        ratedPower,

        outputPower: telemetry.power,

        efficiency:

            Number(efficiency.toFixed(2))

    };

}

/*
|--------------------------------------------------------------------------
| Calculate Performance Ratio
|--------------------------------------------------------------------------
*/

export async function calculatePerformanceRatio(siteId) {

    const weather = await Weather.findOne({

        site: siteId

    })

    .sort({

        timestamp: -1

    });

    const solar = await Solar.findOne({

        site: siteId

    });

    const telemetry = await getLatestSolarTelemetry(siteId);

    if (!weather || !solar || !telemetry) {

        return null;

    }

    const irradiance =

        weather.solarIrradiance || 0;

    const expectedPower =

        (irradiance / 1000) *

        (solar.capacity || 0);

    const ratio =

        expectedPower > 0

            ? telemetry.power / expectedPower

            : 0;

    return {

        irradiance,

        expectedPower,

        actualPower:

            telemetry.power,

        performanceRatio:

            Number(ratio.toFixed(3))

    };

}

/*
|--------------------------------------------------------------------------
| Estimate Daily Solar Energy
|--------------------------------------------------------------------------
*/

export async function estimateSolarEnergy(siteId) {

    const history = await Telemetry.find({

        site: siteId

    })

    .sort({

        timestamp: -1

    })

    .limit(288);

    if (!history.length) {

        return null;

    }

    const averagePower =

        history.reduce(

            (sum, item) =>

                sum +

                (item.solarPower ?? 0),

            0

        ) / history.length;

    return {

        estimatedDailyEnergy:

            Number(

                (

                    averagePower *

                    24 /

                    1000

                ).toFixed(2)

            )

    };

}

/*
|--------------------------------------------------------------------------
| Peak Solar Power
|--------------------------------------------------------------------------
*/

export async function getPeakSolarPower(siteId) {

    const record = await Telemetry.findOne({

        site: siteId

    })

    .sort({

        solarPower: -1

    });

    if (!record) {

        return null;

    }

    return {

        peakPower:

            record.solarPower,

        timestamp:

            record.timestamp

    };

}

/*
|--------------------------------------------------------------------------
| Update Solar Telemetry
|--------------------------------------------------------------------------
*/

export async function updateSolarTelemetry(

    siteId,

    telemetry

) {

    const solar = await Solar.findOne({

        site: siteId

    });

    if (!solar) {

        return null;

    }

    solar.lastPower = telemetry.solarPower;

    solar.lastUpdated = new Date();

    await solar.save();

    return solar;

}

/*
|--------------------------------------------------------------------------
| Solar KPIs
|--------------------------------------------------------------------------
*/

export async function getSolarKPIs(siteId) {

    const [

        efficiency,

        performance,

        energy,

        peak

    ] = await Promise.all([

        calculateSolarEfficiency(siteId),

        calculatePerformanceRatio(siteId),

        estimateSolarEnergy(siteId),

        getPeakSolarPower(siteId)

    ]);

    return {

        efficiency,

        performance,

        energy,

        peak

    };

}

/*
|--------------------------------------------------------------------------
| Solar Dashboard
|--------------------------------------------------------------------------
*/

export async function getSolarDashboard(siteId) {

    const [

        latest,

        history,

        kpis

    ] = await Promise.all([

        getLatestSolarTelemetry(siteId),

        getSolarHistory(siteId, 100),

        getSolarKPIs(siteId)

    ]);

    return {

        latest,

        history,

        kpis

    };

}

export default {

    createSolar,

    getSolarSystems,

    getSolarById,

    updateSolar,

    deleteSolar,

    getLatestSolarTelemetry,

    getSolarHistory,

    calculateSolarEfficiency,

    calculatePerformanceRatio,

    estimateSolarEnergy,

    getPeakSolarPower,

    updateSolarTelemetry,

    getSolarKPIs,

    getSolarDashboard

};