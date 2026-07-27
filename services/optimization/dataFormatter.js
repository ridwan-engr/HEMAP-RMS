/*
|--------------------------------------------------------------------------
| HEMAP Optimization Payload Formatter
|--------------------------------------------------------------------------
|
| Final payload normalization before sending to the FastAPI
| Optimization Service.
|
| Responsibilities
| • Validate required sections
| • Normalize timestamps
| • Normalize numeric values
| • Apply safe defaults
| • Return OptimizationRequest schema
|
*/

function ensureArray(value, name) {

    if (!Array.isArray(value)) {

        throw new Error(`${name} must be an array.`);

    }

    if (value.length === 0) {

        throw new Error(`${name} cannot be empty.`);

    }

    return value;

}

function ensureObject(value, name) {

    if (

        !value ||

        typeof value !== "object" ||

        Array.isArray(value)

    ) {

        throw new Error(`${name} must be an object.`);

    }

    return value;

}

function number(value, fallback = 0) {

    const n = Number(value);

    return Number.isFinite(n)

        ? n

        : fallback;

}

function timestamp(value) {

    if (!value) {

        return new Date().toISOString();

    }

    return new Date(value).toISOString();

}

/*
|--------------------------------------------------------------------------
| Formatter
|--------------------------------------------------------------------------
*/

export function format({

    telemetry,

    forecast,

    tariff,

    constraints,

    objectives,

    solver = {},

    metadata = {}

}) {

    telemetry = ensureArray(

        telemetry,

        "telemetry"

    ).map(item => ({

        timestamp:

            timestamp(item.timestamp),

        load:

            number(item.load),

        solar:

            number(item.solar),

        batterySOC:

            number(item.batterySOC),

        generator:

            number(item.generator),

        grid:

            number(item.grid)

    }));


    forecast = ensureArray(

        forecast,

        "forecast"

    ).map(item => ({

        timestamp:

            timestamp(item.timestamp),

        expectedSolar:

            number(item.expectedSolar),

        expectedLoad:

            number(item.expectedLoad),

        irradiance:

            number(item.irradiance),

        temperature:

            number(item.temperature)

    }));


    tariff = {

        gridImportTariff:

            number(tariff.gridImportTariff),

        gridExportTariff:

            number(tariff.gridExportTariff),

        dieselPrice:

            number(tariff.dieselPrice),

        batteryCycleCost:

            number(tariff.batteryCycleCost),

        carbonCost:

            number(tariff.carbonCost)

    };


    constraints = ensureObject(

        constraints,

        "constraints"

    );

    objectives = ensureObject(

        objectives,

        "objectives"

    );


    solver = {

        name:

            solver.name || "highs",

        threads:

            number(solver.threads, 4),

        mipGap:

            number(solver.mipGap, 0.01),

        timeLimit:

            number(solver.timeLimit, 300)

    };


    metadata = {

        siteId:

            metadata.siteId ?? null,

        scenario:

            metadata.scenario ?? "NORMAL",

        userId:

            metadata.userId ?? null,

        requestId:

            metadata.requestId ?? null

    };


    return {

        telemetry,

        forecast,

        tariff,

        constraints,

        objectives,

        solver,

        metadata

    };

}

export default {

    format

};