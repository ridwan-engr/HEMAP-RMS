import Site from "../../models/Site.js";
import SystemSetting from "../../models/SystemSetting.js";
import logger from "../../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Helper
|--------------------------------------------------------------------------
*/

async function getSetting(key, defaultValue = null) {

    const setting = await SystemSetting.findOne({ key });

    return setting ? setting.value : defaultValue;

}

/*
|--------------------------------------------------------------------------
| Site Configuration
|--------------------------------------------------------------------------
*/

export async function collect(siteId) {

    const site = await Site.findById(siteId).lean();

    if (!site) {

        throw new Error("Site not found.");

    }

    /*
    |--------------------------------------------------------------------------
    | Battery
    |--------------------------------------------------------------------------
    */

    const battery = {

        capacity:

            Number(
                site.batteryCapacity ??
                await getSetting("DEFAULT_BATTERY_CAPACITY", 100)
            ),

        minimumSOC:

            Number(
                site.minimumSOC ??
                await getSetting("DEFAULT_MIN_SOC", 20)
            ),

        maximumSOC:

            Number(
                site.maximumSOC ??
                await getSetting("DEFAULT_MAX_SOC", 95)
            ),

        initialSOC:

            Number(
                site.initialSOC ??
                await getSetting("DEFAULT_INITIAL_SOC", 60)
            ),

        maximumChargePower:

            Number(
                site.maximumChargePower ??
                await getSetting("DEFAULT_MAX_CHARGE_POWER", 50)
            ),

        maximumDischargePower:

            Number(
                site.maximumDischargePower ??
                await getSetting("DEFAULT_MAX_DISCHARGE_POWER", 50)
            ),

        chargingEfficiency:

            Number(
                site.chargingEfficiency ??
                await getSetting("DEFAULT_CHARGE_EFFICIENCY", 0.95)
            ),

        dischargingEfficiency:

            Number(
                site.dischargingEfficiency ??
                await getSetting("DEFAULT_DISCHARGE_EFFICIENCY", 0.95)
            )

    };

    /*
    |--------------------------------------------------------------------------
    | Generator
    |--------------------------------------------------------------------------
    */

    const generator = {

        minimumPower:

            Number(
                site.generatorMinimumPower ??
                await getSetting("DEFAULT_GENERATOR_MIN_POWER", 10)
            ),

        maximumPower:

            Number(
                site.generatorMaximumPower ??
                await getSetting("DEFAULT_GENERATOR_MAX_POWER", 80)
            ),

        startupCost:

            Number(
                site.generatorStartupCost ??
                await getSetting("DEFAULT_GENERATOR_STARTUP_COST", 5)
            )

    };

    /*
    |--------------------------------------------------------------------------
    | Grid
    |--------------------------------------------------------------------------
    */

    const grid = {

        maximumImport:

            Number(
                site.maximumGridImport ??
                await getSetting("DEFAULT_GRID_IMPORT_LIMIT", 100)
            ),

        maximumExport:

            Number(
                site.maximumGridExport ??
                await getSetting("DEFAULT_GRID_EXPORT_LIMIT", 50)
            )

    };

    logger.info(
        `Optimization configuration loaded for site ${siteId}`
    );

    return {

        battery,

        generator,

        grid

    };

}