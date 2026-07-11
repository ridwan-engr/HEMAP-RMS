import installationService from "./installationService.js";
import telemetryService from "./telemetryService.js";
import alarmService from "./alarmService.js";
import statisticsService from "./statisticsService.js";

import logger from "../../utils/logger.js";

class SyncService {

    /**
     * Retrieve all active VRM installations
     */
    async getInstallations() {

        try {

            return await installationService.getInstallations();

        }

        catch (error) {

            logger.error(

                "Unable to retrieve installations.",

                error

            );

            return [];

        }

    }

    /**
     * Retrieve telemetry from one installation
     */
    async getTelemetry(installationId) {

        try {

            return await telemetryService.getLiveTelemetry(

                installationId

            );

        }

        catch (error) {

            logger.error(

                `Telemetry retrieval failed: ${installationId}`,

                error

            );

            return null;

        }

    }

    /**
     * Retrieve historical telemetry
     */
    async getHistoricalTelemetry(

        installationId,

        from,

        to

    ) {

        try {

            return await telemetryService.getHistoricalTelemetry(

                installationId,

                from,

                to

            );

        }

        catch (error) {

            logger.error(error);

            return [];

        }

    }

    /**
     * Retrieve alarms
     */
    async getAlarms(installationId) {

        try {

            return await alarmService.getActiveAlarms(

                installationId

            );

        }

        catch (error) {

            logger.error(error);

            return [];

        }

    }

    /**
     * Retrieve statistics
     */
    async getStatistics(installationId) {

    const [

        energy,

        battery,

        solar,

        grid,

        generator

    ] = await Promise.all([

        statisticsService.energyStatistics(

            installationId

        ),

        statisticsService.batteryStatistics(

            installationId

        ),

        statisticsService.solarStatistics(

            installationId

        ),

        statisticsService.gridStatistics(

            installationId

        ),

        statisticsService.generatorStatistics(

            installationId

        )

    ]);

    return {

        energy,

        battery,

        solar,

        grid,

        generator

    };

}

catch (error) {

        logger.error(

            `Statistics retrieval failed: ${installationId}`,

            error

        );

        return null;

    }



    /**
     * Synchronize one installation
     */
    async synchronizeInstallation(

        installation

    ) {

        const [

            telemetry,

            alarms,

            statistics

        ] = await Promise.all([

            this.getTelemetry(

                installation.InstallationId

            ),

            this.getAlarms(

                installation.InstallationId

            ),

            this.getStatistics(

                installation.InstallationId

            )

        ]);

        return {

            installation,

            telemetry,

            alarms,

            statistics,

            synchronizedAt:

                new Date()

        };

    }

    /**
     * Synchronize every installation
     */
    async synchronizeAll() {

        const installations =

            await this.getInstallations();

        const results = [];

        for (const installation of installations) {

            try {

                results.push(

                    await this.synchronizeInstallation(

                        installation

                    )

                );

            }

            catch (error) {

                logger.error(

                    installation.name,

                    error

                );

            }

        }

        return results;

    }

}

export default new SyncService();
