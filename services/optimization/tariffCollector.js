import SystemSetting from "../../models/SystemSetting.js";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

async function getSetting(key, defaultValue = null) {

    const setting = await SystemSetting.findOne({ key });

    return setting ? setting.value : defaultValue;

}

/*
|--------------------------------------------------------------------------
| Collect Tariff Information
|--------------------------------------------------------------------------
*/

export async function collect(siteId) {

    /*
    |--------------------------------------------------------------------------
    | Grid Tariff
    |--------------------------------------------------------------------------
    */

    const gridImportTariff = Number(

        await getSetting(

            "GRID_IMPORT_TARIFF",

            0.25

        )

    );

    const gridExportTariff = Number(

        await getSetting(

            "GRID_EXPORT_TARIFF",

            0.10

        )

    );

    /*
    |--------------------------------------------------------------------------
    | Diesel
    |--------------------------------------------------------------------------
    */

    const dieselPrice = Number(

        await getSetting(

            "DIESEL_PRICE",

            1.50

        )

    );

    /*
    |--------------------------------------------------------------------------
    | Generator
    |--------------------------------------------------------------------------
    */

    const generatorMaintenanceCost = Number(

        await getSetting(

            "GENERATOR_MAINTENANCE_COST",

            0.02

        )

    );

    /*
    |--------------------------------------------------------------------------
    | Battery
    |--------------------------------------------------------------------------
    */

    const batteryCycleCost = Number(

        await getSetting(

            "BATTERY_CYCLE_COST",

            0.03

        )

    );

    /*
    |--------------------------------------------------------------------------
    | Carbon
    |--------------------------------------------------------------------------
    */

    const carbonCost = Number(

        await getSetting(

            "CARBON_COST",

            0

        )

    );

    /*
    |--------------------------------------------------------------------------
    | Renewable Incentive
    |--------------------------------------------------------------------------
    */

    const renewableCredit = Number(

        await getSetting(

            "RENEWABLE_INCENTIVE",

            0

        )

    );

    return {

        gridImportTariff,

        gridExportTariff,

        dieselPrice,

        generatorMaintenanceCost,

        batteryCycleCost,

        carbonCost,

        renewableCredit

    };

}