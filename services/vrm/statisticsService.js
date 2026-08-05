import { get } from "./apiClient.js";
import logger from "../../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Supported intervals
|--------------------------------------------------------------------------
*/

const ALLOWED_INTERVALS = [

    "15mins",

    "hour",

    "day"

];

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

function validateRequest(

    installationId,

    start,

    end,

    interval

) {

    if (!installationId) {

        throw new Error(

            "Installation ID is required."

        );

    }

    if (

        start &&

        end &&

        new Date(start) > new Date(end)

    ) {

        throw new Error(

            "Start date cannot be later than end date."

        );

    }

    if (

        !ALLOWED_INTERVALS.includes(interval)

    ) {

        throw new Error(

            `Unsupported interval: ${interval}`

        );

    }

}

/*
|--------------------------------------------------------------------------
| Fetch raw statistics
|--------------------------------------------------------------------------
*/

export async function getStatistics(

    installationId,

    start,

    end,

    interval = "15mins"

) {

    validateRequest(

        installationId,

        start,

        end,

        interval

    );

    try {

        const response = await get(

            `/installations/${installationId}/stats`,

            {

                start,

                end,

                interval

            }

        );

        return response.records ?? {};

    }

    catch (error) {

        logger.error({

            installationId,

            endpoint: "/stats",

            start,

            end,

            interval,

            status: error.response?.status,

            data: error.response?.data,

            message: error.message

        });

        throw error;

    }

}

/*
|--------------------------------------------------------------------------
| Fetch totals only
|--------------------------------------------------------------------------
*/

export async function getTotals(

    installationId,

    start,

    end,

    interval = "15mins"

) {

    validateRequest(

        installationId,

        start,

        end,

        interval

    );

    const response = await get(

        `/installations/${installationId}/stats`,

        {

            start,

            end,

            interval

        }

    );

    return response.totals ?? {};

}

/*
|--------------------------------------------------------------------------
| Battery statistics
|--------------------------------------------------------------------------
*/

export async function batteryStatistics(

    installationId,

    start,

    end,

    interval = "15mins"

) {

    const stats = await getStatistics(

        installationId,

        start,

        end,

        interval

    );

    return {

        soc: stats.bs ?? [],

        voltage: stats.bv ?? []

    };

}

/*
|--------------------------------------------------------------------------
| Solar statistics
|--------------------------------------------------------------------------
*/

export async function solarStatistics(

    installationId,

    start,

    end,

    interval = "15mins"

) {

    const stats = await getStatistics(

        installationId,

        start,

        end,

        interval

    );

    return {

        yield: stats.total_solar_yield ?? []

    };

}

/*
|--------------------------------------------------------------------------
| Consumption statistics
|--------------------------------------------------------------------------
*/

export async function consumptionStatistics(

    installationId,

    start,

    end,

    interval = "15mins"

) {

    const stats = await getStatistics(

        installationId,

        start,

        end,

        interval

    );

    return stats.total_consumption ?? [];

}

/*
|--------------------------------------------------------------------------
| Generator statistics
|--------------------------------------------------------------------------
*/

export async function generatorStatistics(

    installationId,

    start,

    end,

    interval = "15mins"

) {

    const stats = await getStatistics(

        installationId,

        start,

        end,

        interval

    );

    return stats.total_genset ?? [];

}

export default {

    getStatistics,

    getTotals,

    batteryStatistics,

    solarStatistics,

    consumptionStatistics,

    generatorStatistics

};