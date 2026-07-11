import Telemetry from "../../models/Telemetry.js";
import Alarm from "../../models/Alarm.js";
import Battery from "../../models/Battery.js";
import Generator from "../../models/Generator.js";
import Grid from "../../models/Grid.js";
import Solar from "../../models/Solar.js";

import {

    sendAlarmNotification,

    sendFaultNotification,

    sendReliabilityNotification,

    sendOptimizationNotification

} from "./notificationService.js";


/*
|--------------------------------------------------------------------------
| Alert Threshold Configuration
|--------------------------------------------------------------------------
*/

const ALERT_LIMITS = {

    battery: {

        lowSOC: 20,

        highTemperature: 45,

        criticalSOC: 10

    },


    solar: {

        minimumEfficiency: 60

    },


    generator: {

        maximumRuntime: 500,

        highTemperature: 90

    },


    grid: {

        voltageLow: 180,

        voltageHigh: 250

    }

};


/*
|--------------------------------------------------------------------------
| Get Latest Telemetry
|--------------------------------------------------------------------------
*/

export async function getLatestTelemetry(siteId) {

    return Telemetry.findOne({

        site: siteId

    })

    .sort({

        timestamp: -1

    });

}


/*
|--------------------------------------------------------------------------
| Battery Alert Detection
|--------------------------------------------------------------------------
*/

export async function checkBatteryAlerts(siteId) {


    const [

        telemetry,

        battery

    ] = await Promise.all([

        getLatestTelemetry(siteId),

        Battery.findOne({

            site: siteId

        })

    ]);


    if (!telemetry || !battery) {

        return [];

    }


    const alerts = [];


    const soc =

        telemetry.batterySOC ?? 0;


    const temperature =

        telemetry.batteryTemperature ?? 0;



    if (

        soc <= ALERT_LIMITS.battery.criticalSOC

    ) {


        const alert = {

            message:

                `Battery critically low (${soc}%)`,

            severity:

                "CRITICAL",

            category:

                "BATTERY"

        };


        await sendAlarmNotification(

            siteId,

            alert

        );


        alerts.push(alert);

    }


    else if (

        soc <= ALERT_LIMITS.battery.lowSOC

    ) {


        const alert = {

            message:

                `Battery SOC low (${soc}%)`,

            severity:

                "WARNING",

            category:

                "BATTERY"

        };


        await sendAlarmNotification(

            siteId,

            alert

        );


        alerts.push(alert);

    }



    if (

        temperature >=

        ALERT_LIMITS.battery.highTemperature

    ) {


        const alert = {

            message:

                `Battery temperature high (${temperature}°C)`,

            severity:

                "CRITICAL",

            category:

                "BATTERY"

        };


        await sendAlarmNotification(

            siteId,

            alert

        );


        alerts.push(alert);

    }


    return alerts;

}

/*
|--------------------------------------------------------------------------
| Solar PV Alert Detection
|--------------------------------------------------------------------------
*/

export async function checkSolarAlerts(siteId) {


    const [

        telemetry,

        solar

    ] = await Promise.all([

        getLatestTelemetry(siteId),

        Solar.findOne({

            site: siteId

        })

    ]);


    if (!telemetry || !solar) {

        return [];

    }


    const alerts = [];


    const solarPower =

        telemetry.solarPower ?? 0;


    const expectedPower =

        solar.capacity ?? 0;



    /*
    |--------------------------------------------------------------------------
    | PV Generation Failure
    |--------------------------------------------------------------------------
    */


    if (

        expectedPower > 0 &&

        solarPower <

        expectedPower *

        0.20

    ) {


        const alert = {

            message:

                `Solar generation below expected level (${solarPower}W)`,

            severity:

                "WARNING",

            category:

                "SOLAR"

        };


        await sendAlarmNotification(

            siteId,

            alert

        );


        alerts.push(alert);

    }



    /*
    |--------------------------------------------------------------------------
    | PV Efficiency Degradation
    |--------------------------------------------------------------------------
    */


    const efficiency =

        (

            solarPower /

            expectedPower

        ) * 100;



    if (

        efficiency <

        ALERT_LIMITS.solar.minimumEfficiency

    ) {


        const alert = {

            message:

                `Solar efficiency degraded (${efficiency.toFixed(1)}%)`,

            severity:

                "WARNING",

            category:

                "SOLAR"

        };


        await sendAlarmNotification(

            siteId,

            alert

        );


        alerts.push(alert);

    }


    return alerts;

}


