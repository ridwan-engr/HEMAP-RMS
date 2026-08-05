import Installation from "../../models/Installation.js";
import Telemetry from "../../models/Telemetry.js";

import * as installationService from "./installationService.js";
import * as telemetryService from "./telemetryService.js";

import statisticsService from "../analytics/statisticsService.js";

import { normalizeTelemetry } from "./normalize.js";

import logger from "../../utils/logger.js";

class SyncService {
    /**
     * Synchronize every installation from VRM
     */
    async synchronizeAll() {

        const installations = await Installation.find({
            installationId: { $exists: true, $ne: null }
        }).lean();

        const updates = [];

        for (const installation of installations) {

            try {

                logger.info({
                    installationId: installation.installationId,
                    message: "Synchronizing installation..."
                });

                const dashboard =
                    await telemetryService.getLiveTelemetry(
                        installation.installationId
                    );

                const statistics =
                    await telemetryService.getHistoricalTelemetry(
                        installation.installationId
                    );

                const normalized =
                    normalizeTelemetry(
                        installation,
                        dashboard,
                        [],
                        statistics
                    );

                const saved =
                    await Telemetry.findOneAndUpdate(
                        {
                            installation: installation._id
                        },
                        normalized,
                        {
                            upsert: true,
                            returnDocument: "after"
                        }
                    );

                updates.push(saved);

            } catch (error) {

                logger.error({
                    installationId: installation.installationId,
                    message: error.message
                });

            }

        }

        try {
            await statisticsService.saveStatisticsSnapshot();
        } catch (error) {
            logger.warn({
                message: "Statistics snapshot failed.",
                error: error.message
            });
        }

        return updates;
    }

    /**
     * Alias for backward compatibility
     */
    async sync() {
        return this.synchronizeAll();
    }
}

export default new SyncService();