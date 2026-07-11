import Grid from "../../models/Grid.js";

/*
|--------------------------------------------------------------------------
| Register Grid
|--------------------------------------------------------------------------
*/

export async function registerGrid(data) {

    return await Grid.create(data);

}

/*
|--------------------------------------------------------------------------
| Get Grids
|--------------------------------------------------------------------------
*/

export async function getGrids(filter = {}) {

    return await Grid.find(filter)
        .populate("site")
        .sort({
            createdAt: -1
        });

}

/*
|--------------------------------------------------------------------------
| Get Grid
|--------------------------------------------------------------------------
*/

export async function getGrid(id) {

    return await Grid.findById(id)
        .populate("site");

}

/*
|--------------------------------------------------------------------------
| Update Grid
|--------------------------------------------------------------------------
*/

export async function updateGrid(id, updates) {

    return await Grid.findByIdAndUpdate(

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
| Delete Grid
|--------------------------------------------------------------------------
*/

export async function deleteGrid(id) {

    return await Grid.findByIdAndDelete(id);

}

/*
|--------------------------------------------------------------------------
| Imported Energy
|--------------------------------------------------------------------------
*/

export async function calculateGridImport(siteId) {

    const grids = await Grid.find({

        site: siteId

    });

    return Number(

        grids.reduce(

            (total, grid) =>

                total +

                (grid.importedEnergy || 0),

            0

        ).toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Exported Energy
|--------------------------------------------------------------------------
*/

export async function calculateGridExport(siteId) {

    const grids = await Grid.find({

        site: siteId

    });

    return Number(

        grids.reduce(

            (total, grid) =>

                total +

                (grid.exportedEnergy || 0),

            0

        ).toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Grid Availability
|--------------------------------------------------------------------------
*/

export async function calculateGridAvailability(siteId) {

    const grids = await Grid.find({

        site: siteId

    });

    if (!grids.length) {

        return 0;

    }

    const average =

        grids.reduce(

            (sum, grid) =>

                sum +

                (grid.availability || 0),

            0

        ) /

        grids.length;

    return Number(

        average.toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Grid Cost
|--------------------------------------------------------------------------
*/

export async function calculateGridCost(

    siteId,

    tariff = 0

) {

    const importedEnergy =

        await calculateGridImport(

            siteId

        );

    return Number(

        (

            importedEnergy *

            tariff

        ).toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Average Frequency
|--------------------------------------------------------------------------
*/

export async function calculateGridFrequency(siteId) {

    const grids = await Grid.find({

        site: siteId

    });

    if (!grids.length) {

        return 0;

    }

    const average =

        grids.reduce(

            (sum, grid) =>

                sum +

                (grid.frequency || 0),

            0

        ) /

        grids.length;

    return Number(

        average.toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Average Voltage
|--------------------------------------------------------------------------
*/

export async function calculateGridVoltage(siteId) {

    const grids = await Grid.find({

        site: siteId

    });

    if (!grids.length) {

        return 0;

    }

    const average =

        grids.reduce(

            (sum, grid) =>

                sum +

                (grid.voltage || 0),

            0

        ) /

        grids.length;

    return Number(

        average.toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Grid KPIs
|--------------------------------------------------------------------------
*/

export async function getGridKPIs(

    siteId,

    tariff = 0

) {

    const grids = await Grid.find({

        site: siteId

    });

    const [

        importedEnergy,

        exportedEnergy,

        availability,

        cost,

        frequency,

        voltage

    ] = await Promise.all([

        calculateGridImport(siteId),

        calculateGridExport(siteId),

        calculateGridAvailability(siteId),

        calculateGridCost(

            siteId,

            tariff

        ),

        calculateGridFrequency(siteId),

        calculateGridVoltage(siteId)

    ]);

    const reliability = {

        SAIDI: Number(

            (

                grids.reduce(

                    (sum, grid) =>

                        sum +

                        (grid.SAIDI || 0),

                    0

                ) /

                (grids.length || 1)

            ).toFixed(2)

        ),

        SAIFI: Number(

            (

                grids.reduce(

                    (sum, grid) =>

                        sum +

                        (grid.SAIFI || 0),

                    0

                ) /

                (grids.length || 1)

            ).toFixed(2)

        ),

        ENS: Number(

            grids.reduce(

                (sum, grid) =>

                    sum +

                    (grid.ENS || 0),

                0

            ).toFixed(2)

        )

    };

    return {

        importedEnergy,

        exportedEnergy,

        availability,

        cost,

        frequency,

        voltage,

        reliability

    };

}

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    registerGrid,

    getGrids,

    getGrid,

    updateGrid,

    deleteGrid,

    calculateGridImport,

    calculateGridExport,

    calculateGridAvailability,

    calculateGridCost,

    calculateGridFrequency,

    calculateGridVoltage,

    getGridKPIs

};