/*
|--------------------------------------------------------------------------
| HEMAP Result Formatter
|--------------------------------------------------------------------------
|
| Normalizes the FastAPI optimization response into the format
| expected by MongoDB and the REST API.
|
*/

export function format(result) {

    if (!result) {

        throw new Error(
            "Optimization result is empty."
        );

    }

    return {

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

                Number(

                    result.solver?.solveTime ?? 0

                )

        },

        /*
        |--------------------------------------------------------------------------
        | Dispatch Schedule
        |--------------------------------------------------------------------------
        */

        dispatch:

            result.dispatch ?? [],

        /*
        |--------------------------------------------------------------------------
        | Energy Summary
        |--------------------------------------------------------------------------
        */

        energy: {

            load:

                Number(
                    result.energy?.load ?? 0
                ),

            solar:

                Number(
                    result.energy?.solar ?? 0
                ),

            generator:

                Number(
                    result.energy?.generator ?? 0
                ),

            gridImport:

                Number(
                    result.energy?.gridImport ?? 0
                ),

            gridExport:

                Number(
                    result.energy?.gridExport ?? 0
                ),

            batteryCharge:

                Number(
                    result.energy?.batteryCharge ?? 0
                ),

            batteryDischarge:

                Number(
                    result.energy?.batteryDischarge ?? 0
                ),

            renewableFraction:

                Number(
                    result.energy?.renewableFraction ?? 0
                )

        },

        /*
        |--------------------------------------------------------------------------
        | Economics
        |--------------------------------------------------------------------------
        */

        economics: {

            gridCost:

                Number(
                    result.economics?.gridCost ?? 0
                ),

            dieselCost:

                Number(
                    result.economics?.dieselCost ?? 0
                ),

            batteryCost:

                Number(
                    result.economics?.batteryCost ?? 0
                ),

            carbonCost:

                Number(
                    result.economics?.carbonCost ?? 0
                ),

            exportRevenue:

                Number(
                    result.economics?.exportRevenue ?? 0
                ),

            operatingCost:

                Number(
                    result.economics?.operatingCost ?? 0
                ),

            totalCost:

                Number(
                    result.economics?.totalCost ?? 0
                )

        },

        /*
        |--------------------------------------------------------------------------
        | Objectives
        |--------------------------------------------------------------------------
        */

        objectives: {

            totalCost:

                Number(
                    result.objectives?.totalCost ?? 0
                ),

            gridCost:

                Number(
                    result.objectives?.gridCost ?? 0
                ),

            dieselCost:

                Number(
                    result.objectives?.dieselCost ?? 0
                ),

            batteryCost:

                Number(
                    result.objectives?.batteryCost ?? 0
                ),

            carbonCost:

                Number(
                    result.objectives?.carbonCost ?? 0
                ),

            renewablePenalty:

                Number(
                    result.objectives?.renewablePenalty ?? 0
                )

        },

        /*
        |--------------------------------------------------------------------------
        | Reliability
        |--------------------------------------------------------------------------
        */

        reliability: {

            ens:

                Number(
                    result.reliability?.ens ?? 0
                ),

            lolp:

                Number(
                    result.reliability?.lolp ?? 0
                ),

            lole:

                Number(
                    result.reliability?.lole ?? 0
                ),

            saidi:

                Number(
                    result.reliability?.saidi ?? 0
                ),

            saifi:

                Number(
                    result.reliability?.saifi ?? 0
                ),

            availability:

                Number(
                    result.reliability?.availability ?? 0
                ),

            reliabilityIndex:

                Number(
                    result.reliability?.reliabilityIndex ?? 0
                )

        },

        /*
        |--------------------------------------------------------------------------
        | Emissions
        |--------------------------------------------------------------------------
        */

        emissions: {

            co2:

                Number(
                    result.emissions?.co2 ?? 0
                ),

            diesel:

                Number(
                    result.emissions?.diesel ?? 0
                )

        }

    };

}