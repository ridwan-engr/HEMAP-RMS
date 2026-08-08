import Battery from "../../models/Battery.js";
import Generator from "../../models/Generator.js";
import Grid from "../../models/Grid.js";
import Solar from "../../models/Solar.js";
import Telemetry from "../../models/Telemetry.js";
import Weather from "../../models/Weather.js";
import OptimizationResult from "../../models/OptimizationResult.js";
import Site from "../../models/Site.js";

import {
    forecastSolar,
    forecastLoad,
    forecastBatterySOC
} from "./forecastService.js";

import {
    emitOptimization
} from "../../websocket/eventEmitters.js";

import mongoose from "mongoose";



function validateSite(siteId) {

    if (
        !siteId ||
        !mongoose.Types.ObjectId.isValid(siteId)
    ) {

        throw new Error("A valid siteId is required for optimization.");

    }

    return true;

}

/*
|--------------------------------------------------------------------------
| Current System State
|--------------------------------------------------------------------------
*/

export async function getCurrentSystemState(siteId) {

    validateSite(siteId);

    const [
        site,
        telemetry,
        battery,
        generator,
        grid,
        solar,
        weather
    ] = await Promise.all([

        Site.findById(siteId).lean(),

        Telemetry.findOne({
            site: siteId
        })
            .sort({
                timestamp: -1
            })
            .lean(),

        Battery.findOne({
            site: siteId
        })
            .lean(),

        Generator.findOne({
            site: siteId
        })
            .lean(),

        Grid.findOne({
            site: siteId
        })
            .lean(),

        Solar.findOne({
            site: siteId
        })
            .lean(),

        Weather.findOne({
            site: siteId
        })
            .sort({
                timestamp: -1
            })
            .lean()

    ]);

    return {

        site,

        telemetry,

        battery,

        generator,

        grid,

        solar,

        weather

    };

}

/*
|--------------------------------------------------------------------------
| Renewable Generation
|--------------------------------------------------------------------------
*/

export function calculateRenewableGeneration(state) {

    return (

        state.telemetry?.solarPower ?? 0

    );

}

/*
|--------------------------------------------------------------------------
| Generator Capacity
|--------------------------------------------------------------------------
*/

export function calculateGeneratorCapacity(state) {

    return Number(
        state.generator?.ratedPower ?? 0
    );

}

/*
|--------------------------------------------------------------------------
| Battery Capacity
|--------------------------------------------------------------------------
*/

export function calculateBatteryCapacity(state) {

    const battery = state.battery;

    const nominalEnergy =
        Number(
            battery?.nominalEnergy ?? 0
        );

    const nominalVoltage =
        Number(
            battery?.nominalVoltage ?? 0
        );

    const maximumDischargeCurrent =
        Number(
            battery?.maximumDischargeCurrent ?? 0
        );

    const maximumChargeCurrent =
        Number(
            battery?.maximumChargeCurrent ?? 0
        );

    return {

        nominalEnergy,

        nominalVoltage,

        maximumDischargeCurrent,

        maximumChargeCurrent,

        maximumDischargePower:
            maximumDischargeCurrent *
            nominalVoltage,

        maximumChargePower:
            maximumChargeCurrent *
            nominalVoltage,

        soc:
            Number(
                state.telemetry?.batterySOC ??
                battery?.currentSOC ??
                0
            ),

        power:
            Number(
                state.telemetry?.batteryPower ?? 0
            ),

        stateOfHealth:
            Number(
                battery?.stateOfHealth ?? 100
            ),

        minimumSOC:
            Number(
                battery?.minimumSOC ?? 20
            ),

        maximumSOC:
            Number(
                battery?.maximumSOC ?? 100
            )

    };

}

/*
|--------------------------------------------------------------------------
| Grid Capacity
|--------------------------------------------------------------------------
*/

export function calculateGridCapacity(state) {

    return {

        available:

            state.telemetry?.gridStatus === "ONLINE",

        power:

            state.telemetry?.gridPower ?? 0

    };

}

/*
|--------------------------------------------------------------------------
| Net Load
|--------------------------------------------------------------------------
*/

export function calculateNetLoad(state) {

    const demand =

        state.telemetry?.loadPower ?? 0;

    const renewable =

        calculateRenewableGeneration(state);

    return demand - renewable;

}

