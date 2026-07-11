import Installation from "../../models/Installation.js";
import Telemetry from "../../models/Telemetry.js";

import telemetryService from "./telemetryService.js";
import normalizeTelemetry from "./normalize.js";
import vrmSyncService from "./syncService.js";
import huaweiSyncService from "./huaweiSyncService.js";

import statisticsService from "../analytics/statisticsService.js";

import logger from "../../utils/logger.js";

class VRMSyncService {

    /**
     * Synchronize every active installation
     */
    async sync() {

        const installations = await Installation.find({

            status: "ACTIVE"

        });

        const synchronized = [];

        for (const installation of installations) {

            try {

                const rawTelemetry = {

                    vrm: vrmTelemetry,

                    huawei: huaweiTelemetry

                };
                const [

                    vrmTelemetry,

                    huaweiTelemetry

                ] = await Promise.all([

                    VRMSyncService.getTelemetry(

                        installation.vrmInstallationId

                    ),

                    huaweiSyncService.synchronizeInstallation(

                        installation._id

                    )

                ]);

                if (!rawTelemetry) {

                    continue;

                }

                const normalized = normalizeTelemetry(

                    rawTelemetry,

                    installation

                );

                await Telemetry.findOneAndUpdate(

                    {

                        installation:

                            installation._id

                    },

                    normalized,

                    {

                        new: true,

                        upsert: true

                    }

                );

                synchronized.push(

                    normalized

                );

            }

            catch (error) {

                logger.error(

                    `Synchronization failed for ${installation.name}`,

                    error

                );

            }

        }

        try {

            await statisticsService
                .saveStatisticsSnapshot();

        }

        catch (error) {

            logger.error(error);

        }

        return synchronized;

    }

}

export default new TelemetrySyncService();