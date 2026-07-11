import Battery from "../../models/Battery.js";

/*
|--------------------------------------------------------------------------
| Register Battery Bank
|--------------------------------------------------------------------------
*/

export async function registerBatteryBank(data) {

    return await Battery.create(data);

}

/*
|--------------------------------------------------------------------------
| Get Battery Banks
|--------------------------------------------------------------------------
*/

export async function getBatteryBanks(filter = {}) {

    return await Battery.find(filter)
        .populate("site")
        .sort({
            createdAt: -1
        });

}

/*
|--------------------------------------------------------------------------
| Get Battery Bank
|--------------------------------------------------------------------------
*/

export async function getBatteryBank(id) {

    return await Battery.findById(id)
        .populate("site");

}

/*
|--------------------------------------------------------------------------
| Update Battery Bank
|--------------------------------------------------------------------------
*/

export async function updateBatteryBank(id, updates) {

    return await Battery.findByIdAndUpdate(

        id,

        updates,

        {
            new: true,
            runValidators: true
        }

    ).populate("site");

}

/*
|--------------------------------------------------------------------------
| Delete Battery Bank
|--------------------------------------------------------------------------
*/

export async function deleteBatteryBank(id) {

    return await Battery.findByIdAndDelete(id);

}

/*
|--------------------------------------------------------------------------
| Calculate Average State of Charge
|--------------------------------------------------------------------------
*/

export async function calculateSOC(siteId) {

    const batteries = await Battery.find({

        site: siteId

    });

    if (!batteries.length) {

        return 0;

    }

    const totalSOC = batteries.reduce(

        (sum, battery) =>

            sum + (battery.currentSOC || 0),

        0

    );

    return Number(

        (totalSOC / batteries.length).toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Calculate Average State of Health
|--------------------------------------------------------------------------
*/

export async function calculateSOH(siteId) {

    const batteries = await Battery.find({

        site: siteId

    });

    if (!batteries.length) {

        return 0;

    }

    const totalSOH = batteries.reduce(

        (sum, battery) =>

            sum + (battery.stateOfHealth || 0),

        0

    );

    return Number(

        (totalSOH / batteries.length).toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Calculate Estimated Runtime (Hours)
|--------------------------------------------------------------------------
*/

export async function calculateBatteryRuntime(siteId, loadPower = 0) {

    if (loadPower <= 0) {

        return 0;

    }

    const batteries = await Battery.find({

        site: siteId

    });

    const availableEnergy = batteries.reduce(

        (sum, battery) => {

            const energy = battery.nominalEnergy || 0;

            const soc = (battery.currentSOC || 0) / 100;

            return sum + (energy * soc);

        },

        0

    );

    return Number(

        (availableEnergy / loadPower).toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Average Charge Efficiency
|--------------------------------------------------------------------------
*/

export async function calculateChargeEfficiency(siteId) {

    const batteries = await Battery.find({

        site: siteId

    });

    if (!batteries.length) {

        return 0;

    }

    const total = batteries.reduce(

        (sum, battery) =>

            sum + (battery.chargeEfficiency || 0),

        0

    );

    return Number(

        ((total / batteries.length) * 100).toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Average Discharge Efficiency
|--------------------------------------------------------------------------
*/

export async function calculateDischargeEfficiency(siteId) {

    const batteries = await Battery.find({

        site: siteId

    });

    if (!batteries.length) {

        return 0;

    }

    const total = batteries.reduce(

        (sum, battery) =>

            sum + (battery.dischargeEfficiency || 0),

        0

    );

    return Number(

        ((total / batteries.length) * 100).toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Battery Health
|--------------------------------------------------------------------------
*/

export async function calculateBatteryHealth(siteId) {

    const batteries = await Battery.find({

        site: siteId

    });

    if (!batteries.length) {

        return {

            healthy: 0,

            warning: 0,

            critical: 0

        };

    }

    const health = {

        healthy: 0,

        warning: 0,

        critical: 0

    };

    for (const battery of batteries) {

        const soh = battery.stateOfHealth || 0;

        if (soh >= 80) {

            health.healthy++;

        }

        else if (soh >= 60) {

            health.warning++;

        }

        else {

            health.critical++;

        }

    }

    return health;

}

/*
|--------------------------------------------------------------------------
| Battery KPIs
|--------------------------------------------------------------------------
*/

export async function getBatteryKPIs(siteId, loadPower = 0) {

    const [

        averageSOC,

        averageSOH,

        runtime,

        chargeEfficiency,

        dischargeEfficiency,

        health

    ] = await Promise.all([

        calculateSOC(siteId),

        calculateSOH(siteId),

        calculateBatteryRuntime(

            siteId,

            loadPower

        ),

        calculateChargeEfficiency(siteId),

        calculateDischargeEfficiency(siteId),

        calculateBatteryHealth(siteId)

    ]);

    return {

        averageSOC,

        averageSOH,

        runtime,

        chargeEfficiency,

        dischargeEfficiency,

        health

    };

}

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    registerBatteryBank,

    getBatteryBanks,

    getBatteryBank,

    updateBatteryBank,

    deleteBatteryBank,

    calculateSOC,

    calculateSOH,

    calculateBatteryRuntime,

    calculateChargeEfficiency,

    calculateDischargeEfficiency,

    calculateBatteryHealth,

    getBatteryKPIs

};