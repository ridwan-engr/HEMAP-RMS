import mongoose from "mongoose";

import Statistics from "../../models/Statistics.js";
import Telemetry from "../../models/Telemetry.js";
import Battery from "../../models/Battery.js";


/*
|--------------------------------------------------------------------------
| Get Latest Statistics
|--------------------------------------------------------------------------
*/

export async function getDashboardStatistics(siteId) {

    return await Statistics.findOne({

        site: siteId

    })

    .sort({

        timestamp: -1

    })

    .populate("site");

}

/*
|--------------------------------------------------------------------------
| Daily Energy Statistics
|--------------------------------------------------------------------------
*/

export async function getDailyEnergy(siteId) {

    const start = new Date();

    start.setHours(0,0,0,0);

    return await Telemetry.aggregate([

        {
            $match: {

                site: new mongoose.Types.ObjectId(siteId),

                timestamp: {

                    $gte: start

                }

            }

        },

        {

            $group: {

                _id: null,

                solarEnergy: {

                    $sum: "$solarPower"

                },

                gridEnergy: {

                    $sum: "$gridPower"

                },

                generatorEnergy: {

                    $sum: "$generatorPower"

                },

                loadEnergy: {

                    $sum: "$loadPower"

                }

            }

        }

    ]);

}

/*
|--------------------------------------------------------------------------
| Monthly Energy
|--------------------------------------------------------------------------
*/

export async function getMonthlyEnergy(siteId) {

    const start = new Date();

    start.setDate(1);

    start.setHours(0,0,0,0);

    return await Telemetry.aggregate([

        {

            $match: {

                site:

                    new mongoose.Types.ObjectId(siteId),

                timestamp: {

                    $gte: start

                }

            }

        },

        {

            $group: {

                _id: {

                    day:

                        {

                            $dayOfMonth:

                                "$timestamp"

                        }

                },

                solar: {

                    $sum:

                        "$solarPower"

                },

                grid: {

                    $sum:

                        "$gridPower"

                },

                generator: {

                    $sum:

                        "$generatorPower"

                },

                load: {

                    $sum:

                        "$loadPower"

                }

            }

        },

        {

            $sort: {

                "_id.day":1

            }

        }

    ]);

}

/*
|--------------------------------------------------------------------------
| Peak Demand
|--------------------------------------------------------------------------
*/

export async function getPeakDemand(siteId) {

    const record =

        await Telemetry.findOne({

            site: siteId

        })

        .sort({

            loadPower:-1

        });

    if(!record){

        return null;

    }

    return{

        peakDemand:

            record.loadPower,

        timestamp:

            record.timestamp

    };

}

/*
|--------------------------------------------------------------------------
| Average Demand
|--------------------------------------------------------------------------
*/

export async function getAverageDemand(siteId){

    const result=

        await Telemetry.aggregate([

        {

            $match:{

                site:

                    new mongoose.Types.ObjectId(siteId)

            }

        },

        {

            $group:{

                _id:null,

                averageLoad:{

                    $avg:

                        "$loadPower"

                }

            }

        }

    ]);

    return{

        averageDemand:

            result[0]?.averageLoad || 0

    };

}

/*
|--------------------------------------------------------------------------
| Renewable Fraction
|--------------------------------------------------------------------------
*/

export async function getRenewableFraction(siteId){

    const latest=

        await Telemetry.findOne({

            site:siteId

        })

        .sort({

            timestamp:-1

        });

    if(!latest){

        return null;

    }

    const renewable=

        latest.solarPower ??0;

    const total=

        renewable+

        (latest.gridPower??0)+

        (latest.generatorPower??0);

    return{

        renewableFraction:

            total>0

            ?Number(

                (

                    renewable/

                    total

                ).toFixed(3)

            )

            :0

    };

}

/*
|--------------------------------------------------------------------------
| Generator Runtime Summary
|--------------------------------------------------------------------------
*/

export async function getGeneratorRuntimeSummary(siteId){

    const running=

        await Telemetry.countDocuments({

            site:siteId,

            generatorPower:{

                $gt:0

            }

        });

    return{

        samplesRunning:

            running

    };

}
/*
|--------------------------------------------------------------------------
| Battery KPIs
|--------------------------------------------------------------------------
*/

export async function getBatteryKPIs(siteId) {

    const battery = await Battery.findOne({

        site: siteId

    });

    const latest = await Telemetry.findOne({

        site: siteId

    }).sort({

        timestamp: -1

    });

    if (!battery || !latest) {

        return null;

    }

    return {

        soc: latest.batterySOC ?? 0,

        voltage: latest.batteryVoltage ?? 0,

        current: latest.batteryCurrent ?? 0,

        power: latest.batteryPower ?? 0,

        capacity: battery.capacity ?? 0

    };

}

