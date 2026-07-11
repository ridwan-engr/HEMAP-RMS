import Site from "../../models/Site.js";
import Installation from "../../models/Installation.js";

import Telemetry from "../../models/Telemetry.js";
import Alarm from "../../models/Alarm.js";
import Reliability from "../../models/Reliability.js";


/*
|--------------------------------------------------------------------------
| Generate Site Overview Report
|--------------------------------------------------------------------------
*/

export async function generateSiteOverviewReport(

    siteId

){


    const site = await Site.findById(

        siteId

    )

    .populate(

        "installations"

    );



    if(!site){


        throw new Error(

            "Site not found"

        );

    }



    const installations =

        await Installation.find({

            site:

                siteId

        });



    const alarms =

        await Alarm.countDocuments({

            site:

                siteId

        });



    return {


        site:{


            id:

                site._id,


            name:

                site.name,


            location:

                site.location

        },


        installations:

            installations.length,


        activeAlarms:

            alarms,


        generatedAt:

            new Date()

    };

}


/*
|--------------------------------------------------------------------------
| Generate Energy Performance Report
|--------------------------------------------------------------------------
*/

export async function generateEnergyReport({

    siteId,

    startDate,

    endDate

}){


    const telemetry =

        await Telemetry.find({

            site:

                siteId,


            timestamp:{

                $gte:

                    startDate,


                $lte:

                    endDate

            }

        })

        .sort({

            timestamp:1

        });



    if(!telemetry.length){


        return {


            message:

                "No telemetry data available"


        };

    }



    let totalSolar = 0;

    let totalLoad = 0;

    let totalGrid = 0;

    let totalBattery = 0;



    telemetry.forEach(data=>{


        totalSolar +=

            data.solarPower || 0;


        totalLoad +=

            data.loadPower || 0;


        totalGrid +=

            data.gridPower || 0;


        totalBattery +=

            data.batteryPower || 0;


    });



    return {


        period:{


            startDate,


            endDate


        },


        energy:{


            solarEnergy:

                totalSolar,


            loadEnergy:

                totalLoad,


            gridEnergy:

                totalGrid,


            batteryEnergy:

                totalBattery


        },


        samples:

            telemetry.length,


        generatedAt:

            new Date()


    };

}


/*
|--------------------------------------------------------------------------
| Generate Battery Health Report
|--------------------------------------------------------------------------
*/

export async function generateBatteryReport(

    siteId

){


    const telemetry =

        await Telemetry.find({

            site:

                siteId

        })

        .sort({

            timestamp:-1

        })

        .limit(100);



    if(!telemetry.length){


        throw new Error(

            "Battery telemetry unavailable"

        );

    }



    const latest =

        telemetry[0];



    return {


        site:

            siteId,


        battery:{


            stateOfCharge:

                latest.batterySOC,


            voltage:

                latest.batteryVoltage,


            current:

                latest.batteryCurrent,


            temperature:

                latest.batteryTemperature


        },


        healthStatus:

            latest.batterySOC > 50

            ?

            "GOOD"

            :

            "WARNING",



        generatedAt:

            new Date()

    };

}

/*
|--------------------------------------------------------------------------
| Generate Reliability Report
|--------------------------------------------------------------------------
*/

export async function generateReliabilityReport({

    siteId,

    startDate,

    endDate

}){


    const reliability =

        await Reliability.findOne({

            site:

                siteId,


            createdAt:{

                $gte:

                    startDate,


                $lte:

                    endDate

            }

        });



    if(!reliability){


        return {


            message:

                "No reliability records found"


        };

    }



    return {


        site:

            siteId,


        reliability:{


            SAIDI:

                reliability.SAIDI,


            SAIFI:

                reliability.SAIFI,


            ENS:

                reliability.ENS,


            LOLP:

                reliability.LOLP


        },


        generatedAt:

            new Date()

    };

}


/*
|--------------------------------------------------------------------------
| Generate Alarm Report
|--------------------------------------------------------------------------
*/

export async function generateAlarmReport({

    siteId,

    startDate,

    endDate

}){


    const alarms =

        await Alarm.find({

            site:

                siteId,


            createdAt:{

                $gte:

                    startDate,


                $lte:

                    endDate

            }

        })

        .sort({

            createdAt:-1

        });



    const critical =

        alarms.filter(

            alarm =>

            alarm.severity === "CRITICAL"

        );



    return {


        total:

            alarms.length,


        critical:

            critical.length,


        alarms,


        generatedAt:

            new Date()

    };

}


/*
|--------------------------------------------------------------------------
| Generate Maintenance Report
|--------------------------------------------------------------------------
*/

export async function generateMaintenanceReport(

    siteId

){


    const alarms =

        await Alarm.find({

            site:

                siteId

        });



    return {


        site:

            siteId,


        maintenanceRequired:

            alarms.filter(

                alarm =>

                alarm.status !== "CLEARED"

            ),


        generatedAt:

            new Date()

    };

}

/*
|--------------------------------------------------------------------------
| Generate Dashboard Summary
|--------------------------------------------------------------------------
*/

export async function generateDashboardReport(){

    
    const sites =

        await Site.countDocuments();



    const installations =

        await Installation.countDocuments();



    const activeAlarms =

        await Alarm.countDocuments({

            status:

                {

                    $ne:

                    "CLEARED"

                }

        });



    return {


        sites,


        installations,


        activeAlarms,


        generatedAt:

            new Date()

    };

}


/*
|--------------------------------------------------------------------------
| Generate Executive Energy Report
|--------------------------------------------------------------------------
*/

export async function generateExecutiveReport(){

    
    return {


        title:

            "HEMAP-RMS Energy Management Report",


        generatedAt:

            new Date(),


        sections:[


            "Energy Performance",


            "Renewable Generation",


            "Battery Health",


            "Reliability Analysis",


            "Alarm Summary"


        ]

    };

}


/*
|--------------------------------------------------------------------------
| Prepare Report Export Data
|--------------------------------------------------------------------------
*/

export async function exportReportData(

    report

){


    return {


        format:

            "JSON",


        report,


        exportedAt:

            new Date()

    };

}

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {


    generateSiteOverviewReport,


    generateEnergyReport,


    generateBatteryReport,


    generateReliabilityReport,


    generateAlarmReport,


    generateMaintenanceReport,


    generateDashboardReport,


    generateExecutiveReport,


    exportReportData

};