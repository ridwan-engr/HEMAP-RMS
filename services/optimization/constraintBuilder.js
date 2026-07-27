/*
|--------------------------------------------------------------------------
| HEMAP Constraint Builder
|--------------------------------------------------------------------------
|
| Builds optimization constraints from:
|   1. Site Configuration (default equipment ratings)
|   2. Live VRM configuration (if available)
|   3. User overrides
|
| Priority:
| User Override > Site Configuration > Defaults
|
*/

const DEFAULTS = {

    battery: {

        capacity: 100,

        minimumSOC: 20,

        maximumSOC: 95,

        initialSOC: 80,

        maximumChargePower: 50,

        maximumDischargePower: 50,

        chargingEfficiency: 0.95,

        dischargingEfficiency: 0.95

    },

    generator: {

        minimumPower: 0,

        maximumPower: 100,

        startupCost: 0

    },

    grid: {

        maximumImport: 100,

        maximumExport: 50

    }

};

function number(value, fallback) {

    const n = Number(value);

    return Number.isFinite(n)

        ? n

        : fallback;

}

export function buildContraints(

    siteConfiguration = {},

    userConstraints = {}

) {

    const batteryConfig = siteConfiguration.battery ?? {};

    const generatorConfig = siteConfiguration.generator ?? {};

    const gridConfig = siteConfiguration.grid ?? {};

    const batteryOverride = userConstraints.battery ?? {};

    const generatorOverride = userConstraints.generator ?? {};

    const gridOverride = userConstraints.grid ?? {};

    const battery = {

        capacity: number(

            batteryOverride.capacity,

            batteryConfig.capacity ??

            DEFAULTS.battery.capacity

        ),

        minimumSOC: number(

            batteryOverride.minimumSOC,

            batteryConfig.minimumSOC ??

            DEFAULTS.battery.minimumSOC

        ),

        maximumSOC: number(

            batteryOverride.maximumSOC,

            batteryConfig.maximumSOC ??

            DEFAULTS.battery.maximumSOC

        ),

        initialSOC: number(

            batteryOverride.initialSOC,

            batteryConfig.initialSOC ??

            DEFAULTS.battery.initialSOC

        ),

        maximumChargePower: number(

            batteryOverride.maximumChargePower,

            batteryConfig.maximumChargePower ??

            DEFAULTS.battery.maximumChargePower

        ),

        maximumDischargePower: number(

            batteryOverride.maximumDischargePower,

            batteryConfig.maximumDischargePower ??

            DEFAULTS.battery.maximumDischargePower

        ),

        chargingEfficiency: number(

            batteryOverride.chargingEfficiency,

            batteryConfig.chargingEfficiency ??

            DEFAULTS.battery.chargingEfficiency

        ),

        dischargingEfficiency: number(

            batteryOverride.dischargingEfficiency,

            batteryConfig.dischargingEfficiency ??

            DEFAULTS.battery.dischargingEfficiency

        )

    };

    if (battery.minimumSOC >= battery.maximumSOC) {

        throw new Error(

            "Battery minimumSOC must be less than maximumSOC."

        );

    }

    if (battery.capacity <= 0) {

        throw new Error(

            "Battery capacity must be positive."

        );

    }

    const generator = {

        minimumPower: number(

            generatorOverride.minimumPower,

            generatorConfig.minimumPower ??

            DEFAULTS.generator.minimumPower

        ),

        maximumPower: number(

            generatorOverride.maximumPower,

            generatorConfig.maximumPower ??

            DEFAULTS.generator.maximumPower

        ),

        startupCost: number(

            generatorOverride.startupCost,

            generatorConfig.startupCost ??

            DEFAULTS.generator.startupCost

        )

    };

    if (generator.minimumPower > generator.maximumPower) {

        throw new Error(

            "Generator minimumPower cannot exceed maximumPower."

        );

    }

    const grid = {

        maximumImport: number(

            gridOverride.maximumImport,

            gridConfig.maximumImport ??

            DEFAULTS.grid.maximumImport

        ),

        maximumExport: number(

            gridOverride.maximumExport,

            gridConfig.maximumExport ??

            DEFAULTS.grid.maximumExport

        )

    };

    return {

        battery,

        generator,

        grid

    };

}

export default {

    buildContraints

};