import * as reportService from "../services/reports/reportService.js";


/*
|--------------------------------------------------------------------------
| Generate Site Overview Report
|--------------------------------------------------------------------------
*/

export async function siteOverviewReport(

    req,

    res

){


    try {


        const report =

            await reportService.generateSiteOverviewReport(

                req.params.siteId

            );



        res.status(200)

        .json({


            success:true,


            data:

                report


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Generate Energy Performance Report
|--------------------------------------------------------------------------
*/

export async function energyReport(

    req,

    res

){


    try {


        const {

            startDate,

            endDate

        } = req.query;



        const report =

            await reportService.generateEnergyReport({

                siteId:

                    req.params.siteId,


                startDate:

                    new Date(startDate),


                endDate:

                    new Date(endDate)

            });



        res.json({


            success:true,


            data:

                report


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Generate Battery Report
|--------------------------------------------------------------------------
*/

export async function batteryReport(

    req,

    res

){


    try {


        const report =

            await reportService.generateBatteryReport(

                req.params.siteId

            );



        res.json({


            success:true,


            data:

                report


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Generate Reliability Report
|--------------------------------------------------------------------------
*/

export async function reliabilityReport(

    req,

    res

){


    try {


        const report =

            await reportService.generateReliabilityReport({

                siteId:

                    req.params.siteId,


                startDate:

                    new Date(

                        req.query.startDate

                    ),


                endDate:

                    new Date(

                        req.query.endDate

                    )

            });



        res.json({


            success:true,


            data:

                report


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}

/*
|--------------------------------------------------------------------------
| Generate Alarm Report
|--------------------------------------------------------------------------
*/

export async function alarmReport(

    req,

    res

){


    try {


        const report =

            await reportService.generateAlarmReport({

                siteId:

                    req.params.siteId,


                startDate:

                    new Date(

                        req.query.startDate

                    ),


                endDate:

                    new Date(

                        req.query.endDate

                    )

            });



        res.status(200)

        .json({


            success:true,


            data:

                report


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Generate Maintenance Report
|--------------------------------------------------------------------------
*/

export async function maintenanceReport(

    req,

    res

){


    try {


        const report =

            await reportService.generateMaintenanceReport(

                req.params.siteId

            );



        res.status(200)

        .json({


            success:true,


            data:

                report


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Dashboard Summary Report
|--------------------------------------------------------------------------
*/

export async function dashboardReport(

    req,

    res

){


    try {


        const report =

            await reportService.generateDashboardReport();



        res.status(200)

        .json({


            success:true,


            data:

                report


        });


    }

    catch(error){


        res.status(500)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Executive Management Report
|--------------------------------------------------------------------------
*/

export async function executiveReport(

    req,

    res

){


    try {


        const report =

            await reportService.generateExecutiveReport();



        res.status(200)

        .json({


            success:true,


            data:

                report


        });


    }

    catch(error){


        res.status(500)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Export Report Data
|--------------------------------------------------------------------------
*/

export async function exportReport(

    req,

    res

){


    try {


        const exported =

            await reportService.exportReportData(

                req.body.report

            );



        res.status(200)

        .json({


            success:true,


            data:

                exported


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}

/*
|--------------------------------------------------------------------------
| Validate Report Date Range
|--------------------------------------------------------------------------
*/

function validateDateRange(

    startDate,

    endDate

){


    if(!startDate || !endDate){


        throw new Error(

            "Start date and end date are required"

        );

    }



    const start =

        new Date(startDate);



    const end =

        new Date(endDate);



    if(

        isNaN(start) ||

        isNaN(end)

    ){


        throw new Error(

            "Invalid date format"

        );

    }



    if(

        start > end

    ){


        throw new Error(

            "Start date cannot be greater than end date"

        );

    }



    return {

        start,

        end

    };

}


/*
|--------------------------------------------------------------------------
| Validate Site Parameter
|--------------------------------------------------------------------------
*/

function validateSiteId(

    siteId

){


    if(!siteId){


        throw new Error(

            "Site ID is required"

        );

    }



    return siteId;

}


/*
|--------------------------------------------------------------------------
| Report Permission Hook
|--------------------------------------------------------------------------
|
| Used with authorize middleware
|
| Example:
|
| authorize("VIEW_REPORTS")
|
|--------------------------------------------------------------------------
*/

export function checkReportPermission(

    permission="VIEW_REPORTS"

){


    return permission;

}


/*
|--------------------------------------------------------------------------
| Standard Report Response
|--------------------------------------------------------------------------
*/

export function reportResponse({

    res,

    data,

    message="Report generated successfully"

}){


    return res.status(200)

    .json({


        success:true,


        message,


        generatedAt:

            new Date(),


        data


    });

}


/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {


    siteOverviewReport,


    energyReport,


    batteryReport,


    reliabilityReport,


    alarmReport,


    maintenanceReport,


    dashboardReport,


    executiveReport,


    exportReport,


    checkReportPermission,


    reportResponse

};