/*
|--------------------------------------------------------------------------
| Power Balance
|--------------------------------------------------------------------------
*/

export async function getPowerBalance(siteId) {

    const latest = await Telemetry.findOne({

        site: siteId

    }).sort({

        timestamp: -1

    });

    if (!latest) {

        return null;

    }

    const generation =

        (latest.solarPower ?? 0) +

        (latest.generatorPower ?? 0) +

        (latest.gridPower ?? 0);

    const demand =

        latest.loadPower ?? 0;

    return {

        generation,

        demand,

        surplus:

            generation - demand

    };

}

/*
|--------------------------------------------------------------------------
| Load Profile
|--------------------------------------------------------------------------
*/

export async function getLoadProfile(

    siteId,

    hours = 24

) {

    const start = new Date();

    start.setHours(

        start.getHours() - hours

    );

    return await Telemetry.find({

        site: siteId,

        timestamp: {

            $gte: start

        }

    })

    .select(

        "timestamp loadPower"

    )

    .sort({

        timestamp: 1

    });

}

/*
|--------------------------------------------------------------------------
| Energy Mix
|--------------------------------------------------------------------------
*/

export async function getEnergyMix(siteId) {

    const latest = await Telemetry.findOne({

        site: siteId

    }).sort({

        timestamp: -1

    });

    if (!latest) {

        return null;

    }

    return {

        solar: latest.solarPower ?? 0,

        grid: latest.gridPower ?? 0,

        generator: latest.generatorPower ?? 0,

        battery: latest.batteryPower ?? 0

    };

}

/*
|--------------------------------------------------------------------------
| Overall System Efficiency
|--------------------------------------------------------------------------
*/

export async function calculateSystemEfficiency(siteId) {

    const latest = await Telemetry.findOne({

        site: siteId

    }).sort({

        timestamp: -1

    });

    if (!latest) {

        return null;

    }

    const input =

        (latest.solarPower ?? 0) +

        (latest.gridPower ?? 0) +

        (latest.generatorPower ?? 0);

    const output =

        latest.loadPower ?? 0;

    return {

        efficiency:

            input > 0

                ? Number(

                    (

                        output /

                        input

                    ).toFixed(3)

                )

                : 0

    };

}

/*
|--------------------------------------------------------------------------
| Estimated Carbon Reduction
|--------------------------------------------------------------------------
*/

export async function calculateCarbonReduction(siteId) {

    const latest = await Telemetry.findOne({

        site: siteId

    }).sort({

        timestamp: -1

    });

    if (!latest) {

        return null;

    }

    /*
        Approximation using
        0.7 kg CO₂/kWh grid factor.
    */

    const renewable =

        latest.solarPower ?? 0;

    const savedKg =

        renewable *

        0.7 /

        1000;

    return {

        renewablePower: renewable,

        estimatedCO2SavedKg:

            Number(savedKg.toFixed(3))

    };

}

/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

export async function buildDashboardStatistics(siteId) {

    const [

        latest,

        battery,

        powerBalance,

        energyMix,

        renewable,

        efficiency,

        carbon,

        peak,

        average

    ] = await Promise.all([

        getDashboardStatistics(siteId),

        getBatteryKPIs(siteId),

        getPowerBalance(siteId),

        getEnergyMix(siteId),

        getRenewableFraction(siteId),

        calculateSystemEfficiency(siteId),

        calculateCarbonReduction(siteId),

        getPeakDemand(siteId),

        getAverageDemand(siteId)

    ]);

    return {

        latest,

        battery,

        powerBalance,

        energyMix,

        renewable,

        efficiency,

        carbon,

        peak,

        average

    };

}

/*
|--------------------------------------------------------------------------
| Save Statistics Snapshot
|--------------------------------------------------------------------------
*/

export async function saveStatisticsSnapshot(

    siteId

) {

    const dashboard =

        await buildDashboardStatistics(

            siteId

        );

    return await Statistics.create({

        site: siteId,

        period: "DAILY",

        timestamp: new Date(),

        renewableFraction:

            dashboard.renewable

                ?.renewableFraction ?? 0,

        batteryEfficiency:

            dashboard.efficiency

                ?.efficiency ?? 0,

        ens: 0,

        lolp: 0,

        resilience: 0

    });

}

/*
|--------------------------------------------------------------------------
| Dashboard Wrapper
|--------------------------------------------------------------------------
*/

export default {

    getDashboardStatistics,

    getDailyEnergy,

    getMonthlyEnergy,

    getPeakDemand,

    getAverageDemand,

    getRenewableFraction,

    getGeneratorRuntimeSummary,

    getBatteryKPIs,

    getPowerBalance,

    getLoadProfile,

    getEnergyMix,

    calculateSystemEfficiency,

    calculateCarbonReduction,

    buildDashboardStatistics,

    saveStatisticsSnapshot,


};