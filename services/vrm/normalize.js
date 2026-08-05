/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function value(attribute) {

    if (!attribute) return 0;

    if (attribute.rawValue !== undefined)
        return Number(attribute.rawValue);

    if (

        Array.isArray(attribute.instances) &&

        attribute.instances.length

    ) {

        return Number(

            attribute.instances[0].rawValue

        );

    }

    return 0;

}

/*
|--------------------------------------------------------------------------
| Normalize Telemetry
|--------------------------------------------------------------------------
*/

export function normalizeTelemetry(

    installation,

    dashboard = {},

    alarms = [],

    statistics = {}

) {

    const attributes =
        dashboard.attributes ?? {};

    const totals =
        statistics.totals ?? {};

    return {

        site:
            installation.site,

        installation:
            installation._id,

        installationId:
            installation.installationId,

        timestamp:
            new Date(),

        firmware:
            attributes.v?.formattedValue ?? "",

        batterySOC:
            value(attributes.SOC),

        batteryVoltage:
            value(attributes.BV),

        batteryCurrent:
            value(attributes.BC),

        batteryPower:
            value(attributes.BP),

        solarPower:
            value(attributes.PPV),

        solarVoltage:
            value(attributes.PV),

        inverterPower:
            value(attributes.P),

        gridVoltage:
            value(attributes.IV1),

        gridFrequency:
            value(attributes.IF1),

        generatorPower:
            totals.total_genset ?? 0,

        loadPower:
            totals.total_consumption ?? 0,

        alarms,

        statistics

    };

}

/*
|--------------------------------------------------------------------------
| Normalize Statistics
|--------------------------------------------------------------------------
*/

export function normalizeStatistics(

    installation,

    statistics = {}

) {

    const totals =
        statistics.totals ?? {};

    return {

        site:
            installation.site,

        installation:
            installation._id,

        installationId:
            installation.installationId,

        timestamp:
            new Date(),

        batterySOC:
            totals.bs ?? 0,

        batteryVoltage:
            totals.bv ?? 0,

        energyConsumed:
            totals.total_consumption ?? 0,

        generatorEnergy:
            totals.total_genset ?? 0,

        solarYield:
            totals.total_solar_yield ?? 0,

        gridImport:
            totals.grid_history_from ?? 0,

        gridExport:
            totals.grid_history_to ?? 0

    };

}

/*
|--------------------------------------------------------------------------
| Normalize Alarm
|--------------------------------------------------------------------------
*/

export function normalizeAlarm(

    installation,

    raw

) {

    return {

        site:
            installation.site,

        installation:
            installation._id,

        installationId:
            installation.installationId,

        vrmAlarmId:
            String(

                raw.id ??

                raw.alarmId ??

                raw.code ??

                ""

            ),

        name:

            raw.name ??

            raw.title ??

            raw.description ??

            "Unknown Alarm",

        severity:
            normalizeSeverity(

                raw.severity

            ),

        category:

            raw.category ??

            "SYSTEM",

        message:

            raw.message ??

            raw.description ??

            "",

        status:

            raw.cleared

                ? "RESOLVED"

                : "ACTIVE",

        startedAt:

            raw.timestamp

                ? new Date(

                    raw.timestamp * 1000

                )

                : new Date(),

        resolvedAt:

            raw.cleared

                ? new Date()

                : null

    };

}

/*
|--------------------------------------------------------------------------
| Severity
|--------------------------------------------------------------------------
*/

export function normalizeSeverity(

    severity

) {

    switch (

        String(severity)

            .toLowerCase()

    ) {

        case "critical":

        case "alarm":

        case "fatal":

            return "CRITICAL";

        case "warning":

            return "WARNING";

        case "info":

            return "INFO";

        default:

            return "INFO";

    }

}

export default {

    normalizeTelemetry,

    normalizeStatistics,

    normalizeAlarm,

    normalizeSeverity

};