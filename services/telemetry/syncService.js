import Installation from "../../models/Installation.js";

import {
    synchronizeTelemetry
} from "../services/telemetry/telemetryService.js";

import statisticsService from "../analytics/statisticsService.js";

import logger from "../../utils/logger.js";

class SyncService {

    /**
     * Synchronize all installations
     */
    async synchronizeAll() {

        const installations = await Installation.find({
            status: "ACTIVE"
        }).lean();

        const updates = [];

        for (const installation of installations) {

            try {

                const telemetry =
                    await telemetryService.synchronizeTelemetry(
                        installation.installationId
                    );

                updates.push(telemetry);

            }

            catch (error) {

                logger.error({

                    installationId:
                        installation.installationId,

                    message:
                        error.message

                });

            }

        }

        await statisticsService.saveStatisticsSnapshot();

        return updates;

    }

    /**
     * Synchronize a single installation
     */
    async synchronizeInstallation(installationId) {

        return telemetryService.synchronizeTelemetry(
            installationId
        );

    }

    /**
     * Backward compatibility
     */
    async sync() {

        return this.synchronizeAll();

    }

}

export default new SyncService();