import Site from "../../models/Site.js";

import * as telemetryService from "../vrm/telemetryService.js";

import logger from "../../utils/logger.js";

import { env } from "../../config/env.js";

/*
|--------------------------------------------------------------------------
| Collect Telemetry
|--------------------------------------------------------------------------
*/

export async function collect(

    siteId,

    startDate,

    endDate

) {

    const site = await Site.findById(siteId);

    if (!site) {

        throw new Error("Site not found.");

    }

    /*
    |--------------------------------------------------------------------------
    | Retrieve Telemetry
    |--------------------------------------------------------------------------
    */

    const telemetry = await telemetryService.getTelemetryHistory(

        site.installationId,

        {

            start: startDate,

            end: endDate,

            interval: process.env.OPTIMIZATION_INTERVAL || "15mins"

        }

    );

    /*
    |--------------------------------------------------------------------------
    | Empty Dataset
    |--------------------------------------------------------------------------
    */

    if (

        !telemetry ||

        telemetry.length === 0

    ) {

        throw new Error(

            "No telemetry available."

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Normalize
    |--------------------------------------------------------------------------
    */

    return telemetry.map(point => ({

    timestamp: point.timestamp,

    load: Number(point.loadPower || 0),

    solar: Number(point.solarPower || 0),

    batterySOC: Number(point.batterySOC || 0),

    generator: Number(point.generatorPower || 0),

    grid: Number(point.gridPower || 0)

}));

}
