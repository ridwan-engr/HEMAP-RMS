import { get } from "./apiClient.js";
import logger from "../../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Constants
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

/**
 * Get installation statistics.
 *
 * @param {number|string} installationId
 * @param {string|number} start
 * @param {string|number} end
 * @param {string} interval
 * @returns {Promise<Object>}
 */
export async function energyStatistics(

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

        return await get(

            `/installations/${installationId}/stats`,

            {

                start,

                end,

                interval

            }

        );

    }

    catch (error) {

        logger.error({

            installationId,

            endpoint: "/stats",

            start,

            end,

            interval,

            message: error.message,

            status: error.response?.status,

            data: error.response?.data

        });

        throw new Error(

            `Unable to retrieve energy statistics: ${error.message}`,

            {

                cause: error

            }

        );

    }

}

/**
 * Battery statistics.
 *
 * Battery information is extracted
 * from the VRM statistics payload.
 */
export async function batteryStatistics(

    installationId,

    start,

    end,

    interval = "15mins"

) {

    const stats = await energyStatistics(

        installationId,

        start,

        end,

        interval

    );

    return stats.battery ?? {};

}

/**
 * Solar statistics.
 *
 * PV information is extracted
 * from the VRM statistics payload.
 */
export async function solarStatistics(

    installationId,

    start,

    end,

    interval = "15mins"

) {

    const stats = await energyStatistics(

        installationId,

        start,

        end,

        interval

    );

    return stats.solar ?? {};

}

/**
 * Grid statistics.
 */
export async function gridStatistics(

    installationId,

    start,

    end,

    interval = "15mins"

) {

    const stats = await energyStatistics(

        installationId,

        start,

        end,

        interval

    );

    return stats.grid ?? {};

}

/**
 * Generator statistics.
 */
export async function generatorStatistics(

    installationId,

    start,

    end,

    interval = "15mins"

) {

    const stats = await energyStatistics(

        installationId,

        start,

        end,

        interval

    );

    return stats.generator ?? {};

}

export default {

    energyStatistics,

    batteryStatistics,

    solarStatistics,

    gridStatistics,

    generatorStatistics

};