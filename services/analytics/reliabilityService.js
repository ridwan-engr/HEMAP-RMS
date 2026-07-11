import Fault from "../../models/Fault.js";
import Statistic from "../../models/Statistics.js";
import Telemetry from "../../models/Telemetry.js";
import Site from "../../models/Site.js";

/*
|--------------------------------------------------------------------------
| Get Site Faults
|--------------------------------------------------------------------------
*/

export async function getFaultHistory(
    siteId,
    filters = {}
) {

    const query = {
        site: siteId
    };

    if (filters.status) {
        query.status = filters.status;
    }

    if (filters.startDate || filters.endDate) {

        query.startedAt = {};

        if (filters.startDate) {
            query.startedAt.$gte = filters.startDate;
        }

        if (filters.endDate) {
            query.startedAt.$lte = filters.endDate;
        }

    }

    return await Fault.find(query)
        .sort({
            startedAt: -1
        });

}

/*
|--------------------------------------------------------------------------
| Total Interruptions
|--------------------------------------------------------------------------
*/

export async function getTotalInterruptions(siteId) {

    return await Fault.countDocuments({

        site: siteId,

        status: {

            $in: [
                "RESOLVED",
                "ACTIVE"
            ]

        }

    });

}

/*
|--------------------------------------------------------------------------
| Total Outage Duration
|--------------------------------------------------------------------------
*/

export async function getTotalOutageDuration(siteId) {

    const faults =
        await getFaultHistory(siteId);

    let minutes = 0;

    faults.forEach(fault => {

        if (!fault.startedAt) {

            return;

        }

        const end =
            fault.resolvedAt ??
            new Date();

        minutes +=
            (end - fault.startedAt) /
            60000;

    });

    return Number(
        minutes.toFixed(2)
    );

}

/*
|--------------------------------------------------------------------------
| Average Restoration Time
|--------------------------------------------------------------------------
*/

export async function getAverageRestorationTime(siteId) {

    const total =
        await getTotalOutageDuration(siteId);

    const count =
        await getTotalInterruptions(siteId);

    return count > 0
        ? Number(
            (total / count).toFixed(2)
        )
        : 0;

}

/*
|--------------------------------------------------------------------------
| Current Availability
|--------------------------------------------------------------------------
*/

