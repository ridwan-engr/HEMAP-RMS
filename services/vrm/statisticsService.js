import { get } from "./apiClient.js";

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

    if (!installationId) {

        throw new Error(
            "Installation ID is required."
        );

    }

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

        throw new Error(

            `Unable to retrieve energy statistics: ${error.message}`

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