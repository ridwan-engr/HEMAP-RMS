import installationService
from "../vrm/installationService.js";

import telemetryService
from "../vrm/telemetryService.js";

import statisticsService
from "../analytics/statisticsService.js";

import normalizeTelemetry
from "../vrm/alarmService.js";

import Telemetry
from "../../models/Telemetry.js";

import logger
from "../../utils/logger.js";

class SyncService {

    async sync() {

        const installations =
            await installationService.getInstallations();

        const updates = [];

        for (const installation of installations) {

            try {

                const raw =
                    await telemetryService
                        .getLiveTelemetry(
                            installation.Id
                        );

                const telemetry =
                    normalizeTelemetry(
                        raw,
                        installation
                    );

                await Telemetry.create(
                    telemetry
                );

                updates.push(
                    telemetry
                );

            }

            catch (error) {

                logger.error(error);

            }

        }

        await statisticsService
            .saveStatisticsSnapshot();

        return updates;

    }

}

export default new SyncService();