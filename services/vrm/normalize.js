import { Types } from "mongoose";

/**
 * Normalize telemetry from VRM.
 */
export function normalizeTelemetry(

    installation,

    telemetry,

    alarms,

    statistics

) {

    return {

        site: installation.site,

        installation: installation._id,

        installationId: installation.installationId,

        timestamp: telemetry.timestamp
            ? new Date(telemetry.timestamp)
            : new Date(),

        solarPower: Number(telemetry.pvPower ?? 0),

        batteryPower: Number(telemetry.batteryPower ?? 0),

        batterySOC: Number(telemetry.soc ?? 0),

        batteryVoltage: Number(telemetry.batteryVoltage ?? 0),

        batteryCurrent: Number(telemetry.batteryCurrent ?? 0),

        gridPower: Number(telemetry.gridPower ?? 0),

        generatorPower: Number(telemetry.generatorPower ?? 0),

        loadPower: Number(telemetry.loadPower ?? 0),

        inverterPower: Number(telemetry.inverterPower ?? 0),

        frequency: Number(telemetry.frequency ?? 0),

        temperature: Number(telemetry.temperature ?? 0),

        alarms,

        statistics

    };

}

/**
 * Normalize alarms.
 */
/**
 * Normalize Alarm from Victron VRM
 */
export function normalizeAlarm(installation, raw = {}) {

    return {

        site: installation.site,

        vrmAlarmId:
            String(raw.id ?? raw.alarmId ?? ""),

        name:
            raw.name ?? raw.title ?? "Unknown Alarm",

        category:
            raw.category ?? "SYSTEM",

        severity:
            normalizeSeverity(raw.severity),

        message:
            raw.message ?? raw.description ?? "",

        status:
            raw.cleared
                ? "RESOLVED"
                : "ACTIVE",

        startedAt:
            raw.startedAt
                ? new Date(raw.startedAt)
                : raw.timestamp
                    ? new Date(raw.timestamp)
                    : new Date(),

        resolvedAt:
            raw.cleared && raw.resolvedAt
                ? new Date(raw.resolvedAt)
                : null

    };

}


/**
 * Normalize Statistics from VRM
 */
export function normalizeStatistics(

    installation,

    raw = {}

) {

    return {

        site:

            installation.site,

        period:

            raw.period ?? "DAILY",

        timestamp:

            raw.timestamp
                ? new Date(raw.timestamp)
                : new Date(),

        energyGenerated:

            Number(raw.energyGenerated ?? 0),

        energyConsumed:

            Number(raw.energyConsumed ?? 0),

        gridAvailability:

            Number(raw.gridAvailability ?? 0),

        batteryEfficiency:

            Number(raw.batteryEfficiency ?? 0),

        renewableFraction:

            Number(raw.renewableFraction ?? 0),

        generatorRuntime:

            Number(raw.generatorRuntime ?? 0),

        saidi:

            Number(raw.saidi ?? 0),

        saifi:

            Number(raw.saifi ?? 0),

        ens:

            Number(raw.ens ?? 0),

        lolp:

            Number(raw.lolp ?? 0),

        resilience:

            Number(raw.resilience ?? 0)

    };

}

export function normalizeSeverity(severity) {

    switch ((severity || "").toLowerCase()) {

        case "critical":
        case "alarm":
        case "fatal":
            return "CRITICAL";

        case "warning":
        case "warn":
            return "WARNING";

        default:
            return "INFO";

    }

}