import Telemetry from "../../models/Telemetry.js";

import logger from "../../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Simple Moving Average Forecast
|--------------------------------------------------------------------------
*/

function movingAverage(values) {

    if (!values.length) {

        return 0;

    }

    return (

        values.reduce(

            (sum, value) => sum + value,

            0

        )

        /

        values.length

    );

}

/*
|--------------------------------------------------------------------------
| Forecast Load
|--------------------------------------------------------------------------
*/

export async function forecast(

    siteId,

    startDate,

    endDate,

    horizon = 24

) {

    const history = await Telemetry.find({

        site: siteId,

        timestamp: {

            $lte: startDate

        }

    })

    .sort({

        timestamp: -1

    })

    .limit(96)

    .lean();

    if (!history.length) {

        logger.warn(

            "No telemetry history available. Using zero forecast."

        );

        return [];

    }

    const averageLoad = movingAverage(

        history.map(

            item =>

                Number(

                    item.loadPower ??

                    item.load ??

                    0

                )

        )

    );

    const forecast = [];

    let current = new Date(startDate);

    for (

        let i = 0;

        i < horizon;

        i++

    ) {

        forecast.push({

            timestamp:

                new Date(current),

            expectedLoad:

                averageLoad

        });

        current = new Date(

            current.getTime()

            +

            15 * 60 * 1000

        );

    }

    logger.info(

        `Generated ${forecast.length} load forecast points.`

    );

    return forecast;

}