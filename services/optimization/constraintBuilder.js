/*
|--------------------------------------------------------------------------
| HEMAP Constraint Builder
|--------------------------------------------------------------------------
|
| Builds optimization constraints compatible with the FastAPI
| OptimizationRequest schema.
|
| Output Structure
| ----------------
| constraints
|   ├── battery
|   ├── generator
|   └── grid
|
*/

export function build(userConstraints = {}) {

    return {

        /*
        |--------------------------------------------------------------------------
        | Battery Constraints
        |--------------------------------------------------------------------------
        */

        battery: {

            // Battery Energy Capacity (kWh)
            capacity:
                Number(userConstraints.capacity ?? 100),

            // SOC Limits (%)
            minimumSOC:
                Number(userConstraints.minimumSOC ?? 20),

            maximumSOC:
                Number(userConstraints.maximumSOC ?? 95),

            // Initial Battery SOC (%)
            initialSOC:
                Number(userConstraints.initialSOC ?? 80),

            // Charge / Discharge Limits (kW)
            maximumChargePower:
                Number(userConstraints.maximumChargePower ?? 50),

            maximumDischargePower:
                Number(userConstraints.maximumDischargePower ?? 50),

            // Battery Efficiency
            chargingEfficiency:
                Number(userConstraints.chargingEfficiency ?? 0.95),

            dischargingEfficiency:
                Number(userConstraints.dischargingEfficiency ?? 0.95)

        },

        /*
        |--------------------------------------------------------------------------
        | Generator Constraints
        |--------------------------------------------------------------------------
        */

        generator: {

            minimumPower:
                Number(userConstraints.minimumGeneratorPower ?? 0),

            maximumPower:
                Number(userConstraints.maximumGeneratorPower ?? 100),

            startupCost:
                Number(userConstraints.generatorStartupCost ?? 0)

        },

        /*
        |--------------------------------------------------------------------------
        | Grid Constraints
        |--------------------------------------------------------------------------
        */

        grid: {

            maximumImport:
                Number(userConstraints.maximumGridImport ?? 1000),

            maximumExport:
                Number(userConstraints.maximumGridExport ?? 1000)

        }

    };

}