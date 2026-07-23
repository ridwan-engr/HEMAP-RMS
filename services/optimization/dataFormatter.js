/*
|--------------------------------------------------------------------------
| Build Pyomo Input Payload
|--------------------------------------------------------------------------
|
| This service converts telemetry, forecasts, tariffs,
| constraints, and objectives into the JSON payload expected
| by the Python optimization engine.
|
*/

export function format({

    optimization,

    telemetry,

    forecast,

    tariff,

    constraints,

    objectives,

    solver

}) {

    return {

        version: "1.0",

        createdAt: new Date().toISOString(),

        metadata: {

            optimizationId: optimization._id,

            siteId: optimization.site,

            optimizationPeriod: optimization.optimizationPeriod,

            startDate: optimization.startDate,

            endDate: optimization.endDate

        },


        solver,

        /*
        |--------------------------------------------------------------------------
        | Time-Series Data
        |--------------------------------------------------------------------------
        */

        telemetry,

        forecast,

        /*
        |--------------------------------------------------------------------------
        | Economic Parameters
        |--------------------------------------------------------------------------
        */

        tariff,

        /*
        |--------------------------------------------------------------------------
        | Optimization Model
        |--------------------------------------------------------------------------
        */

        constraints,

        objectives

    };

}