/*
|--------------------------------------------------------------------------
| Available Supply
|--------------------------------------------------------------------------
*/

export function calculateAvailablePower(state) {

    return {

        solar:

            state.telemetry?.solarPower ?? 0,

        battery:

            Math.max(

                0,

                state.telemetry?.batteryPower ?? 0

            ),

        generator:

            state.telemetry?.generatorPower ?? 0,

        grid:

            state.telemetry?.gridPower ?? 0

    };

}

/*
|--------------------------------------------------------------------------
| Power Balance
|--------------------------------------------------------------------------
*/

export function calculatePowerBalance(state) {

    const supply = calculateAvailablePower(state);

    const generation =

        supply.solar +

        supply.generator +

        supply.grid +

        supply.battery;

    const demand =

        state.telemetry?.loadPower ?? 0;

    return {

        generation,

        demand,

        balance:

            generation - demand

    };

}

/*
|--------------------------------------------------------------------------
| Forecast Inputs
|--------------------------------------------------------------------------
*/

export async function getForecastInputs(siteId) {

    const [

        solar,

        load,

        battery

    ] = await Promise.all([

        forecastSolar(siteId),

        forecastLoad(siteId),

        forecastBatterySOC(siteId)

    ]);

    return {

        solar,

        load,

        battery

    };

}

/*
|--------------------------------------------------------------------------
| Grid Energy Cost
|--------------------------------------------------------------------------
*/

export function calculateGridCost(

    gridPower,

    tariff = 0.18

) {

    return Number(

        ((gridPower / 1000) * tariff).toFixed(4)

    );

}

/*
|--------------------------------------------------------------------------
| Generator Fuel Cost
|--------------------------------------------------------------------------
*/

export function calculateGeneratorFuelCost(

    generatorPower,

    fuelRate = 0.28,

    dieselPrice = 1.20

) {

    /*
        fuelRate:
        litres/kWh
    */

    const energy = generatorPower / 1000;

    const litres = energy * fuelRate;

    const cost = litres * dieselPrice;

    return {

        energy,

        litres,

        cost: Number(cost.toFixed(4))

    };

}

/*
|--------------------------------------------------------------------------
| Battery Degradation Cost
|--------------------------------------------------------------------------
*/

export function calculateBatteryDegradationCost(

    batteryPower,

    degradationRate = 0.015

) {

    return Number(

        (

            (Math.abs(batteryPower) / 1000) *

            degradationRate

        ).toFixed(4)

    );

}

/*
|--------------------------------------------------------------------------
| Carbon Emission Cost
|--------------------------------------------------------------------------
*/

export function calculateCarbonCost(

    generatorPower,

    emissionFactor = 0.69,

    carbonPrice = 0.05

) {

    const energy = generatorPower / 1000;

    const emissions = energy * emissionFactor;

    const cost = emissions * carbonPrice;

    return {

        emissions,

        cost: Number(cost.toFixed(4))

    };

}

/*
|--------------------------------------------------------------------------
| Renewable Utilization
|--------------------------------------------------------------------------
*/

export function calculateRenewableUtilization(state) {

    const solar =

        state.telemetry?.solarPower ?? 0;

    const demand =

        state.telemetry?.loadPower ?? 0;

    if (demand <= 0) {

        return 0;

    }

    return Number(

        (

            solar / demand

        ).toFixed(4)

    );

}

/*
|--------------------------------------------------------------------------
| Objective Function
|--------------------------------------------------------------------------
*/

export function calculateObjectiveFunction({

    gridCost,

    generatorCost,

    batteryCost,

    carbonCost,

    ens = 0

}) {

    return Number(

        (

            gridCost +

            generatorCost +

            batteryCost +

            carbonCost +

            ens

        ).toFixed(4)

    );

}

/*
|--------------------------------------------------------------------------
| Battery Constraints
|--------------------------------------------------------------------------
*/

export function validateBatteryConstraints(

    battery,

    telemetry

) {

    const soc = telemetry?.batterySOC ?? 0;

    const capacity = battery?.capacity ?? 0;

    return {

        valid:

            soc >= 20 &&

            soc <= 95 &&

            capacity > 0,

        soc,

        capacity

    };

}

/*
|--------------------------------------------------------------------------
| Generator Constraints
|--------------------------------------------------------------------------
*/