/*
|--------------------------------------------------------------------------
| Generator Alert Detection
|--------------------------------------------------------------------------
*/

export async function checkGeneratorAlerts(siteId) {


    const [

        telemetry,

        generator

    ] = await Promise.all([


        getLatestTelemetry(siteId),


        Generator.findOne({

            site: siteId

        })

    ]);



    if (!telemetry || !generator) {

        return [];

    }


    const alerts = [];



    /*
    |--------------------------------------------------------------------------
    | Generator Offline During Demand
    |--------------------------------------------------------------------------
    */


    const load =

        telemetry.loadPower ?? 0;


    const generatorPower =

        telemetry.generatorPower ?? 0;



    if (

        load > 0 &&

        generator.status === "ONLINE" &&

        generatorPower === 0

    ) {


        const alert = {


            message:

                "Generator running but not supplying power",


            severity:

                "CRITICAL",


            category:

                "GENERATOR"


        };


        await sendFaultNotification(

            siteId,

            alert

        );


        alerts.push(alert);

    }




    /*
    |--------------------------------------------------------------------------
    | Generator Temperature
    |--------------------------------------------------------------------------
    */


    const temperature =

        telemetry.generatorTemperature ?? 0;



    if (

        temperature >

        ALERT_LIMITS.generator.highTemperature

    ) {


        const alert = {


            message:

                `Generator temperature high (${temperature}°C)`,


            severity:

                "CRITICAL",


            category:

                "GENERATOR"


        };


        await sendAlarmNotification(

            siteId,

            alert

        );


        alerts.push(alert);

    }




    return alerts;

}


/*
|--------------------------------------------------------------------------
| Grid Alert Detection
|--------------------------------------------------------------------------
*/

export async function checkGridAlerts(siteId) {


    const [

        telemetry,

        grid

    ] = await Promise.all([


        getLatestTelemetry(siteId),


        Grid.findOne({

            site: siteId

        })

    ]);



    if (!telemetry || !grid) {

        return [];

    }



    const alerts = [];



    /*
    |--------------------------------------------------------------------------
    | Grid Failure
    |--------------------------------------------------------------------------
    */


    if (

        grid.status !== "ONLINE"

    ) {


        const alert = {


            message:

                "Grid supply unavailable",


            severity:

                "CRITICAL",


            category:

                "GRID"


        };


        await sendFaultNotification(

            siteId,

            alert

        );


        alerts.push(alert);

    }



    /*
    |--------------------------------------------------------------------------
    | Voltage Abnormality
    |--------------------------------------------------------------------------
    */


    const voltage =

        telemetry.gridVoltage ?? 0;



    if (

        voltage <

        ALERT_LIMITS.grid.voltageLow ||

        voltage >

        ALERT_LIMITS.grid.voltageHigh

    ) {


        const alert = {


            message:

                `Grid voltage abnormal (${voltage}V)`,


            severity:

                "WARNING",


            category:

                "GRID"


        };


        await sendAlarmNotification(

            siteId,

            alert

        );


        alerts.push(alert);

    }



    return alerts;

}

/*
|--------------------------------------------------------------------------
| Communication Loss Detection
|--------------------------------------------------------------------------
*/

