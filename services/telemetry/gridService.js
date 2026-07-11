import Grid from "../../models/Grid.js";

import vrmTelemetryService from "../vrm/telemetryService.js";

import normalize from "../vrm/normalize.js";

/*
|--------------------------------------------------------------------------
| Live Grid Telemetry
|--------------------------------------------------------------------------
*/

export async function getGridTelemetry(siteId) {

    return await Grid.findOne({

        site: siteId

    })

    .sort({

        updatedAt: -1

    });

}

/*
|--------------------------------------------------------------------------
| Grid History
|--------------------------------------------------------------------------
*/

export async function getGridHistory(

    siteId,

    limit = 100

) {

    return await Grid.find({

        site: siteId

    })

    .sort({

        updatedAt: -1

    })

    .limit(limit);

}

/*
|--------------------------------------------------------------------------
| Grid Power
|--------------------------------------------------------------------------
*/

export async function getGridPower(siteId) {

    const grid = await getGridTelemetry(

        siteId

    );

    if (!grid) {

        return null;

    }

    return {

        power: grid.power,

        importedEnergy:

            grid.importedEnergy,

        exportedEnergy:

            grid.exportedEnergy

    };

}

/*
|--------------------------------------------------------------------------
| Grid Availability
|--------------------------------------------------------------------------
*/

export async function getGridAvailability(siteId) {

    const grid = await getGridTelemetry(

        siteId

    );

    if (!grid) {

        return null;

    }

    return {

        status: grid.status,

        availability:

            grid.availability,

        outageCount:

            grid.outageCount,

        outageDuration:

            grid.outageDuration,

        lastAvailable:

            grid.lastAvailable,

        lastOutage:

            grid.lastOutage

    };

}

/*
|--------------------------------------------------------------------------
| Grid Power Quality
|--------------------------------------------------------------------------
*/

export async function getGridQuality(siteId) {

    const grid = await getGridTelemetry(

        siteId

    );

    if (!grid) {

        return null;

    }

    return {

        voltage:

            grid.voltage,

        current:

            grid.current,

        frequency:

            grid.frequency,

        power:

            grid.power,

        SAIDI:

            grid.SAIDI,

        SAIFI:

            grid.SAIFI,

        ENS:

            grid.ENS

    };

}

/*
|--------------------------------------------------------------------------
| Synchronize Grid Telemetry
|--------------------------------------------------------------------------
*/

export async function synchronizeGridTelemetry(

    installationId,

    siteId

) {

    const telemetry =

        await vrmTelemetryService

            .getLiveTelemetry(

                installationId

            );

    const normalized =

        normalize.grid(

            telemetry

        );

    return await Grid.findOneAndUpdate(

        {

            site: siteId

        },

        {

            utilityName:

                normalized.utilityName,

            voltage:

                normalized.voltage,

            current:

                normalized.current,

            frequency:

                normalized.frequency,

            power:

                normalized.power,

            importedEnergy:

                normalized.importedEnergy,

            exportedEnergy:

                normalized.exportedEnergy,

            availability:

                normalized.availability,

            outageCount:

                normalized.outageCount,

            outageDuration:

                normalized.outageDuration,

            SAIDI:

                normalized.SAIDI,

            SAIFI:

                normalized.SAIFI,

            ENS:

                normalized.ENS,

            status:

                normalized.status,

            lastAvailable:

                normalized.lastAvailable,

            lastOutage:

                normalized.lastOutage

        },

        {

            new: true,

            upsert: true,

            setDefaultsOnInsert: true,

            runValidators: true

        }

    );

}

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    getGridTelemetry,

    getGridHistory,

    getGridPower,

    getGridAvailability,

    getGridQuality,

    synchronizeGridTelemetry

};