export function validateGeneratorConstraints(
    generator,
    telemetry
) {

    const output =
        Number(
            telemetry?.generatorPower ?? 0
        );

    const capacity =
        Number(
            generator?.ratedPower ?? 0
        );

    return {

        valid:
            !generator
                ? false
                : output <= capacity,

        output,

        capacity

    };

}

/*
|--------------------------------------------------------------------------
| Grid Constraints
|--------------------------------------------------------------------------
*/

export function validateGridConstraints(

    grid,

    telemetry

) {

    return {

        available:

            telemetry?.gridStatus === "ONLINE",

        power:

            telemetry?.gridPower ?? 0

    };

}

/*
|--------------------------------------------------------------------------
| Power Balance Constraint
|--------------------------------------------------------------------------
*/

export function validatePowerBalanceConstraint(

    state

) {

    const balance =

        calculatePowerBalance(state);

    return {

        satisfied:

            Math.abs(balance.balance) <= 10,

        imbalance:

            balance.balance

    };

}

/*
|--------------------------------------------------------------------------
| Optimization Constraints
|--------------------------------------------------------------------------
*/

export function validateOptimizationConstraints(

    state

) {

    return {

        battery:

            validateBatteryConstraints(

                state.battery,

                state.telemetry

            ),

        generator:

            validateGeneratorConstraints(

                state.generator,

                state.telemetry

            ),

        grid:

            validateGridConstraints(

                state.grid,

                state.telemetry

            ),

        powerBalance:

            validatePowerBalanceConstraint(

                state

            )

    };

}

/*
|--------------------------------------------------------------------------
| Battery Dispatch Optimization
|--------------------------------------------------------------------------
*/

