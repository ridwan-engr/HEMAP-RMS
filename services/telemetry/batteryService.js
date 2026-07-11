import Battery from "../../models/Battery.js";
import Site from "../../models/Site.js";
import Telemetry from "../../models/Telemetry.js";

/*
|--------------------------------------------------------------------------
| Create Battery Record
|--------------------------------------------------------------------------
*/

export async function createBattery(data) {

    const site = await Site.findById(data.site);

    if (!site) {

        throw new Error(
            "Site not found."
        );

    }

    return await Battery.create(data);

}

/*
|--------------------------------------------------------------------------
| Get All Batteries
|--------------------------------------------------------------------------
*/

export async function getBatteries(filters = {}) {

    const query = {};

    if (filters.site) {

        query.site = filters.site;

    }

    if (filters.status) {

        query.status = filters.status;

    }

    return await Battery.find(query)

        .populate("site")

        .sort({

            createdAt: -1

        });

}

/*
|--------------------------------------------------------------------------
| Get Battery By ID
|--------------------------------------------------------------------------
*/

export async function getBatteryById(id) {

    const battery = await Battery.findById(id)

        .populate("site");

    if (!battery) {

        throw new Error(
            "Battery not found."
        );

    }

    return battery;

}

/*
|--------------------------------------------------------------------------
| Update Battery
|--------------------------------------------------------------------------
*/

export async function updateBattery(

    id,

    payload

) {

    const battery = await Battery.findByIdAndUpdate(

        id,

        payload,

        {

            new: true,

            runValidators: true

        }

    ).populate("site");

    if (!battery) {

        throw new Error(
            "Battery not found."
        );

    }

    return battery;

}

/*
|--------------------------------------------------------------------------
| Delete Battery
|--------------------------------------------------------------------------
*/

export async function deleteBattery(id) {

    const battery = await Battery.findByIdAndDelete(id);

    if (!battery) {

        throw new Error(
            "Battery not found."
        );

    }

    return battery;

}

/*
|--------------------------------------------------------------------------
| Latest Battery Telemetry
|--------------------------------------------------------------------------
*/

export async function getLatestBatteryStatus(siteId) {

    const telemetry = await Telemetry.findOne({

        site: siteId

    })

    .sort({

        timestamp: -1

    });

    if (!telemetry) {

        return null;

    }

    return {

        soc:

            telemetry.batterySOC,

        voltage:

            telemetry.batteryVoltage,

        current:

            telemetry.batteryCurrent,

        power:

            telemetry.batteryPower,

        timestamp:

            telemetry.timestamp

    };

}

/*
|--------------------------------------------------------------------------
| Calculate Battery Health
|--------------------------------------------------------------------------
*/

export async function calculateBatteryHealth(siteId) {

    const telemetry = await getLatestBatteryStatus(siteId);

    if (!telemetry) {

        return null;

    }

    let health = "GOOD";

    if (telemetry.soc < 20) {

        health = "CRITICAL";

    }

    else if (telemetry.soc < 50) {

        health = "WARNING";

    }

    return {

        health,

        soc: telemetry.soc,

        voltage: telemetry.voltage,

        current: telemetry.current,

        power: telemetry.power

    };

}

/*
|--------------------------------------------------------------------------
| Estimate Remaining Runtime
|--------------------------------------------------------------------------
*/

export async function estimateRuntime(siteId) {

    const telemetry = await getLatestBatteryStatus(siteId);

    if (!telemetry) {

        return null;

    }

    /*
        Runtime estimation

        Energy (Wh) / Load (W)

        Capacity should come from Battery model
    */

    const battery = await Battery.findOne({

        site: siteId

    });

    if (!battery) {

        return null;

    }

    const capacityWh =

        battery.capacity *

        battery.nominalVoltage;

    const availableEnergy =

        capacityWh *

        (telemetry.soc / 100);

    const load =

        Math.abs(telemetry.power);

    const runtimeHours =

        load > 0

            ? availableEnergy / load

            : 0;

    return {

        runtimeHours:

            Number(runtimeHours.toFixed(2))

    };

}

/*
|--------------------------------------------------------------------------
| Estimate Charging Time
|--------------------------------------------------------------------------
*/

export async function estimateChargeTime(siteId) {

    const telemetry = await getLatestBatteryStatus(siteId);

    if (!telemetry) {

        return null;

    }

    const battery = await Battery.findOne({

        site: siteId

    });

    if (!battery) {

        return null;

    }

    if (telemetry.current <= 0) {

        return {

            charging: false

        };

    }

    const remainingAh =

        battery.capacity *

        (100 - telemetry.soc) /

        100;

    const hours =

        remainingAh /

        telemetry.current;

    return {

        charging: true,

        estimatedHours:

            Number(hours.toFixed(2))

    };

}

/*
|--------------------------------------------------------------------------
| Battery Statistics
|--------------------------------------------------------------------------
*/

export async function getBatteryStatistics(

    siteId

) {

    const history = await Telemetry.find({

        site: siteId

    })

    .sort({

        timestamp: -1

    })

    .limit(500);

    if (!history.length) {

        return null;

    }

    const averageSOC =

        history.reduce(

            (sum, item) =>

                sum +

                (item.batterySOC || 0),

            0

        ) /

        history.length;

    const averageVoltage =

        history.reduce(

            (sum, item) =>

                sum +

                (item.batteryVoltage || 0),

            0

        ) /

        history.length;

    return {

        averageSOC:

            Number(averageSOC.toFixed(2)),

        averageVoltage:

            Number(averageVoltage.toFixed(2)),

        samples:

            history.length

    };

}

/*
|--------------------------------------------------------------------------
| Update Battery Telemetry
|--------------------------------------------------------------------------
*/

export async function updateBatteryTelemetry(

    siteId,

    telemetry

) {

    const battery = await Battery.findOne({

        site: siteId

    });

    if (!battery) {

        return null;

    }

    battery.lastSOC =

        telemetry.batterySOC;

    battery.lastVoltage =

        telemetry.batteryVoltage;

    battery.lastCurrent =

        telemetry.batteryCurrent;

    battery.lastPower =

        telemetry.batteryPower;

    battery.lastUpdated =

        new Date();

    await battery.save();

    return battery;

}

/*
|--------------------------------------------------------------------------
| Battery Dashboard
|--------------------------------------------------------------------------
*/

export async function getBatteryDashboard(

    siteId

) {

    const [

        latest,

        health,

        runtime,

        charge,

        statistics

    ] = await Promise.all([

        getLatestBatteryStatus(siteId),

        calculateBatteryHealth(siteId),

        estimateRuntime(siteId),

        estimateChargeTime(siteId),

        getBatteryStatistics(siteId)

    ]);

    return {

        latest,

        health,

        runtime,

        charging: charge,

        statistics

    };

}

export default {

    createBattery,

    getBatteries,

    getBatteryById,

    updateBattery,

    deleteBattery,

    getLatestBatteryStatus,

    calculateBatteryHealth,

    estimateRuntime,

    estimateChargeTime,

    getBatteryStatistics,

    updateBatteryTelemetry,

    getBatteryDashboard

};