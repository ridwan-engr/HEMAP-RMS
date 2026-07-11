import Telemetry from "../../models/Telemetry.js";
import Site from "../../models/Site.js";
import Installation from "../../models/Installation.js";

/*
|--------------------------------------------------------------------------
| Create Telemetry Record
|--------------------------------------------------------------------------
*/

export async function createTelemetry(data) {

    const site = await Site.findById(data.site);

    if (!site) {

        throw new Error(
            "Site not found."
        );

    }

    return await Telemetry.create({

        ...data,

        timestamp:
            data.timestamp ||
            new Date()

    });

}

/*
|--------------------------------------------------------------------------
| Get Latest Telemetry
|--------------------------------------------------------------------------
*/

export async function getLatestTelemetry(siteId) {

    return await Telemetry.findOne({

        site: siteId

    })

    .populate("site")

    .sort({

        timestamp: -1

    });

}

/*
|--------------------------------------------------------------------------
| Get Telemetry History
|--------------------------------------------------------------------------
*/

export async function getTelemetryHistory(

    siteId,

    {

        start,

        end,

        limit = 1000

    } = {}

) {

    const query = {

        site: siteId

    };

    if (start || end) {

        query.timestamp = {};

        if (start) {

            query.timestamp.$gte =

                new Date(start);

        }

        if (end) {

            query.timestamp.$lte =

                new Date(end);

        }

    }

    return await Telemetry.find(query)

        .sort({

            timestamp: -1

        })

        .limit(limit);

}

/*
|--------------------------------------------------------------------------
| Get Telemetry Record By ID
|--------------------------------------------------------------------------
*/

export async function getTelemetryById(id) {

    const telemetry =

        await Telemetry.findById(id)

        .populate("site");

    if (!telemetry) {

        throw new Error(

            "Telemetry record not found."

        );

    }

    return telemetry;

}

/*
|--------------------------------------------------------------------------
| Delete Telemetry
|--------------------------------------------------------------------------
*/

export async function deleteTelemetry(id) {

    const telemetry =

        await Telemetry.findByIdAndDelete(id);

    if (!telemetry) {

        throw new Error(

            "Telemetry record not found."

        );

    }

    return telemetry;

}

/*
|--------------------------------------------------------------------------
| Save Incoming VRM Telemetry
|--------------------------------------------------------------------------
*/

export async function saveVRMTelemetry(

    installationId,

    telemetryData

) {

    const installation = await Installation.findOne({

        installationId

    });

    if (!installation) {

        throw new Error(

            `Installation ${installationId} not found.`

        );

    }

    const record = await Telemetry.create({

        site: installation.site,

        timestamp:

            telemetryData.timestamp ||

            new Date(),

        solarPower:

            telemetryData.solarPower || 0,

        batterySOC:

            telemetryData.batterySOC || 0,

        batteryVoltage:

            telemetryData.batteryVoltage || 0,

        batteryCurrent:

            telemetryData.batteryCurrent || 0,

        batteryPower:

            telemetryData.batteryPower || 0,

        gridPower:

            telemetryData.gridPower || 0,

        generatorPower:

            telemetryData.generatorPower || 0,

        loadPower:

            telemetryData.loadPower || 0,

        inverterPower:

            telemetryData.inverterPower || 0,

        frequency:

            telemetryData.frequency || 50,

        temperature:

            telemetryData.temperature || 25

    });

    installation.lastTelemetry = new Date();

    installation.lastSync = new Date();

    installation.status = "ONLINE";

    await installation.save();

    return record;

}

/*
|--------------------------------------------------------------------------
| Update Latest Telemetry
|--------------------------------------------------------------------------
*/

export async function updateLatestTelemetry(

    telemetryId,

    payload

) {

    const telemetry = await Telemetry.findByIdAndUpdate(

        telemetryId,

        payload,

        {

            new: true,

            runValidators: true

        }

    ).populate("site");

    if (!telemetry) {

        throw new Error(

            "Telemetry record not found."

        );

    }

    return telemetry;

}

/*
|--------------------------------------------------------------------------
| Dashboard Summary
|--------------------------------------------------------------------------
*/

export async function getTelemetrySummary(

    siteId

) {

    const latest = await getLatestTelemetry(

        siteId

    );

    if (!latest) {

        return null;

    }

    return {

        timestamp:

            latest.timestamp,

        solarPower:

            latest.solarPower,

        loadPower:

            latest.loadPower,

        gridPower:

            latest.gridPower,

        generatorPower:

            latest.generatorPower,

        inverterPower:

            latest.inverterPower,

        batteryPower:

            latest.batteryPower,

        batterySOC:

            latest.batterySOC,

        batteryVoltage:

            latest.batteryVoltage,

        frequency:

            latest.frequency,

        temperature:

            latest.temperature

    };

}

/*
|--------------------------------------------------------------------------
| Power Flow
|--------------------------------------------------------------------------
*/

export async function getPowerFlow(

    siteId

) {

    const latest = await getLatestTelemetry(

        siteId

    );

    if (!latest) {

        return null;

    }

    return {

        sources: {

            solar:

                latest.solarPower,

            grid:

                latest.gridPower,

            generator:

                latest.generatorPower,

            battery:

                latest.batteryPower

        },

        load:

            latest.loadPower,

        inverter:

            latest.inverterPower

    };

}

/*
|--------------------------------------------------------------------------
| Battery Status
|--------------------------------------------------------------------------
*/

export async function getBatteryStatus(

    siteId

) {

    const latest = await getLatestTelemetry(

        siteId

    );

    if (!latest) {

        return null;

    }

    return {

        soc:

            latest.batterySOC,

        voltage:

            latest.batteryVoltage,

        current:

            latest.batteryCurrent,

        power:

            latest.batteryPower,

        health:

            latest.batterySOC >= 70

                ? "GOOD"

                : latest.batterySOC >= 40

                ? "WARNING"

                : "CRITICAL"

    };

}

/*
|--------------------------------------------------------------------------
| Energy KPIs
|--------------------------------------------------------------------------
*/

export async function getEnergyKPIs(

    siteId

) {

    const latest = await getLatestTelemetry(

        siteId

    );

    if (!latest) {

        return null;

    }

    const renewableInput =

        latest.solarPower;

    const conventionalInput =

        latest.gridPower +

        latest.generatorPower;

    const totalInput =

        renewableInput +

        conventionalInput;

    return {

        renewableFraction:

            totalInput > 0

                ? Number(

                      (

                          renewableInput /

                          totalInput

                      ).toFixed(3)

                  )

                : 0,

        loadPower:

            latest.loadPower,

        batterySOC:

            latest.batterySOC,

        gridDependency:

            latest.gridPower,

        generatorDependency:

            latest.generatorPower

    };

}

/*
|--------------------------------------------------------------------------
| Dashboard Object
|--------------------------------------------------------------------------
*/

export async function getDashboardTelemetry(

    siteId

) {

    const [

        latest,

        battery,

        flow,

        kpis

    ] = await Promise.all([

        getLatestTelemetry(siteId),

        getBatteryStatus(siteId),

        getPowerFlow(siteId),

        getEnergyKPIs(siteId)

    ]);

    return {

        latest,

        battery,

        powerFlow: flow,

        kpis

    };

}

export default {

    createTelemetry,

    getLatestTelemetry,

    getTelemetryHistory,

    getTelemetryById,

    deleteTelemetry,

    saveVRMTelemetry,

    updateLatestTelemetry,

    getTelemetrySummary,

    getPowerFlow,

    getBatteryStatus,

    getEnergyKPIs,

    getDashboardTelemetry

};