/*
|--------------------------------------------------------------------------
| HEMAP Objective Builder
|--------------------------------------------------------------------------
|
| Builds an Objectives object compatible with the FastAPI
| OptimizationRequest schema.
|
*/

const DEFAULT_WEIGHTS = {

    cost: 0.40,

    battery: 0.15,

    emission: 0.15,

    renewable: 0.15,

    reliability: 0.15

};

export function build(objectives = {}) {

    return {

        weights: {

            ...DEFAULT_WEIGHTS,

            ...(objectives.weights || {})

        }

    };

}