export async function checkCommunicationAlerts(siteId) {


    const telemetry =

        await getLatestTelemetry(siteId);


    if (!telemetry) {


        const alert = {

            message:

                "No telemetry data received from site",

            severity:

                "CRITICAL",

            category:

                "COMMUNICATION"

        };


        await sendFaultNotification(

            siteId,

            alert

        );


        return [alert];

    }



    const lastUpdate =

        new Date(

            telemetry.timestamp

        );


    const elapsedMinutes =

        (

            Date.now() -

            lastUpdate.getTime()

        )

        /

        60000;



    const alerts = [];



    if (

        elapsedMinutes > 30

    ) {


        const alert = {


            message:

                `Telemetry communication lost for ${elapsedMinutes.toFixed(0)} minutes`,


            severity:

                "CRITICAL",


            category:

                "COMMUNICATION"


        };


        await sendFaultNotification(

            siteId,

            alert

        );


        alerts.push(alert);

    }



    return alerts;

}


/*
|--------------------------------------------------------------------------
| Stale Telemetry Detection
|--------------------------------------------------------------------------
*/

export async function checkTelemetryHealth(siteId) {


    const telemetry =

        await getLatestTelemetry(siteId);



    if (!telemetry) {

        return {

            healthy:false,

            reason:

                "No telemetry available"

        };

    }



    const age =

        (

            Date.now() -

            new Date(

                telemetry.timestamp

            ).getTime()

        )

        /

        60000;



    return {

        healthy:

            age <= 15,

        ageMinutes:

            Number(

                age.toFixed(2)

            )

    };

}


/*
|--------------------------------------------------------------------------
| Reliability Degradation Alert
|--------------------------------------------------------------------------
*/

export async function checkReliabilityAlerts(

    siteId

) {


    const reliabilityService =

        await import(

            "../analytics/reliabilityService.js"

        );


    const reliability =

        await reliabilityService

        .calculateReliabilityIndex(siteId);



    const resilience =

        await reliabilityService

        .calculateResilienceScore(siteId);



    const alerts = [];



    if (

        reliability < 0.90

    ) {


        const alert = {


            message:

                `System reliability degraded (${reliability})`,


            severity:

                "HIGH",


            category:

                "RELIABILITY"


        };


        await sendReliabilityNotification(

            siteId,

            {

                risk:"HIGH",

                reliability,

                resilience

            }

        );


        alerts.push(alert);

    }



    return alerts;

}


/*
|--------------------------------------------------------------------------
| Optimization Recommendation Alert
|--------------------------------------------------------------------------
*/

export async function checkOptimizationAlerts(

    siteId

) {


    const optimizationService =

        await import(

            "../analytics/optimizationService.js"

        );



    const result =

        await optimizationService

        .getOptimizationDashboard(siteId);



    const alerts = [];



    if (

        result.dispatch

        ?.generator

        ?.start === true

    ) {


        const alert = {


            message:

                "Optimization recommends generator operation",


            severity:

                "NORMAL",


            category:

                "OPTIMIZATION"


        };


        await sendOptimizationNotification(

            siteId,

            result

        );


        alerts.push(alert);

    }



    return alerts;

}


/*
|--------------------------------------------------------------------------
| Predictive Maintenance Alert
|--------------------------------------------------------------------------
*/

export async function checkPredictiveMaintenance(

    siteId

) {


    const telemetry =

        await getLatestTelemetry(siteId);



    if (!telemetry) {

        return [];

    }



    const alerts = [];



    const temperature =

        telemetry.temperature ?? 0;



    const runtime =

        telemetry.generatorRuntime ?? 0;



    if (

        temperature > 80 ||

        runtime > 450

    ) {


        const alert = {


            message:

                "Equipment maintenance recommended based on operating condition",


            severity:

                "WARNING",


            category:

                "MAINTENANCE"


        };


        await sendAlarmNotification(

            siteId,

            alert

        );


        alerts.push(alert);

    }



    return alerts;

}

/*
|--------------------------------------------------------------------------
| Run All Alert Checks
|--------------------------------------------------------------------------
*/

export async function runAllAlertChecks(siteId) {


    const results = await Promise.all([

        checkBatteryAlerts(siteId),

        checkSolarAlerts(siteId),

        checkGeneratorAlerts(siteId),

        checkGridAlerts(siteId),

        checkCommunicationAlerts(siteId),

        checkReliabilityAlerts(siteId),

        checkOptimizationAlerts(siteId),

        checkPredictiveMaintenance(siteId)

    ]);



    return results.flat();

}


