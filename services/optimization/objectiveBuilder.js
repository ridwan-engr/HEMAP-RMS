/*
|--------------------------------------------------------------------------
| Default Objective Weights
|--------------------------------------------------------------------------
|
| The weights should sum to 1.0 for a balanced optimization.
| They can be overridden from the optimization request.
|
*/

const DEFAULT_WEIGHTS = {

    cost: 0.40,

    fuel: 0.15,

    emission: 0.10,

    renewable: 0.15,

    battery: 0.10,

    reliability: 0.10

};

/*
|--------------------------------------------------------------------------
| Build Objective Function
|--------------------------------------------------------------------------
*/

export function build(objectives = {}) {

    const weights = {

        ...DEFAULT_WEIGHTS,

        ...(objectives.weights || {})

    };

    return {

        /*
        |--------------------------------------------------------------------------
        | Enabled Objectives
        |--------------------------------------------------------------------------
        */

        minimizeCost:

            objectives.minimizeCost ?? true,

        minimizeFuel:

            objectives.minimizeFuel ?? false,

        minimizeEmission:

            objectives.minimizeEmission ?? false,

        maximizeRenewable:

            objectives.maximizeRenewable ?? false,

        maximizeBatteryLife:

            objectives.maximizeBatteryLife ?? false,

        maximizeReliability:

            objectives.maximizeReliability ?? false,

        /*
        |--------------------------------------------------------------------------
        | Objective Weights
        |--------------------------------------------------------------------------
        */

        weights

    };

}