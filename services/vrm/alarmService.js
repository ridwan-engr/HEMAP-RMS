import { get } from "./apiClient.js";
import logger from "../../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

function validateRequest(

    installationId,

    start,

    end

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

}

/**
 * Get all active alarms for an installation.
 *
 * @param {number|string} installationId
 * @returns {Promise<Array>}
 */
export async function getActiveAlarms(

    installationId

) {

    validateRequest(

        installationId

    );

    try {

        const data = await get(

            `/installations/${installationId}/alarms`

        );

        return Array.isArray(data)

            ? data

            : (data.records ?? []);

    }

    catch (error) {

        logger.error({

            installationId,

            endpoint: "/alarms",

            message: error.message,

            status: error.response?.status,

            data: error.response?.data

        });

        throw new Error(

            `Unable to retrieve active alarms: ${error.message}`,

            {

                cause: error

            }

        );

    }

}

/**
 * Get alarm history.
 *
 * @param {number|string} installationId
 * @param {string|number} start
 * @param {string|number} end
 * @returns {Promise<Array>}
 */
export async function getAlarmHistory(

    installationId,

    start,

    end

) {

    validateRequest(

        installationId,

        start,

        end

    );

    try {

        const data = await get(

            `/installations/${installationId}/alarms`,

            {

                start,

                end

            }

        );

        return Array.isArray(data)

            ? data

            : (data.records ?? []);

    }

    catch (error) {

        logger.error({

            installationId,

            endpoint: "/alarms",

            start,

            end,

            message: error.message,

            status: error.response?.status,

            data: error.response?.data

        });

        throw new Error(

            `Unable to retrieve alarm history: ${error.message}`,

            {

                cause: error

            }

        );

    }

}

/**
 * Count active alarms.
 *
 * @param {number|string} installationId
 * @returns {Promise<number>}
 */
export async function countActiveAlarms(

    installationId

) {

    const alarms = await getActiveAlarms(

        installationId

    );

    return alarms.filter(

        alarm => alarm.cleared !== true

    ).length;

}

/**
 * Return only critical alarms.
 *
 * @param {number|string} installationId
 * @returns {Promise<Array>}
 */
export async function getCriticalAlarms(

    installationId

) {

    const alarms = await getActiveAlarms(

        installationId

    );

    return alarms.filter(

        alarm =>

            [

                "critical",

                "high"

            ].includes(

                String(

                    alarm.severity

                ).toLowerCase()

            )

    );

}

export default {

    getActiveAlarms,

    getAlarmHistory,

    countActiveAlarms,

    getCriticalAlarms

};