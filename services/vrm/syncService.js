import installationService from "./installationService.js";
import telemetryService from "./telemetryService.js";
import alarmService from "./alarmService.js";
import statisticsService from "./statisticsService.js";

import logger from "../../utils/logger.js";

class SyncService {

    /*
    |--------------------------------------------------------------------------
    | Installations
    |--------------------------------------------------------------------------
    */

    async getInstallations() {

        try {

            return await installationService.getInstallations();

        }

        catch (error) {

            logger.error({

                message: "Unable to retrieve installations.",

                error: error.message

            });

            return [];

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Live Telemetry
    |--------------------------------------------------------------------------
    */

    async getTelemetry(

        installationId

    ) {

        try {

            return await telemetryService.getLiveTelemetry(

                installationId

            );

        }

        catch (error) {

            logger.error({

                installationId,

                message: "Telemetry retrieval failed.",

                error: error.message

            });

            return null;

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Historical Telemetry
    |--------------------------------------------------------------------------
    */

    async getHistoricalTelemetry(

        installationId,

        start,

        end,

        interval = "15mins"

    ) {

        try {

            return await telemetryService.getHistoricalTelemetry(

                installationId,

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

                message: "Historical telemetry retrieval failed.",

                error: error.message

            });

            return [];

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Alarms
    |--------------------------------------------------------------------------
    */

    async getAlarms(

        installationId

    ) {

        try {

            return await alarmService.getActiveAlarms(

                installationId

            );

        }

        catch (error) {

            logger.error({

                installationId,

                message: "Alarm retrieval failed.",

                error: error.message

            });

            return [];

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    async getStatistics(

        installationId

    ) {

        try {

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

            logger.error({

                installationId,

                message: "Statistics retrieval failed.",

                error: error.message

            });

            return null;

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Synchronize One Installation
    |--------------------------------------------------------------------------
    */

    async synchronizeInstallation(

        installation

    ) {

        const installationId =

            installation.installationId;

        const [

            telemetry,

            alarms,

            statistics

        ] = await Promise.all([

            this.getTelemetry(

                installationId

            ),

            this.getAlarms(

                installationId

            ),

            this.getStatistics(

                installationId

            )

        ]);

        return {

            installation,

            telemetry,

            alarms,

            statistics,

            synchronizedAt: new Date()

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Synchronize All Installations
    |--------------------------------------------------------------------------
    */

    async synchronizeAll() {

        const installations =

            await this.getInstallations();

        const results = [];

        for (

            const installation

            of installations

        ) {

            try {

                results.push(

                    await this.synchronizeInstallation(

                        installation

                    )

                );

            }

            catch (error) {

                logger.error({

                    installationId:

                        installation.installationId,

                    message:

                        "Installation synchronization failed.",

                    error:

                        error.message

                });

            }

        }

        return results;

    }

}

export default new SyncService();