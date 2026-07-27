/*
|--------------------------------------------------------------------------
| HEMAP Optimization Result Formatter
|--------------------------------------------------------------------------
*/

function num(value) {
    return Number(value ?? 0);
}

function sum(items, key) {
    return items.reduce((total, item) => total + num(item[key]), 0);
}

function max(items, key) {
    return Math.max(...items.map(item => num(item[key])), 0);
}

function min(items, key) {
    return Math.min(...items.map(item => num(item[key])), 0);
}

function average(items, key) {

    if (!items.length) return 0;

    return sum(items, key) / items.length;

}

export function format(result) {

    if (!result) {

        throw new Error("Optimization result is empty.");

    }

    const dispatch = result.dispatch ?? [];

    /*
    |--------------------------------------------------------------------------
    | Derived KPIs
    |--------------------------------------------------------------------------
    */

    const batteryCharge = sum(dispatch, "batteryCharge");

    const batteryDischarge = sum(dispatch, "batteryDischarge");

    const generatorRuntime = dispatch.filter(

        d => num(d.generatorPower) > 0

    ).length;

    const generatorStarts = dispatch.reduce(

        (count, row, index) => {

            if (

                index === 0 ||

                dispatch[index - 1].generatorStatus === 0

            ) {

                if (row.generatorStatus === 1) {

                    count++;

                }

            }

            return count;

        },

        0

    );

    return {

        generatedAt: new Date(),

        /*
        |--------------------------------------------------------------------------
        | Solver
        |--------------------------------------------------------------------------
        */

        solver: {

            solver:

                result.solver?.solver ??

                "Unknown",

            status:

                result.solver?.status ??

                "UNKNOWN",

            terminationCondition:

                result.solver?.terminationCondition ??

                "UNKNOWN",

            solveTime:

                num(result.solver?.solveTime)

        },

        /*
        |--------------------------------------------------------------------------
        | Dispatch
        |--------------------------------------------------------------------------
        */

        dispatch,

        /*
        |--------------------------------------------------------------------------
        | Energy
        |--------------------------------------------------------------------------
        */

        energy: {

            load:

                num(result.energy?.load),

            solar:

                num(result.energy?.solar),

            generator:

                num(result.energy?.generator),

            gridImport:

                num(result.energy?.gridImport),

            gridExport:

                num(result.energy?.gridExport),

            batteryCharge,

            batteryDischarge,

            renewableFraction:

                num(result.energy?.renewableFraction)

        },

        /*
        |--------------------------------------------------------------------------
        | Economics
        |--------------------------------------------------------------------------
        */

        economics: {

            gridCost:

                num(result.economics?.gridCost),

            dieselCost:

                num(result.economics?.dieselCost),

            batteryCost:

                num(result.economics?.batteryCost),

            carbonCost:

                num(result.economics?.carbonCost),

            exportRevenue:

                num(result.economics?.exportRevenue),

            operatingCost:

                num(result.economics?.operatingCost),

            totalCost:

                num(result.economics?.totalCost)

        },

        /*
        |--------------------------------------------------------------------------
        | Reliability
        |--------------------------------------------------------------------------
        */

        reliability: {

            ens:

                num(result.reliability?.ens),

            lolp:

                num(result.reliability?.lolp),

            lole:

                num(result.reliability?.lole),

            saidi:

                num(result.reliability?.saidi),

            saifi:

                num(result.reliability?.saifi),

            availability:

                num(result.reliability?.availability),

            reliabilityIndex:

                num(result.reliability?.reliabilityIndex)

        },

        /*
        |--------------------------------------------------------------------------
        | Emissions
        |--------------------------------------------------------------------------
        */

        emissions: {

            co2:

                num(result.emissions?.co2),

            diesel:

                num(result.emissions?.diesel)

        },

        /*
        |--------------------------------------------------------------------------
        | Objectives
        |--------------------------------------------------------------------------
        */

        objectives: {

            totalCost:

                num(result.objectives?.totalCost),

            gridCost:

                num(result.objectives?.gridCost),

            dieselCost:

                num(result.objectives?.dieselCost),

            batteryCost:

                num(result.objectives?.batteryCost),

            carbonCost:

                num(result.objectives?.carbonCost),

            renewablePenalty:

                num(result.objectives?.renewablePenalty)

        },

        /*
        |--------------------------------------------------------------------------
        | Operational KPIs
        |--------------------------------------------------------------------------
        */

        kpis: {

            averageSOC:

                average(dispatch, "batterySOC"),

            minimumSOC:

                min(dispatch, "batterySOC"),

            maximumSOC:

                max(dispatch, "batterySOC"),

            peakGridImport:

                max(dispatch, "gridImport"),

            peakGridExport:

                max(dispatch, "gridExport"),

            generatorRuntime,

            generatorStarts,

            batteryThroughput:

                batteryCharge +

                batteryDischarge

        }

    };

}