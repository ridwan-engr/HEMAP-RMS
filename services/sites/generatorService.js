import Generator from "../../models/Generator.js";

/*
|--------------------------------------------------------------------------
| Register Generator
|--------------------------------------------------------------------------
*/

export async function registerGenerator(data) {

    return await Generator.create(data);

}

/*
|--------------------------------------------------------------------------
| Get Generators
|--------------------------------------------------------------------------
*/

export async function getGenerators(filter = {}) {

    return await Generator.find(filter)
        .populate("site")
        .sort({
            createdAt: -1
        });

}

/*
|--------------------------------------------------------------------------
| Get Generator
|--------------------------------------------------------------------------
*/

export async function getGenerator(id) {

    return await Generator.findById(id)
        .populate("site");

}

/*
|--------------------------------------------------------------------------
| Update Generator
|--------------------------------------------------------------------------
*/

export async function updateGenerator(id, updates) {

    return await Generator.findByIdAndUpdate(

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
| Delete Generator
|--------------------------------------------------------------------------
*/

export async function deleteGenerator(id) {

    return await Generator.findByIdAndDelete(id);

}

/*
|--------------------------------------------------------------------------
| Calculate Daily Fuel Consumption
|--------------------------------------------------------------------------
*/

export async function calculateFuelConsumption(siteId) {

    const generators = await Generator.find({

        site: siteId

    });

    return Number(

        generators.reduce(

            (total, generator) =>

                total +

                (

                    (generator.fuelConsumptionRate || 0) *

                    (generator.todayRuntime || 0)

                ),

            0

        ).toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Calculate Runtime
|--------------------------------------------------------------------------
*/

export async function calculateRuntime(siteId) {

    const generators = await Generator.find({

        site: siteId

    });

    return {

        totalRuntime:

            generators.reduce(

                (sum, generator) =>

                    sum +

                    (generator.runtimeHours || 0),

                0

            ),

        todayRuntime:

            generators.reduce(

                (sum, generator) =>

                    sum +

                    (generator.todayRuntime || 0),

                0

            )

    };

}

/*
|--------------------------------------------------------------------------
| Calculate Generator Efficiency
|--------------------------------------------------------------------------
*/

export async function calculateGeneratorEfficiency(siteId) {

    const generators = await Generator.find({

        site: siteId

    });

    if (!generators.length) {

        return 0;

    }

    const efficiencies = generators.map(generator => {

        const rated = generator.ratedPower || 0;

        const output = generator.outputPower || 0;

        if (rated <= 0) {

            return 0;

        }

        return (output / rated) * 100;

    });

    const average =

        efficiencies.reduce(

            (sum, value) =>

                sum + value,

            0

        ) /

        generators.length;

    return Number(

        average.toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Generator Availability
|--------------------------------------------------------------------------
*/

export async function calculateGeneratorAvailability(siteId) {

    const generators = await Generator.find({

        site: siteId

    });

    if (!generators.length) {

        return 0;

    }

    const available = generators.filter(

        generator =>

            generator.status !== "FAULT"

    ).length;

    return Number(

        (

            (available / generators.length) *

            100

        ).toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Fuel Cost
|--------------------------------------------------------------------------
*/

export async function calculateGeneratorCost(

    siteId,

    fuelPrice = 0

) {

    const fuelConsumed =

        await calculateFuelConsumption(

            siteId

        );

    return Number(

        (

            fuelConsumed *

            fuelPrice

        ).toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Generator KPIs
|--------------------------------------------------------------------------
*/

export async function getGeneratorKPIs(

    siteId,

    fuelPrice = 0

) {

    const [

        runtime,

        fuelConsumption,

        efficiency,

        availability,

        fuelCost

    ] = await Promise.all([

        calculateRuntime(siteId),

        calculateFuelConsumption(siteId),

        calculateGeneratorEfficiency(siteId),

        calculateGeneratorAvailability(siteId),

        calculateGeneratorCost(

            siteId,

            fuelPrice

        )

    ]);

    return {

        runtime,

        fuelConsumption,

        efficiency,

        availability,

        fuelCost

    };

}

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    registerGenerator,

    getGenerators,

    getGenerator,

    updateGenerator,

    deleteGenerator,

    calculateFuelConsumption,

    calculateRuntime,

    calculateGeneratorEfficiency,

    calculateGeneratorAvailability,

    calculateGeneratorCost,

    getGeneratorKPIs

};