/*
|--------------------------------------------------------------------------
| Run Alert Monitoring For Multiple Sites
|--------------------------------------------------------------------------
*/

export async function runFleetAlertMonitoring() {


    const sites = await Site.find({

        isActive:true

    })

    .select("_id");



    const report = [];



    for (const site of sites) {


        const alerts =

            await runAllAlertChecks(

                site._id

            );


        report.push({

            site:

                site._id,

            alerts,

            count:

                alerts.length

        });


    }



    return report;

}


/*
|--------------------------------------------------------------------------
| Alert Severity Ranking
|--------------------------------------------------------------------------
*/

export function calculateAlertPriority(

    severity

) {


    const levels = {


        CRITICAL:4,

        HIGH:3,

        WARNING:2,

        NORMAL:1,

        LOW:0

    };


    return levels[severity] ?? 0;

}


/*
|--------------------------------------------------------------------------
| Sort Alerts By Severity
|--------------------------------------------------------------------------
*/

export function sortAlertsByPriority(

    alerts=[]

) {


    return alerts.sort(

        (a,b)=>


            calculateAlertPriority(

                b.severity

            )

            -

            calculateAlertPriority(

                a.severity

            )

    );

}


/*
|--------------------------------------------------------------------------
| Remove Duplicate Alerts
|--------------------------------------------------------------------------
*/

export function removeDuplicateAlerts(

    alerts=[]

) {


    const unique = new Map();



    alerts.forEach(alert=>{


        const key =

            `${alert.category}-${alert.message}`;



        if (!unique.has(key)) {


            unique.set(

                key,

                alert

            );

        }


    });



    return Array.from(

        unique.values()

    );

}


/*
|--------------------------------------------------------------------------
| Generate Alert Summary
|--------------------------------------------------------------------------
*/

export function generateAlertSummary(

    alerts=[]

) {


    const summary = {


        total:

            alerts.length,


        critical:0,


        high:0,


        warning:0,


        normal:0


    };



    alerts.forEach(alert=>{


        switch(alert.severity){


            case "CRITICAL":

                summary.critical++;

                break;


            case "HIGH":

                summary.high++;

                break;


            case "WARNING":

                summary.warning++;

                break;


            case "NORMAL":

                summary.normal++;

                break;


        }


    });



    return summary;

}


/*
|--------------------------------------------------------------------------
| Process Alert Pipeline
|--------------------------------------------------------------------------
*/

export async function processAlerts(siteId) {


    let alerts =

        await runAllAlertChecks(

            siteId

        );



    alerts =

        removeDuplicateAlerts(

            alerts

        );



    alerts =

        sortAlertsByPriority(

            alerts

        );



    return {

        site:

            siteId,


        summary:

            generateAlertSummary(

                alerts

            ),


        alerts,


        timestamp:

            new Date()

    };

}


/*
|--------------------------------------------------------------------------
| Alert Health Report
|--------------------------------------------------------------------------
*/

export async function getAlertHealth(siteId) {


    const report =

        await processAlerts(

            siteId

        );



    return {


        healthy:

            report.summary.critical === 0,


        riskLevel:

            report.summary.critical > 0

            ? "CRITICAL"

            :

            report.summary.high > 0

            ? "HIGH"

            :

            report.summary.warning > 0

            ? "MEDIUM"

            :

            "LOW",



        summary:

            report.summary

    };

}


/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {


    getLatestTelemetry,


    checkBatteryAlerts,

    checkSolarAlerts,

    checkGeneratorAlerts,

    checkGridAlerts,


    checkCommunicationAlerts,

    checkTelemetryHealth,


    checkReliabilityAlerts,

    checkOptimizationAlerts,

    checkPredictiveMaintenance,


    runAllAlertChecks,

    runFleetAlertMonitoring,


    calculateAlertPriority,

    sortAlertsByPriority,


    removeDuplicateAlerts,

    generateAlertSummary,


    processAlerts,

    getAlertHealth


};