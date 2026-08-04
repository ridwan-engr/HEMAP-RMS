import Site from "../../models/Site.js";

import * as solarForecastService from "../analytics/forecastService.js";
import * as loadForecastService from "./loadForecastService.js";

import logger from "../../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Forecast Collector
|--------------------------------------------------------------------------
*/

export async function getForecast(

    siteId,

    startDate,

    endDate

) {

    logger.info(`Collecting forecast for site ${siteId}`);

    const site = await Site.findById(siteId).lean();

    if (!site) {

        throw new Error("Site not found.");

    }

    /*
    |--------------------------------------------------------------------------
    | Collect forecasts in parallel
    |--------------------------------------------------------------------------
    */

    const [

        solarForecast,

        loadForecast

    ] = await Promise.all([

        solarforecastService.getForecastDashboard({

            siteId,

            startDate,

            endDate

        }),

        loadForecastService.forecast(

            siteId,

            startDate,

            endDate

        )

    ]);

    if (

        !Array.isArray(solarForecast) ||

        !solarForecast.length

    ) {

        throw new Error(

            "Solar forecast unavailable."

        );

    }

    if (

        !Array.isArray(loadForecast) ||

        !loadForecast.length

    ) {

        throw new Error(

            "Load forecast unavailable."

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Merge
    |--------------------------------------------------------------------------
    */

    const normalized = solarForecast.map(

        (solar, index) => ({

            timestamp:

                new Date(

                    solar.timestamp

                ).toISOString(),

            expectedSolar:

                Number(

                    solar.expectedSolar ??

                    0

                ),

            expectedLoad:

                Number(

                    loadForecast[index]?.expectedLoad ??

                    0

                ),

            irradiance:

                Number(

                    solar.irradiance ??

                    0

                ),

            temperature:

                Number(

                    solar.temperature ??

                    25

                )

        })

    );

    logger.info(

        `Collected ${normalized.length} forecast records.`

    );

    return normalized;

}

/*
|--------------------------------------------------------------------------
| Backward Compatibility
|--------------------------------------------------------------------------
*/

export const collect = getForecast;

export default {

    getForecast,

    collect

};