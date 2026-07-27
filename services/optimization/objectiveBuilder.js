/*
|--------------------------------------------------------------------------
| HEMAP Objective Builder
|--------------------------------------------------------------------------
|
| Builds the optimization objective weights expected by the
| FastAPI OptimizationRequest schema.
|
| Output
| ------
| objectives
|   └── weights
|         ├── cost
|         ├── battery
|         ├── emission
|         ├── renewable
|         └── reliability
|
*/

const DEFAULT_WEIGHTS = {

    cost: 0.40,

    battery: 0.15,

    emission: 0.15,

    renewable: 0.15,

    reliability: 0.15

};


/*
|--------------------------------------------------------------------------
| Normalize Weight
|--------------------------------------------------------------------------
*/

function normalize(value, fallback) {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;

}


/*
|--------------------------------------------------------------------------
| Normalize Total Weight
|--------------------------------------------------------------------------
*/

function normalizeWeights(weights) {

    const total =
        Object.values(weights)
            .reduce((sum, value) => sum + value, 0);

    if (total <= 0) {

        return { ...DEFAULT_WEIGHTS };

    }

    return {

        cost: Number((weights.cost / total).toFixed(4)),

        battery: Number((weights.battery / total).toFixed(4)),

        emission: Number((weights.emission / total).toFixed(4)),

        renewable: Number((weights.renewable / total).toFixed(4)),

        reliability: Number((weights.reliability / total).toFixed(4))

    };

}


/*
|--------------------------------------------------------------------------
| Build Objectives
|--------------------------------------------------------------------------
*/

export function build(userObjectives = {}) {

    const weights = {

        cost: normalize(
            userObjectives.cost,
            DEFAULT_WEIGHTS.cost
        ),

        battery: normalize(
            userObjectives.battery,
            DEFAULT_WEIGHTS.battery
        ),

        emission: normalize(
            userObjectives.emission,
            DEFAULT_WEIGHTS.emission
        ),

        renewable: normalize(
            userObjectives.renewable,
            DEFAULT_WEIGHTS.renewable
        ),

        reliability: normalize(
            userObjectives.reliability,
            DEFAULT_WEIGHTS.reliability
        )

    };

    return {

        weights: normalizeWeights(weights)

    };

}


export default {

    build

};