export async function calculateAvailability(siteId) {

    const latest =
        await Telemetry.findOne({

            site: siteId

        })

        .sort({

            timestamp: -1

        });

    if (!latest) {

        return 0;

    }

    const supply =

        (latest.gridPower ?? 0) +

        (latest.generatorPower ?? 0) +

        (latest.solarPower ?? 0);

    const demand =

        latest.loadPower ?? 0;

    if (demand <= 0) {

        return 100;

    }

    return Number(

        (

            Math.min(
                supply,
                demand
            ) / demand

        * 100

        ).toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Mean Time Between Failures (MTBF)
|--------------------------------------------------------------------------
*/

export async function calculateMTBF(siteId) {

    const faults =
        await getFaultHistory(siteId);

    if (faults.length < 2) {

        return 0;

    }

    let total = 0;

    for (
        let i = 1;
        i < faults.length;
        i++
    ) {

        total +=
            (

                faults[i - 1].startedAt -

                faults[i].startedAt

            ) / 3600000;

    }

    return Number(

        (

            total /

            (faults.length - 1)

        ).toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Mean Time To Repair (MTTR)
|--------------------------------------------------------------------------
*/

export async function calculateMTTR(siteId) {

    const total =
        await getTotalOutageDuration(siteId);

    const count =
        await getTotalInterruptions(siteId);

    return count > 0

        ? Number(

            (

                total /

                count

            ).toFixed(2)

        )

        : 0;

}

/*
|--------------------------------------------------------------------------
| Total Customers Served
|--------------------------------------------------------------------------
*/

export async function getTotalCustomers(siteId) {

    const site = await Site.findById(siteId)
        .select("customerCount");

    return site?.customerCount ?? 1;

}

/*
|--------------------------------------------------------------------------
| SAIDI
|--------------------------------------------------------------------------
*/

export async function calculateSAIDI(siteId) {

    const faults =
        await getFaultHistory(siteId);

    const customers =
        await getTotalCustomers(siteId);

    let customerMinutes = 0;

    faults.forEach(fault => {

        const start = fault.startedAt;

        const end =
            fault.resolvedAt ??
            new Date();

        const duration =

            (end - start) / 60000;

        const affected =

            fault.affectedCustomers ??
            customers;

        customerMinutes +=
            duration * affected;

    });

    return Number(

        (

            customerMinutes /

            customers

        ).toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| SAIFI
|--------------------------------------------------------------------------
*/

export async function calculateSAIFI(siteId) {

    const faults =
        await getFaultHistory(siteId);

    const customers =
        await getTotalCustomers(siteId);

    const interruptions =
        faults.reduce(

            (sum, fault) => {

                return sum +

                    (

                        fault.affectedCustomers ??

                        customers

                    );

            },

            0

        );

    return Number(

        (

            interruptions /

            customers

        ).toFixed(4)

    );

}

/*
|--------------------------------------------------------------------------
| CAIDI
|--------------------------------------------------------------------------
*/

export async function calculateCAIDI(siteId) {

    const saidi =
        await calculateSAIDI(siteId);

    const saifi =
        await calculateSAIFI(siteId);

    if (saifi === 0) {

        return 0;

    }

    return Number(

        (

            saidi /

            saifi

        ).toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| ASAI
|--------------------------------------------------------------------------
*/

export async function calculateASAI(siteId) {

    const customers =
        await getTotalCustomers(siteId);

    const saidi =
        await calculateSAIDI(siteId);

    const minutesPerYear =
        525600;

    const asai =

        1 -

        (

            saidi /

            minutesPerYear

        );

    return Number(

        asai.toFixed(6)

    );

}

/*
|--------------------------------------------------------------------------
| ASUI
|--------------------------------------------------------------------------
*/

export async function calculateASUI(siteId) {

    const asai =
        await calculateASAI(siteId);

    return Number(

        (

            1 - asai

        ).toFixed(6)

    );

}

/*
|--------------------------------------------------------------------------
| Energy Not Supplied (ENS)
|--------------------------------------------------------------------------
*/

export async function calculateENS(siteId) {

    const faults =
        await getFaultHistory(siteId);

    let ens = 0;

    faults.forEach(fault => {

        const start =
            fault.startedAt;

        const end =
            fault.resolvedAt ??
            new Date();

        const durationHours =

            (end - start) / 3600000;

        const interruptedLoad =

            fault.interruptedLoad ??

            0;

        ens +=

            interruptedLoad *

            durationHours;

    });

    return Number(

        ens.toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Expected ENS (EENS)
|--------------------------------------------------------------------------
*/

export async function calculateEENS(siteId) {

    const ens =
        await calculateENS(siteId);

    const interruptions =
        await getTotalInterruptions(siteId);

    if (interruptions === 0) {

        return 0;

    }

    return Number(

        (

            ens /

            interruptions

        ).toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Loss of Load Probability (LOLP)
|--------------------------------------------------------------------------
*/

export async function calculateLOLP(siteId) {

    const faults =
        await getTotalInterruptions(siteId);

    const samples =
        await Telemetry.countDocuments({

            site: siteId

        });

    if (samples === 0) {

        return 0;

    }

    return Number(

        (

            faults /

            samples

        ).toFixed(6)

    );

}

/*
|--------------------------------------------------------------------------
| Loss of Load Expectation (LOLE)
|--------------------------------------------------------------------------
*/

export async function calculateLOLE(siteId) {

    const lolp =
        await calculateLOLP(siteId);

    const hoursPerYear =
        8760;

    return Number(

        (

            lolp *

            hoursPerYear

        ).toFixed(2)

    );

}

/*
|--------------------------------------------------------------------------
| Overall Reliability Index
|--------------------------------------------------------------------------
*/

export async function calculateReliabilityIndex(siteId) {

    const [
        asai,
        lolp
    ] = await Promise.all([

        calculateASAI(siteId),

        calculateLOLP(siteId)

    ]);

    const index =

        (asai * 0.80) +

        ((1 - lolp) * 0.20);

    return Number(

        index.toFixed(4)

    );

}

/*
|--------------------------------------------------------------------------
| System Resilience Score
|--------------------------------------------------------------------------
*/

export async function calculateResilienceScore(siteId) {

    const [

        mtbf,

        mttr

    ] = await Promise.all([

        calculateMTBF(siteId),

        calculateMTTR(siteId)

    ]);

    if (mtbf === 0) {

        return 0;

    }

    const score =

        mtbf /

        (mtbf + mttr);

    return Number(

        score.toFixed(4)

    );

}

/*
|--------------------------------------------------------------------------
| Failure Rate (Failures/Year)
|--------------------------------------------------------------------------
*/

export async function calculateFailureRate(siteId) {

    const failures =

        await getTotalInterruptions(siteId);

    return Number(

        (

            failures / 365

        ).toFixed(4)

    );

}

/*
|--------------------------------------------------------------------------
| Repair Rate
|--------------------------------------------------------------------------
*/

export async function calculateRepairRate(siteId) {

    const mttr =

        await calculateMTTR(siteId);

    if (mttr === 0) {

        return 0;

    }

    return Number(

        (

            1 / mttr

        ).toFixed(6)

    );

}

/*
|--------------------------------------------------------------------------
| Outage Frequency
|--------------------------------------------------------------------------
*/

export async function calculateOutageFrequency(siteId) {

    const interruptions =

        await getTotalInterruptions(siteId);

    const telemetrySamples =

        await Telemetry.countDocuments({

            site: siteId

        });

    if (telemetrySamples === 0) {

        return 0;

    }

    return Number(

        (

            interruptions /

            telemetrySamples

        ).toFixed(6)

    );

}

/*
|--------------------------------------------------------------------------
| Service Reliability
|--------------------------------------------------------------------------
*/

export async function calculateServiceReliability(siteId) {

    const [

        availability,

        asai

    ] = await Promise.all([

        calculateAvailability(siteId),

        calculateASAI(siteId)

    ]);

    return Number(

        (

            (

                availability / 100

            ) *

            asai

        ).toFixed(4)

    );

}

/*
|--------------------------------------------------------------------------
| Risk Classification
|--------------------------------------------------------------------------
*/

export async function calculateRiskLevel(siteId) {

    const [

        lolp,

        mttr

    ] = await Promise.all([

        calculateLOLP(siteId),

        calculateMTTR(siteId)

    ]);

    if (

        lolp > 0.10 ||

        mttr > 240

    ) {

        return "HIGH";

    }

    if (

        lolp > 0.05 ||

        mttr > 120

    ) {

        return "MEDIUM";

    }

    return "LOW";

}

/*
|--------------------------------------------------------------------------
| Reliability Trend
|--------------------------------------------------------------------------
*/

export async function calculateReliabilityTrend(siteId) {

    const history =

        await Statistic.find({

            site: siteId

        })

        .sort({

            timestamp: -1

        })

        .limit(30)

        .select(

            "timestamp reliability"

        );

    return history.reverse();

}

/*
|--------------------------------------------------------------------------
| Reliability KPI Dashboard
|--------------------------------------------------------------------------
*/

export async function buildReliabilityKPIs(siteId) {

    const [

        availability,

        mtbf,

        mttr,

        saidi,

        saifi,

        caidi,

        asai,

        asui,

        ens,

        eens,

        lolp,

        lole,

        reliability,

        resilience,

        failureRate,

        repairRate,

        outageFrequency,

        serviceReliability,

        risk

    ] = await Promise.all([

        calculateAvailability(siteId),

        calculateMTBF(siteId),

        calculateMTTR(siteId),

        calculateSAIDI(siteId),

        calculateSAIFI(siteId),

        calculateCAIDI(siteId),

        calculateASAI(siteId),

        calculateASUI(siteId),

        calculateENS(siteId),

        calculateEENS(siteId),

        calculateLOLP(siteId),

        calculateLOLE(siteId),

        calculateReliabilityIndex(siteId),

        calculateResilienceScore(siteId),

        calculateFailureRate(siteId),

        calculateRepairRate(siteId),

        calculateOutageFrequency(siteId),

        calculateServiceReliability(siteId),

        calculateRiskLevel(siteId)

    ]);

    return {

        availability,

        mtbf,

        mttr,

        saidi,

        saifi,

        caidi,

        asai,

        asui,

        ens,

        eens,

        lolp,

        lole,

        reliability,

        resilience,

        failureRate,

        repairRate,

        outageFrequency,

        serviceReliability,

        risk,

        generatedAt: new Date()

    };

}

/*
|--------------------------------------------------------------------------
| Save Reliability Snapshot
|--------------------------------------------------------------------------
*/

export async function saveReliabilitySnapshot(siteId) {

    const kpis = await buildReliabilityKPIs(siteId);

    return await Statistic.create({

        site: siteId,

        timestamp: new Date(),

        period: "DAILY",

        reliability: kpis.reliability,

        resilience: kpis.resilience,

        availability: kpis.availability,

        mtbf: kpis.mtbf,

        mttr: kpis.mttr,

        saidi: kpis.saidi,

        saifi: kpis.saifi,

        caidi: kpis.caidi,

        asai: kpis.asai,

        asui: kpis.asui,

        ens: kpis.ens,

        eens: kpis.eens,

        lolp: kpis.lolp,

        lole: kpis.lole

    });

}

/*
|--------------------------------------------------------------------------
| Reliability Dashboard
|--------------------------------------------------------------------------
*/

export async function getReliabilityDashboard(siteId) {

    const [

        latestStatistics,

        kpis,

        trend

    ] = await Promise.all([

        Statistic.findOne({

            site: siteId

        })

        .sort({

            timestamp: -1

        }),

        buildReliabilityKPIs(siteId),

        calculateReliabilityTrend(siteId)

    ]);

    return {

        generatedAt: new Date(),

        latestStatistics,

        kpis,

        trend

    };

}

/*
|--------------------------------------------------------------------------
| Reliability Report
|--------------------------------------------------------------------------
*/

export async function generateReliabilityReport(siteId) {

    const dashboard =

        await getReliabilityDashboard(siteId);

    return {

        reportDate: new Date(),

        summary: {

            reliabilityIndex:

                dashboard.kpis.reliability,

            resilience:

                dashboard.kpis.resilience,

            availability:

                dashboard.kpis.availability,

            risk:

                dashboard.kpis.risk,

            saidi:

                dashboard.kpis.saidi,

            saifi:

                dashboard.kpis.saifi,

            ens:

                dashboard.kpis.ens,

            lolp:

                dashboard.kpis.lolp

        },

        details: dashboard

    };

}

/*
|--------------------------------------------------------------------------
| Compare Reliability Periods
|--------------------------------------------------------------------------
*/

export async function compareReliabilityPeriods(

    currentPeriod,

    previousPeriod

) {

    return {

        reliabilityChange:

            currentPeriod.reliability -

            previousPeriod.reliability,

        availabilityChange:

            currentPeriod.availability -

            previousPeriod.availability,

        saidiChange:

            currentPeriod.saidi -

            previousPeriod.saidi,

        saifiChange:

            currentPeriod.saifi -

            previousPeriod.saifi,

        ensChange:

            currentPeriod.ens -

            previousPeriod.ens

    };

}

/*
|--------------------------------------------------------------------------
| Export Reliability Metrics
|--------------------------------------------------------------------------
*/

export async function exportReliabilityMetrics(siteId) {

    const kpis =

        await buildReliabilityKPIs(siteId);

    return {

        site: siteId,

        exportedAt: new Date(),

        metrics: kpis

    };

}

/*
|--------------------------------------------------------------------------
| Optimization Integration
|--------------------------------------------------------------------------
*/

export async function getOptimizationReliabilityInputs(siteId) {

    const [

        ens,

        lolp,

        reliability,

        resilience

    ] = await Promise.all([

        calculateENS(siteId),

        calculateLOLP(siteId),

        calculateReliabilityIndex(siteId),

        calculateResilienceScore(siteId)

    ]);

    return {

        ens,

        lolp,

        reliability,

        resilience

    };

}

/*
|--------------------------------------------------------------------------
| Reliability Health Status
|--------------------------------------------------------------------------
*/

export async function getReliabilityHealth(siteId) {

    const [

        reliability,

        resilience,

        risk

    ] = await Promise.all([

        calculateReliabilityIndex(siteId),

        calculateResilienceScore(siteId),

        calculateRiskLevel(siteId)

    ]);

    return {

        score:

            Number(

                (

                    (

                        reliability +

                        resilience

                    ) / 2

                ).toFixed(4)

            ),

        reliability,

        resilience,

        risk,

        healthy:

            risk === "LOW"

    };

}

/*
|--------------------------------------------------------------------------
| Dashboard Wrapper
|--------------------------------------------------------------------------
*/

export async function getDashboardReliability(filters = {}) {

    return getReliabilityDashboard(filters);

}

// reliability metrics
export async function getReliabilityMetrics(siteId) {

    return {

        dashboard: await getReliabilityDashboard(siteId),

        indices: await getReliabilityIndices(siteId),

        saidi: await calculateSAIDI(siteId),

        saifi: await calculateSAIFI(siteId),

        ens: await calculateENS(siteId)

    };

}

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    getFaultHistory,

    getTotalInterruptions,

    getTotalOutageDuration,

    getAverageRestorationTime,

    calculateAvailability,

    calculateMTBF,

    calculateMTTR,

    calculateSAIDI,

    calculateSAIFI,

    calculateCAIDI,

    calculateASAI,

    calculateASUI,

    calculateENS,

    calculateEENS,

    calculateLOLP,

    calculateLOLE,

    calculateReliabilityIndex,

    calculateResilienceScore,

    calculateFailureRate,

    calculateRepairRate,

    calculateOutageFrequency,

    calculateServiceReliability,

    calculateRiskLevel,

    calculateReliabilityTrend,

    buildReliabilityKPIs,

    saveReliabilitySnapshot,

    getReliabilityDashboard,

    generateReliabilityReport,

    compareReliabilityPeriods,

    exportReliabilityMetrics,

    getOptimizationReliabilityInputs,

    getReliabilityHealth,

    getDashboardReliability,

    getReliabilityMetrics

};