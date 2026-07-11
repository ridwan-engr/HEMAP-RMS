import Solar from "../../models/Solar.js";

/*
|--------------------------------------------------------------------------
| Register Solar Array
|--------------------------------------------------------------------------
*/

export async function registerSolarArray(data) {

    return await Solar.create(data);

}

/*
|--------------------------------------------------------------------------
| Get All Solar Arrays
|--------------------------------------------------------------------------
*/

export async function getSolarArrays(filter = {}) {

    return await Solar.find(filter)
        .populate("site")
        .sort({
            createdAt: -1
        });

}

/*
|--------------------------------------------------------------------------
| Get One Solar Array
|--------------------------------------------------------------------------
*/

export async function getSolarArray(id) {

    return await Solar.findById(id)
        .populate("site");

}

/*
|--------------------------------------------------------------------------
| Update Solar Array
|--------------------------------------------------------------------------
*/

export async function updateSolarArray(id, updates) {

    return await Solar.findByIdAndUpdate(

        id,

        updates,

        {
            new: true,
            runValidators: true
        }

    ).populate("site");

}

/*
|--------------------------------------------------------------------------
| Delete Solar Array
|--------------------------------------------------------------------------
*/

export async function deleteSolarArray(id) {

    return await Solar.findByIdAndDelete(id);

}

/*
|--------------------------------------------------------------------------
| Installed Capacity
|--------------------------------------------------------------------------
*/

export async function calculateInstalledCapacity(siteId) {

    const arrays = await Solar.find({

        site: siteId

    });

    return arrays.reduce(

        (total, array) =>

            total + (array.installedCapacity || 0),

        0

    );

}

/*
|--------------------------------------------------------------------------
| Current Generation
|--------------------------------------------------------------------------
*/

export async function calculateCurrentGeneration(siteId) {

    const arrays = await Solar.find({

        site: siteId

    });

    return arrays.reduce(

        (total, array) =>

            total + (array.currentPower || 0),

        0

    );

}

/*
|--------------------------------------------------------------------------
| Daily Energy
|--------------------------------------------------------------------------
*/

export async function calculateDailyEnergy(siteId) {

    const arrays = await Solar.find({

        site: siteId

    });

    return arrays.reduce(

        (total, array) =>

            total + (array.dailyEnergy || 0),

        0

    );

}

/*
|--------------------------------------------------------------------------
| Monthly Energy
|--------------------------------------------------------------------------
*/

export async function calculateMonthlyEnergy(siteId) {

    const arrays = await Solar.find({

        site: siteId

    });

    return arrays.reduce(

        (total, array) =>

            total + (array.monthlyEnergy || 0),

        0

    );

}

/*
|--------------------------------------------------------------------------
| Solar Efficiency
|--------------------------------------------------------------------------
*/

export async function calculateSolarEfficiency(siteId) {

    const arrays = await Solar.find({

        site: siteId

    });

    if (!arrays.length) {

        return 0;

    }

    const total = arrays.reduce(

        (sum, array) =>

            sum + (array.inverterEfficiency || 0),

        0

    );

    return Number(

        (total / arrays.length).toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Performance Ratio
|--------------------------------------------------------------------------
*/

export async function calculatePerformanceRatio(siteId) {

    const arrays = await Solar.find({

        site: siteId

    });

    if (!arrays.length) {

        return 0;

    }

    let expectedPower = 0;

    let actualPower = 0;

    for (const array of arrays) {

        expectedPower +=

            (array.installedCapacity || 0) *

            ((array.irradiance || 0) / 1000);

        actualPower +=

            array.currentPower || 0;

    }

    if (expectedPower === 0) {

        return 0;

    }

    return Number(

        ((actualPower / expectedPower) * 100).toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Solar KPIs
|--------------------------------------------------------------------------
*/

export async function getSolarKPIs(siteId) {

    const [

        installedCapacity,

        currentGeneration,

        dailyEnergy,

        monthlyEnergy,

        efficiency,

        performanceRatio

    ] = await Promise.all([

        calculateInstalledCapacity(siteId),

        calculateCurrentGeneration(siteId),

        calculateDailyEnergy(siteId),

        calculateMonthlyEnergy(siteId),

        calculateSolarEfficiency(siteId),

        calculatePerformanceRatio(siteId)

    ]);

    return {

        installedCapacity,

        currentGeneration,

        dailyEnergy,

        monthlyEnergy,

        efficiency,

        performanceRatio

    };

}

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    registerSolarArray,

    getSolarArrays,

    getSolarArray,

    updateSolarArray,

    deleteSolarArray,

    calculateInstalledCapacity,

    calculateCurrentGeneration,

    calculateDailyEnergy,

    calculateMonthlyEnergy,

    calculateSolarEfficiency,

    calculatePerformanceRatio,

    getSolarKPIs

};