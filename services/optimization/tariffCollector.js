import Site from "../../models/Site.js";
import SystemSetting from "../../models/SystemSetting.js";
import logger from "../../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Helper
|--------------------------------------------------------------------------
*/

async function getSetting(key, defaultValue = null) {
    const setting = await SystemSetting.findOne({ key }).lean();

    if (!setting) {
        return defaultValue;
    }

    const value = Number(setting.value);

    return Number.isFinite(value)
        ? value
        : defaultValue;
}

/*
|--------------------------------------------------------------------------
| Collect Tariff Information
|--------------------------------------------------------------------------
|
| Returns the tariff object required by the Python
| Optimization Service.
|
*/

export async function collect(siteId) {

    const site = await Site.findById(siteId).lean();

    if (!site) {
        throw new Error("Site not found.");
    }

    /*
    |--------------------------------------------------------------------------
    | Defaults
    |--------------------------------------------------------------------------
    */

    const defaults = {

        gridImportTariff: await getSetting(
            "GRID_IMPORT_TARIFF",
            0.25
        ),

        gridExportTariff: await getSetting(
            "GRID_EXPORT_TARIFF",
            0.08
        ),

        dieselPrice: await getSetting(
            "DIESEL_PRICE",
            1.35
        ),

        batteryCycleCost: await getSetting(
            "BATTERY_CYCLE_COST",
            0.02
        ),

        carbonCost: await getSetting(
            "CARBON_COST",
            0.01
        )

    };

    /*
    |--------------------------------------------------------------------------
    | Site Override (Optional)
    |--------------------------------------------------------------------------
    |
    | Future-proof:
    | If later you add tariff information directly to
    | the Site document, those values automatically
    | override the global defaults.
    |
    */

    const tariff = {

        gridImportTariff:
            site.energy?.gridImportTariff ??
            defaults.gridImportTariff,

        gridExportTariff:
            site.energy?.gridExportTariff ??
            defaults.gridExportTariff,

        dieselPrice:
            site.energy?.dieselPrice ??
            defaults.dieselPrice,

        batteryCycleCost:
            site.energy?.batteryCycleCost ??
            defaults.batteryCycleCost,

        carbonCost:
            site.energy?.carbonCost ??
            defaults.carbonCost

    };

    logger.info(
        `Optimization tariff collected for site ${siteId}`,
        tariff
    );

    return tariff;
}