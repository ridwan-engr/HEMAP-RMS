/*
|--------------------------------------------------------------------------
| Build Optimization Constraints
|--------------------------------------------------------------------------
*/

export function build(userConstraints = {}) {

    return {

        /*
        |--------------------------------------------------------------------------
        | Battery
        |--------------------------------------------------------------------------
        */

        battery: {

            minimumSOC:

                userConstraints.minimumSOC ?? 20,

            maximumSOC:

                userConstraints.maximumSOC ?? 95,

            reserveSOC:

                userConstraints.reserveSOC ?? 30,

            maximumChargePower:

                userConstraints.maximumChargePower ?? null,

            maximumDischargePower:

                userConstraints.maximumDischargePower ?? null,

            chargingEfficiency:

                userConstraints.chargingEfficiency ?? 0.95,

            dischargingEfficiency:

                userConstraints.dischargingEfficiency ?? 0.95

        },

        /*
        |--------------------------------------------------------------------------
        | Generator
        |--------------------------------------------------------------------------
        */

        generator: {

            maximumPower:

                userConstraints.maximumGeneratorPower ?? null,

            minimumLoading:

                userConstraints.minimumGeneratorLoading ?? 30,

            minimumRuntime:

                userConstraints.minimumRuntime ?? 1,

            startupLimit:

                userConstraints.maximumStartups ?? null

        },

        /*
        |--------------------------------------------------------------------------
        | Grid
        |--------------------------------------------------------------------------
        */

        grid: {

            maximumImport:

                userConstraints.maximumGridImport ?? null,

            maximumExport:

                userConstraints.maximumGridExport ?? null

        },

        /*
        |--------------------------------------------------------------------------
        | Renewable
        |--------------------------------------------------------------------------
        */

        renewable: {

            target:

                userConstraints.renewableTarget ?? 0

        },

        /*
        |--------------------------------------------------------------------------
        | Reliability
        |--------------------------------------------------------------------------
        */

        reliability: {

            maximumENS:

                userConstraints.maximumENS ?? null,

            maximumLOLP:

                userConstraints.maximumLOLP ?? null,

            maximumLOLE:

                userConstraints.maximumLOLE ?? null,

            maximumSAIDI:

                userConstraints.maximumSAIDI ?? null,

            maximumSAIFI:

                userConstraints.maximumSAIFI ?? null

        },

        /*
        |--------------------------------------------------------------------------
        | Emissions
        |--------------------------------------------------------------------------
        */

        emissions: {

            maximumCO2:

                userConstraints.maximumCO2 ?? null

        },

        /*
        |--------------------------------------------------------------------------
        | Solver
        |--------------------------------------------------------------------------
        */

        solver: {

            mipGap:

                userConstraints.mipGap ?? 0.001,

            timeLimit:

                userConstraints.timeLimit ?? 300,

            threads:

                userConstraints.threads ?? 4

        }

    };

}