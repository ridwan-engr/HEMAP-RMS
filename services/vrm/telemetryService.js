import { get } from "./apiClient.js";
import logger from "../../utils/logger.js";

/**
 * Get latest installation statistics.
 *
 * These values are suitable for
 * dashboard KPIs and live monitoring.
 *
 * @param {number|string} installationId
 */
export async function getLiveTelemetry(

    installationId

) {

    if (!installationId) {

        throw new Error(
            "Installation ID is required."
        );

    }

    try {

        return await get(

            `/installations/${installationId}/stats`

        );

    }

    catch (error) {

        logger.error(error);

        throw error;

    }

}

/**
 * Get historical statistics.
 *
 * @param {number|string} installationId
 * @param {Object} options
 */
export async function getHistoricalTelemetry(

    installationId,

    {

        start,

        end,

        interval = "15mins"

    } = {}

) {

    if (!installationId) {

        throw new Error(
            "Installation ID is required."
        );

    }

    return await get(

        `/installations/${installationId}/stats`,

        {

            start,

            end,

            interval

        }

    );

}

/**
 * Get diagnostics.
 *
 * Includes battery,
 * inverter,
 * PV,
 * grid,
 * generator,
 * alarms,
 * etc.
 */
export async function getDiagnostics(

    installationId

) {

    if (!installationId) {

        throw new Error(
            "Installation ID is required."
        );

    }

    return await get(

        `/installations/${installationId}/diagnostics`

    );

}

export default {

    getLiveTelemetry,

    getHistoricalTelemetry,

    getDiagnostics

};