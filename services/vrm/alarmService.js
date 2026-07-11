import { get } from "./apiClient.js";

/**
 * Get all active alarms for an installation.
 *
 * @param {number|string} installationId
 * @returns {Promise<Array>}
 */
export async function getActiveAlarms(
    installationId
) {

    if (!installationId) {

        throw new Error(
            "Installation ID is required."
        );

    }

    try {

        const data = await get(

            `/installations/${installationId}/alarms`

        );

        return data.records ?? [];

    }

    catch (error) {

        throw new Error(

            `Unable to retrieve active alarms: ${error.message}`

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

    if (!installationId) {

        throw new Error(
            "Installation ID is required."
        );

    }

    try {

        const data = await get(

            `/installations/${installationId}/alarms`,

            {

                start,

                end

            }

        );

        return data.records ?? [];

    }

    catch (error) {

        throw new Error(

            `Unable to retrieve alarm history: ${error.message}`

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

        alarm =>

            alarm.cleared !== true

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