export function optimizeBatteryDispatch(state) {

    const battery = state.battery;

    const soc = Number(
        state.telemetry?.batterySOC ??
        battery?.currentSOC ??
        0
    );

    const minimumSOC = Number(
        battery?.minimumSOC ?? 20
    );

    const maximumSOC = Number(
        battery?.maximumSOC ?? 100
    );

    const nominalVoltage = Number(
        battery?.nominalVoltage ?? 0
    );

    const maximumDischargeCurrent = Number(
        battery?.maximumDischargeCurrent ?? 0
    );

    const maximumDischargePower =
        nominalVoltage *
        maximumDischargeCurrent;

    const netLoad =
        calculateNetLoad(state);

    /*
    |--------------------------------------------------------------------------
    | No battery configuration
    |--------------------------------------------------------------------------
    */

    if (!battery) {

        return {

            action: "UNAVAILABLE",

            recommendedPower: 0,

            reason:
                "Battery configuration is unavailable."

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Excess renewable generation
    |--------------------------------------------------------------------------
    */

    if (netLoad < 0) {

        return {

            action: "CHARGE",

            recommendedPower:
                Math.abs(netLoad),

            reason:
                "Excess renewable generation."

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Battery can discharge
    |--------------------------------------------------------------------------
    */

    if (
        soc > minimumSOC &&
        maximumDischargePower > 0
    ) {

        return {

            action: "DISCHARGE",

            recommendedPower:
                Math.min(
                    netLoad,
                    maximumDischargePower
                ),

            reason:
                "Reduce grid/generator usage."

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Battery unavailable for discharge
    |--------------------------------------------------------------------------
    */

    return {

        action: "IDLE",

        recommendedPower: 0,

        reason:
            soc <= minimumSOC
                ? "SOC is at or below minimum threshold."
                : "Battery discharge capability unavailable."

    };

}

/*
|--------------------------------------------------------------------------
| Generator Dispatch
|--------------------------------------------------------------------------
*/

export function optimizeGeneratorDispatch(state) {

    const balance =
        calculatePowerBalance(state);

    const generator =
        state.generator;

    const ratedPower =
        Number(
            generator?.ratedPower ?? 0
        );

    const currentPower =
        Number(
            state.telemetry?.generatorPower ?? 0
        );

    /*
    |--------------------------------------------------------------------------
    | Generator configuration unavailable
    |--------------------------------------------------------------------------
    */

    if (!generator) {

        return {

            start: false,

            power: 0,

            reason:
                "Generator configuration is unavailable."

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Existing generator output is already sufficient
    |--------------------------------------------------------------------------
    */

    if (balance.balance >= 0) {

        return {

            start:
                currentPower <= 0,

            power: 0,

            reason:
                "Current generation is sufficient."

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Supply deficit
    |--------------------------------------------------------------------------
    */

    const requiredPower =
        Math.abs(balance.balance);

    return {

        start: true,

        power:
            Math.min(
                requiredPower,
                ratedPower
            ),

        reason:
            "Supply deficit."

    };

}

/*
|--------------------------------------------------------------------------
| Grid Dispatch
|--------------------------------------------------------------------------
*/

export function optimizeGridDispatch(state) {

    if (state.telemetry?.gridStatus !== "ONLINE") {

        return {

            importPower: 0,

            exportPower: 0,

            available: false

        };

    }

    const balance = calculatePowerBalance(state);

    if (balance.balance < 0) {

        return {

            importPower: Math.abs(balance.balance),

            exportPower: 0,

            available: true

        };

    }

    return {

        importPower: 0,

        exportPower: balance.balance,

        available: true

    };

}

/*
|--------------------------------------------------------------------------
| Solar Dispatch
|--------------------------------------------------------------------------
*/

export function optimizeSolarDispatch(state) {

    const available =

        state.telemetry?.solarPower ?? 0;

    const demand =

        state.telemetry?.loadPower ?? 0;

    return {

        utilized: Math.min(

            available,

            demand

        ),

        curtailed: Math.max(

            available - demand,

            0

        )

    };

}

/*
|--------------------------------------------------------------------------
| Peak Shaving
|--------------------------------------------------------------------------
*/

export function performPeakShaving(state) {

    const load =

        state.telemetry?.loadPower ?? 0;

    const threshold =

        state.site?.peakThreshold ?? 5000;

    return {

        enabled: load > threshold,

        reduction:

            load > threshold

                ? load - threshold

                : 0

    };

}

/*
|--------------------------------------------------------------------------
| Load Shedding
|--------------------------------------------------------------------------
*/

export function performLoadShedding(state) {

    const balance = calculatePowerBalance(state);

    if (balance.balance >= 0) {

        return {

            required: false,

            shedPower: 0

        };

    }

    return {

        required: true,

        shedPower: Math.abs(balance.balance)

    };

}

/*
|--------------------------------------------------------------------------
| Demand Response
|--------------------------------------------------------------------------
*/

export function performDemandResponse(state) {

    const load =
        Number(
            state.telemetry?.loadPower ?? 0
        );

    /*
    |--------------------------------------------------------------------------
    | Grid model does not define capacity.
    |--------------------------------------------------------------------------
    | Therefore we must not use state.grid.capacity.
    |--------------------------------------------------------------------------
    */

    if (load <= 0) {

        return {

            active: false,

            recommendedReduction: 0,

            reason: "No active load."

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Until a formal demand threshold is configured,
    | do not automatically activate demand response.
    |--------------------------------------------------------------------------
    */

    const threshold =
        Number(
            state.site?.peakThreshold ?? 0
        );

    if (threshold <= 0) {

        return {

            active: false,

            recommendedReduction: 0,

            reason:
                "Demand-response threshold is not configured."

        };

    }

    const active =
        load > threshold;

    return {

        active,

        threshold,

        recommendedReduction:
            active
                ? Number(
                    (load - threshold).toFixed(2)
                )
                : 0

    };

}

/*
|--------------------------------------------------------------------------
| Save Optimization Result
|--------------------------------------------------------------------------
*/

export async function saveOptimizationResult(
    siteId,
    optimization
) {

    validateSite(siteId);

    const result =
        await OptimizationResult.create({

            site: siteId,

            optimizationDate:
                new Date(),

            objectiveFunction:
                "Minimum ENS",

            optimizationMethod:
                "Rule-Based",

            batteryDispatch:
                Number(
                    optimization.battery
                        ?.recommendedPower ?? 0
                ),

            generatorDispatch:
                Number(
                    optimization.generator
                        ?.power ?? 0
                ),

            solarDispatch:
                Number(
                    optimization.solar
                        ?.utilized ?? 0
                ),

            gridDispatch:
                Number(
                    optimization.grid
                        ?.importPower ?? 0
                ),

            renewableFraction:
                Number(
                    calculateRenewableUtilization(
                        optimization.state ?? {}
                    )
                ),

            batteryEfficiency:
                Number(
                    optimization.state
                        ?.battery
                        ?.dischargeEfficiency ?? 0
                ),

            generatorRuntime:
                Number(
                    optimization.state
                        ?.generator
                        ?.todayRuntime ?? 0
                ),

            fuelConsumption:
                0,

            operatingCost:
                Number(
                    optimization.objectiveValue ?? 0
                ),

            co2Emission:
                Number(
                    optimization.costs
                        ?.carbonCost ?? 0
                ),

            lolp:
                Number(
                    optimization.constraints
                        ?.powerBalance
                        ?.satisfied
                        ? 0
                        : 1
                ),

            ens:
                Number(
                    optimization.loadShedding
                        ?.shedPower ?? 0
                ),

            saifi:
                Number(
                    optimization.state
                        ?.grid
                        ?.SAIFI ?? 0
                ),

            saidi:
                Number(
                    optimization.state
                        ?.grid
                        ?.SAIDI ?? 0
                ),

            resilienceIndex:
                0,

            computationTime:
                0,

            status:
                "SUCCESS"

        });

    emitOptimization(
        siteId,
        result
    );

    return result;

}

/*
|--------------------------------------------------------------------------
| Rule-Based Dispatch
|--------------------------------------------------------------------------
*/

export async function performRuleBasedDispatch(
    siteId,
    providedState = null
) {

    validateSite(siteId);

    const state =
        providedState ??
        await getCurrentSystemState(siteId);

    if (!state.telemetry) {

        throw new Error(
            "No telemetry available for optimization."
        );

    }

    const battery =
        optimizeBatteryDispatch(state);

    const generator =
        optimizeGeneratorDispatch(state);

    const grid =
        optimizeGridDispatch(state);

    const solar =
        optimizeSolarDispatch(state);

    const constraints =
        validateOptimizationConstraints(state);

    const costs = {

        gridCost:
            calculateGridCost(
                grid.importPower
            ),

        generatorCost:
            calculateGeneratorFuelCost(
                generator.power
            ).cost,

        batteryCost:
            calculateBatteryDegradationCost(
                battery.recommendedPower
            ),

        carbonCost:
            calculateCarbonCost(
                generator.power
            ).cost

    };

    const objectiveValue =
        calculateObjectiveFunction(costs);

    const optimization = {

    state,

    battery,

    generator,

    grid,

    solar,

    peakShaving:
        performPeakShaving(state),

    loadShedding:
        performLoadShedding(state),

    demandResponse:
        performDemandResponse(state),

    constraints,

    costs,

    objectiveValue

};
    await saveOptimizationResult(
        siteId,
        optimization
    );

    return {

        timestamp: new Date(),

        siteId,

        optimization

    };

}

/*
|--------------------------------------------------------------------------
| Forecast-Driven Optimization
|--------------------------------------------------------------------------
*/
export async function optimizeWithForecast(
    siteId,
    state = null
) {

    const currentState =
        state ??
        await getCurrentSystemState(siteId);

    const forecasts =
        await getForecastInputs(siteId);


    return {


        forecasts,

        optimizationMode:
            "FORECAST",

        state:
            currentState

    };

}

/*
|--------------------------------------------------------------------------
| Multi-Objective Optimization
|--------------------------------------------------------------------------
*/

export function calculateOptimizationScore({

    cost,

    renewable,

    emissions,

    reliability

}) {

    return (

        (0.40 * cost) +

        (0.25 * (1 - renewable)) +

        (0.20 * emissions) +

        (0.15 * (1 - reliability))

    );

}

/*
|--------------------------------------------------------------------------
| Pareto Candidate Evaluation
|--------------------------------------------------------------------------
*/

export function evaluateParetoSolutions(

    candidates = []

) {

    if (!candidates.length) {

        return [];

    }

    return candidates

        .map(solution => ({

            ...solution,

            score:

                calculateOptimizationScore({

                    cost:

                        solution.cost,

                    renewable:

                        solution.renewable,

                    emissions:

                        solution.emissions,

                    reliability:

                        solution.reliability

                })

        }))

        .sort(

            (a, b) =>

                a.score - b.score

        );

}

/*
|--------------------------------------------------------------------------
| Build MILP Model
|--------------------------------------------------------------------------
*/

export function buildMILPModel(state) {

    return {

        variables: {

            solarPower:

                state.telemetry?.solarPower ?? 0,

            batteryPower:

                state.telemetry?.batteryPower ?? 0,

            generatorPower:

                state.telemetry?.generatorPower ?? 0,

            gridPower:

                state.telemetry?.gridPower ?? 0

        },

        objective:

            "Minimize Cost + ENS + Carbon",

        constraints: [

            "Power Balance",

            "Battery SOC",

            "Generator Capacity",

            "Grid Capacity",

            "Reserve Margin"

        ]

    };

}

/*
|--------------------------------------------------------------------------
| Export Pyomo Data
|--------------------------------------------------------------------------
*/

export async function exportPyomoData(siteId) {

    const state =
        await getCurrentSystemState(siteId);

    const forecasts =
        await getForecastInputs(siteId);


    return {

        telemetry:

            state.telemetry,

        battery:

            state.battery,

        generator:

            state.generator,

        grid:

            state.grid,

        solar:

            state.solar,

        weather:

            state.weather,

        forecasts

    };

}

/*
|--------------------------------------------------------------------------
| N-1 Security Check
|--------------------------------------------------------------------------
*/

export function performNMinusOneAnalysis(state) {

    const sources = [

        "Solar",

        "Battery",

        "Generator",

        "Grid"

    ];

    return sources.map(source => ({

        source,

        available:

            source === "Solar"

                ? (state.telemetry?.solarPower ?? 0) > 0

                : source === "Battery"

                    ? (state.telemetry?.batterySOC ?? 0) > 20

                    : source === "Generator"

                        ? (state.telemetry?.generatorStatus === "ONLINE")

                        : (state.telemetry?.gridStatus === "ONLINE")

    }));

}

/*
|--------------------------------------------------------------------------
| Optimization Dashboard
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Optimization Dashboard
|--------------------------------------------------------------------------
*/

export async function getOptimizationDashboard(siteId) {

    validateSite(siteId);

    const state =
        await getCurrentSystemState(siteId);

    const dispatch =
        await performRuleBasedDispatch(
            siteId,
            state
        );

    const forecast =
        await optimizeWithForecast(
            siteId,
            state
        );

    return {

        timestamp: new Date(),

        siteId,

        state,

        dispatch,

        forecasts:
            forecast.forecasts

    };

}

/*
|--------------------------------------------------------------------------
| Optimization Report
|--------------------------------------------------------------------------
*/

export async function generateOptimizationReport(siteId) {

    const dashboard =
        await getOptimizationDashboard(siteId);

    return {

        generatedAt: new Date(),

        summary: {

            objectiveValue:

                dashboard.dispatch.optimization.objectiveValue,

            battery:

                dashboard.dispatch.optimization.battery.action,

            generator:

                dashboard.dispatch.optimization.generator.start,

            gridImport:

                dashboard.dispatch.optimization.grid.importPower,

            renewableGeneration:

                dashboard.state.telemetry?.solarPower ?? 0

        },

        dashboard

    };

}

/*
|--------------------------------------------------------------------------
| Dashboard Wrapper
|--------------------------------------------------------------------------
*/

export async function getDashboardOptimization(filters = {}) {

    const { siteId } = filters;

    validateSite(siteId);

    return getOptimizationDashboard(
        siteId
    );

}

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    getCurrentSystemState,

    calculateRenewableGeneration,

    calculateGeneratorCapacity,

    calculateBatteryCapacity,

    calculateGridCapacity,

    calculateNetLoad,

    calculateAvailablePower,

    calculatePowerBalance,

    getForecastInputs,

    calculateGridCost,

    calculateGeneratorFuelCost,

    calculateBatteryDegradationCost,

    calculateCarbonCost,

    calculateRenewableUtilization,

    calculateObjectiveFunction,

    validateBatteryConstraints,

    validateGeneratorConstraints,

    validateGridConstraints,

    validatePowerBalanceConstraint,

    validateOptimizationConstraints,

    optimizeBatteryDispatch,

    optimizeGeneratorDispatch,

    optimizeGridDispatch,

    optimizeSolarDispatch,

    performPeakShaving,

    performLoadShedding,

    performDemandResponse,

    performRuleBasedDispatch,

    saveOptimizationResult,

    optimizeWithForecast,

    calculateOptimizationScore,

    evaluateParetoSolutions,

    buildMILPModel,

    exportPyomoData,

    performNMinusOneAnalysis,

    getOptimizationDashboard,

    generateOptimizationReport,

    getDashboardOptimization

};