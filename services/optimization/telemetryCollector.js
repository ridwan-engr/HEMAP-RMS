import Site from "../../models/Site.js";
import Telemetry from "../../models/Telemetry.js";

import * as telemetryService from "../vrm/telemetryService.js";

import logger from "../../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function normalizePoint(point) {

    return {

        timestamp: new Date(point.timestamp).toISOString(),

        load:
            Number(point.loadPower ?? point.load ?? 0),

        solar:
            Number(point.solarPower ?? point.solar ?? 0),

        batterySOC:
            Math.min(
                100,
                Math.max(
                    0,
                    Number(point.batterySOC ?? 0)
                )
            ),

        generator:
            Number(
                point.generatorPower ??
                point.generator ??
                0
            ),

        grid:
            Number(
                point.gridPower ??
                point.grid ??
                0
            )

    };

}

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

    let telemetry = [];

    /*
    |--------------------------------------------------------------------------
    | Try VRM
    |--------------------------------------------------------------------------
    */

    try {

        telemetry =

            await telemetryService.getTelemetryHistory(

                site.installationId,

                {

                    start: startDate,

                    end: endDate,

                    interval:

                        process.env.OPTIMIZATION_INTERVAL ||

                        "15mins"

                }

            );

        logger.info(

            `Telemetry collected from VRM (${telemetry.length} records).`

        );

    }

    catch (error) {

        logger.warn(

            `VRM unavailable. Using cached telemetry. ${error.message}`

        );

    }

    /*
    |--------------------------------------------------------------------------
    | MongoDB Fallback
    |--------------------------------------------------------------------------
    */

    if (!telemetry || telemetry.length === 0) {

        telemetry =

            await Telemetry.find({

                site: siteId,

                timestamp: {

                    $gte: startDate,

                    $lte: endDate

                }

            })

            .sort({

                timestamp: 1

            })

            .lean();

    }

    /*
    |--------------------------------------------------------------------------
    | Validate
    |--------------------------------------------------------------------------
    */

    if (!telemetry || telemetry.length === 0) {

        throw new Error(

            "No telemetry available."

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Normalize
    |--------------------------------------------------------------------------
    */

    const normalized =

        telemetry

            .map(normalizePoint)

            .sort(

                (a, b) =>

                    new Date(a.timestamp)

                    -

                    new Date(b.timestamp)

            );

    logger.info(

        `Optimization telemetry ready (${normalized.length} samples).`

    );

    return normalized;

    
}