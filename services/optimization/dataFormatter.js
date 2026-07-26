/*
|--------------------------------------------------------------------------
| HEMAP Optimization Payload Formatter
|--------------------------------------------------------------------------
|
| Builds the payload expected by the FastAPI Optimization Service.
|
*/

function ensureArray(value, name) {

    if (!Array.isArray(value)) {

        throw new Error(`${name} must be an array.`);

    }

    return value;

}

function ensureObject(value, name) {

    if (

        value === null ||

        typeof value !== "object" ||

        Array.isArray(value)

    ) {

        throw new Error(`${name} must be an object.`);

    }

    return value;

}

export function format({

    telemetry,

    forecast,

    tariff,

    constraints,

    objectives,

    solver = {},

    optimization = {}

}) {

    const telemetryData = ensureArray(

        telemetry,

        "telemetry"

    );

    const forecastData = ensureArray(

        forecast,

        "forecast"

    );

    return {

        /*
        |--------------------------------------------------------------------------
        | Solver
        |--------------------------------------------------------------------------
        */

        solver: {

            name:

                (

                    solver.name ||

                    "highs"

                ).toLowerCase(),

            threads:

                solver.threads ?? 4,

            mipGap:

                solver.mipGap ?? 0.01,

            timeLimit:

                solver.timeLimit ?? 300

        },

        /*
        |--------------------------------------------------------------------------
        | Optimization Configuration
        |--------------------------------------------------------------------------
        */

        optimization: {

            carbonWeight:

                optimization.carbonWeight ?? 1,

            batteryWeight:

                optimization.batteryWeight ?? 1,

            renewableWeight:

                optimization.renewableWeight ?? 1,

            generatorStartPenalty:

                optimization.generatorStartPenalty ?? 2.5,

            curtailmentPenalty:

                optimization.curtailmentPenalty ?? 0.5,

            dieselEmissionFactor:

                optimization.dieselEmissionFactor ?? 2.68,

            gridEmissionFactor:

                optimization.gridEmissionFactor ?? 0.45

        },

        /*
        |--------------------------------------------------------------------------
        | Optional Scenario
        |--------------------------------------------------------------------------
        */

        scenario:

            optimization.scenario ??

            "BASE",

        /*
        |--------------------------------------------------------------------------
        | Time Series
        |--------------------------------------------------------------------------
        */

        telemetry:

            telemetryData,

        forecast:

            forecastData,

        /*
        |--------------------------------------------------------------------------
        | Tariff
        |--------------------------------------------------------------------------
        */

        tariff:

            ensureObject(

                tariff,

                "tariff"

            ),

        /*
        |--------------------------------------------------------------------------
        | Constraints
        |--------------------------------------------------------------------------
        */

        constraints:

            ensureObject(

                constraints,

                "constraints"

            ),

        /*
        |--------------------------------------------------------------------------
        | Objectives
        |--------------------------------------------------------------------------
        */

        objectives:

            ensureObject(

                objectives,

                "objectives"

            ),

        /*
        |--------------------------------------------------------------------------
        | Metadata
        |--------------------------------------------------------------------------
        */

        metadata: {

            generatedAt:

                new Date().toISOString(),

            horizon:

                telemetryData.length,

            interval:

                optimization.interval ??

                "15mins"

        }

    };

}