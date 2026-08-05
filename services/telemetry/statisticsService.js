import Statistics from "../../models/Statistics.js";

import vrmStatisticsService from "../vrm/statisticsService.js";

import normalize from "../vrm/normalize.js";

import {
    emitStatistics,
    emitAnalytics
} from "../../websocket/eventEmitters.js";

/*
|--------------------------------------------------------------------------
| Energy Statistics
|--------------------------------------------------------------------------
*/

export async function energyStatistics(

    siteId,

    period = "DAILY"

) {

    return await Statistics.find({

        site: siteId,

        period

    })

    .sort({

        timestamp: -1

    });

}

/*
|--------------------------------------------------------------------------
| Battery Statistics
|--------------------------------------------------------------------------
*/

export async function batteryStatistics(

    siteId,

    period = "DAILY"

) {

    const statistics = await Statistics.find({

        site: siteId,

        period

    })

    .sort({

        timestamp: -1

    });

    return statistics.map(statistic => ({

        timestamp: statistic.timestamp,

        batteryEfficiency:

            statistic.batteryEfficiency

    }));

}

/*
|--------------------------------------------------------------------------
| Solar Statistics
|--------------------------------------------------------------------------
*/

export async function solarStatistics(

    siteId,

    period = "DAILY"

) {

    const statistics = await Statistics.find({

        site: siteId,

        period

    })

    .sort({

        timestamp: -1

    });

    return statistics.map(statistic => ({

        timestamp: statistic.timestamp,

        energyGenerated:

            statistic.energyGenerated,

        renewableFraction:

            statistic.renewableFraction

    }));

}

/*
|--------------------------------------------------------------------------
| Generator Statistics
|--------------------------------------------------------------------------
*/

export async function generatorStatistics(

    siteId,

    period = "DAILY"

) {

    const statistics = await Statistics.find({

        site: siteId,

        period

    })

    .sort({

        timestamp: -1

    });

    return statistics.map(statistic => ({

        timestamp: statistic.timestamp,

        generatorRuntime:

            statistic.generatorRuntime

    }));

}

/*
|--------------------------------------------------------------------------
| Grid Statistics
|--------------------------------------------------------------------------
*/

export async function gridStatistics(

    siteId,

    period = "DAILY"

) {

    const statistics = await Statistics.find({

        site: siteId,

        period

    })

    .sort({

        timestamp: -1

    });

    return statistics.map(statistic => ({

        timestamp: statistic.timestamp,

        gridAvailability:

            statistic.gridAvailability,

        saidi: statistic.saidi,

        saifi: statistic.saifi,

        ens: statistic.ens

    }));

}

/*
|--------------------------------------------------------------------------
| Complete System Statistics
|--------------------------------------------------------------------------
*/

export async function systemStatistics(

    siteId,

    period = "DAILY"

) {

    return await Statistics.find({

        site: siteId,

        period

    })

    .sort({

        timestamp: -1

    });

}

/*
|--------------------------------------------------------------------------
| Synchronize Statistics From VRM
|--------------------------------------------------------------------------
*/

export async function synchronizeStatistics(

    installationId,

    siteId,

    period = "DAILY"

) {

    const response =

        await vrmStatisticsService

            .energyStatistics(

                installationId

            );

    const normalized =

        normalize.statistics(

            response

        );

    return await Statistics.create({

        site: siteId,

        period: "HOURLY",

        timestamp:

            normalized.timestamp ||

            new Date(),

        energyGenerated:

            normalized.energyGenerated ?? 0,

        energyConsumed:

            normalized.energyConsumed ?? 0,

        gridAvailability:

            normalized.gridAvailability ?? 0,

        batteryEfficiency:

            normalized.batteryEfficiency ?? 0,

        renewableFraction:

            normalized.renewableFraction ?? 0,

        generatorRuntime:

            normalized.generatorRuntime ?? 0,

        saidi:

            normalized.saidi ?? 0,

        saifi:

            normalized.saifi ?? 0,

        ens:

            normalized.ens ?? 0,

        lolp:

            normalized.lolp ?? 0,

        resilience:

            normalized.resilience ?? 0

    });

}

export async function synchronizeStatistics(
    installationId,
    start,
    end,
    interval = "hour"
) {

    const installation =
        await Installation.findOne({
            installationId
        });

    if (!installation) {

        throw new Error(
            "Installation not found."
        );

    }

    const raw =
        await energyStatistics(
            installationId,
            start,
            end,
            interval
        );

    const normalized =
        normalizeStatistics(
            installation,
            raw
        );

    const saved =
        await Statistics.create(
            normalized
        );

    emitStatistics(
        installation.site.toString(),
        saved
    );

    emitAnalytics(
        installation.site.toString(),
        saved
    );

    return saved;

}

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    energyStatistics,

    batteryStatistics,

    solarStatistics,

    synchronizeStatistics,

    generatorStatistics,

    gridStatistics,

    systemStatistics,

    synchronizeStatistics

};