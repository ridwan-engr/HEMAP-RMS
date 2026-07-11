import logger from "../../utils/logger.js";

import apiClient from "./alarmService.js";

class HuaweiSyncService {

    /**
     * Get all Huawei devices associated with an installation
     */
    async getDevices(installationId) {

        try {

            const response = await apiClient.get(

                `/huawei/installations/${installationId}/devices`

            );

            return response.data ?? [];

        }

        catch (error) {

            logger.error(

                `Unable to retrieve Huawei devices for ${installationId}`,

                error

            );

            return [];

        }

    }

    /**
     * Retrieve live telemetry
     */
    async getTelemetry(deviceId) {

        try {

            const response = await apiClient.get(

                `/huawei/devices/${deviceId}/telemetry`

            );

            return response.data;

        }

        catch (error) {

            logger.error(

                `Huawei telemetry failed for ${deviceId}`,

                error

            );

            return null;

        }

    }

    /**
     * Retrieve alarms
     */
    async getAlarms(deviceId) {

        try {

            const response = await apiClient.get(

                `/huawei/devices/${deviceId}/alarms`

            );

            return response.data ?? [];

        }

        catch (error) {

            logger.error(error);

            return [];

        }

    }

    /**
     * Retrieve configuration
     */
    async getConfiguration(deviceId) {

        try {

            const response = await apiClient.get(

                `/huawei/devices/${deviceId}/configuration`

            );

            return response.data;

        }

        catch (error) {

            logger.error(error);

            return null;

        }

    }

    /**
     * Retrieve device status
     */
    async getStatus(deviceId) {

        try {

            const response = await apiClient.get(

                `/huawei/devices/${deviceId}/status`

            );

            return response.data;

        }

        catch (error) {

            logger.error(error);

            return null;

        }

    }

    /**
     * Synchronize one Huawei device
     */
    async synchronizeDevice(deviceId) {

        const [

            telemetry,

            alarms,

            configuration,

            status

        ] = await Promise.all([

            this.getTelemetry(deviceId),

            this.getAlarms(deviceId),

            this.getConfiguration(deviceId),

            this.getStatus(deviceId)

        ]);

        return {

            deviceId,

            telemetry,

            alarms,

            configuration,

            status,

            synchronizedAt: new Date()

        };

    }

    /**
     * Synchronize all Huawei devices for an installation
     */
    async synchronizeInstallation(installationId) {

        const devices = await this.getDevices(installationId);

        const synchronized = [];

        for (const device of devices) {

            try {

                synchronized.push(

                    await this.synchronizeDevice(device.id)

                );

            }

            catch (error) {

                logger.error(error);

            }

        }

        return synchronized;

    }

}

export default new HuaweiSyncService();