import { v4 as uuidv4 } from "uuid";

import { collect as collectTelemetry } from "./telemetryCollector.js";
import { collect as collectForecast } from "./forecastCollector.js";
import { collect as collectTariff } from "./tariffCollector.js";

import { collect as collectSiteConfiguration } from "./siteConfigurationService.js";

import buildConstraints from "./constraintBuilder.js";
import build from "./objectiveBuilder.js";

/*
|--------------------------------------------------------------------------
| Build Optimization Payload
|--------------------------------------------------------------------------
|
| Builds the complete OptimizationRequest expected by the
| FastAPI Optimization Service.
|
*/

export async function buildOptimizationPayload({

    siteId,

    startDate,

    endDate,

    scenario = "NORMAL",

    userId = null

}) {

    /*
    |--------------------------------------------------------------------------
    | Collect Live Telemetry (VRM)
    |--------------------------------------------------------------------------
    */

    const telemetry = await collectTelemetry(siteId);

    /*
    |--------------------------------------------------------------------------
    | Collect Forecast
    |--------------------------------------------------------------------------
    */

    const forecast = await collectForecast(

        siteId,

        startDate,

        endDate

    );

    /*
    |--------------------------------------------------------------------------
    | Tariff
    |--------------------------------------------------------------------------
    */

    const tariff = await collectTariff(siteId);

    /*
    |--------------------------------------------------------------------------
    | Site Configuration
    |--------------------------------------------------------------------------
    */

    const configuration = await collectSiteConfiguration(siteId);

    /*
    |--------------------------------------------------------------------------
    | Constraints
    |--------------------------------------------------------------------------
    */

    const constraints = buildConstraints(configuration);

    /*
    |--------------------------------------------------------------------------
    | Objectives
    |--------------------------------------------------------------------------
    */

    const objectives = build(configuration);

    /*
    |--------------------------------------------------------------------------
    | Solver
    |--------------------------------------------------------------------------
    */

    const solver = {

        name: "highs",

        threads: 4,

        mipGap: 0.01,

        timeLimit: 300

    };

    /*
    |--------------------------------------------------------------------------
    | Metadata
    |--------------------------------------------------------------------------
    */

    const metadata = {

        siteId,

        scenario,

        userId,

        requestId: uuidv4()

    };

    /*
    |--------------------------------------------------------------------------
    | Return Payload
    |--------------------------------------------------------------------------
    */

    return {

        telemetry,

        forecast,

        tariff,

        constraints,

        objectives,

        solver,

        metadata

    };

}

export default {

    buildOptimizationPayload

};