import Site from "../../models/Site.js";

import * as forecastService from "../analytics/forecastService.js";

import logger from "../../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Collect Forecast Data
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
    | Get Forecast
    |--------------------------------------------------------------------------
    */

    const forecast = await forecastService.generateForecast({

        siteId,

        startDate,

        endDate

    });

    if (

        !forecast ||

        forecast.length === 0

    ) {

        throw new Error(

            "Forecast unavailable."

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Normalize
    |--------------------------------------------------------------------------
    */

    return forecast.map(item => ({

    timestamp: item.timestamp,

    expectedLoad: Number(
        item.expectedLoad || 0
    ),

    expectedSolar: Number(
        item.expectedSolar || 0
    ),

    irradiance: Number(
        item.irradiance || 0
    ),

    temperature: Number(
        item.temperature || 25
    )

}));
    
}