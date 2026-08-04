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

/**
 * Get latest installation statistics.
 *
 * Suitable for dashboard KPIs and live monitoring.
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

        logger.error({

            installationId,

            endpoint: "/stats",

            message: error.message,

            status: error.response?.status,

            data: error.response?.data

        });

        throw error;

    }

}

/**
 * Get historical telemetry.
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

        throw error;

    }

}

/**
 * Get installation diagnostics.
 *
 * Includes:
 * - Battery
 * - Inverter
 * - PV
 * - Grid
 * - Generator
 * - Alarms
 * - System health
 *
 * @param {number|string} installationId
 */
export async function getDiagnostics(

    installationId

) {

    if (!installationId) {

        throw new Error(

            "Installation ID is required."

        );

    }

    try {

        return await get(

            `/installations/${installationId}/diagnostics`

        );

    }

    catch (error) {

        logger.error({

            installationId,

            endpoint: "/diagnostics",

            message: error.message,

            status: error.response?.status,

            data: error.response?.data

        });

        throw error;

    }

}

export default {

    getLiveTelemetry,

    getHistoricalTelemetry,

    getDiagnostics

};