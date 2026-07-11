import nodemailer from "nodemailer";
import { env } from "../../config/env.js";


/*
|--------------------------------------------------------------------------
| SMTP Transport Configuration
|--------------------------------------------------------------------------
*/

const transporter = nodemailer.createTransport({

    host:

        env.smtpHost,

    port:

       env.smtpPort,

    secure:

        env.smtpPort === 465,

    auth: {

        user:

            env.smtpUser,

        pass:

            env.smtpPassword

    }

});


/*
|--------------------------------------------------------------------------
| Verify SMTP Connection
|--------------------------------------------------------------------------
*/

export async function verifyEmailConnection() {


    try {


        await transporter.verify();


        return {

            connected:true,

            message:

                "SMTP connection successful"

        };


    }

    catch(error){


        return {

            connected:false,

            error:

                error.message

        };


    }

}



/*
|--------------------------------------------------------------------------
| Base Email Sender
|--------------------------------------------------------------------------
*/

export async function sendEmail({

    to,

    subject,

    html,

    text

}) {


    if (!to) {


        throw new Error(

            "Recipient email required"

        );

    }



    const mailOptions = {


        from:

            env.email,


        to,


        subject,


        html,


        text:

            text ??

            html.replace(

                /<[^>]*>?/gm,

                ""

            )


    };



    return transporter.sendMail(

        mailOptions

    );

}


/*
|--------------------------------------------------------------------------
| Multiple Recipient Email
|--------------------------------------------------------------------------
*/

export async function sendBulkEmail({

    recipients=[],

    subject,

    html,

    text

}) {


    if (!recipients.length) {


        return null;

    }



    return sendEmail({

        to:

            recipients.join(","),

        subject,

        html,

        text

    });


}


/*
|--------------------------------------------------------------------------
| Email Template Wrapper
|--------------------------------------------------------------------------
*/

export function buildEmailTemplate({

    title,

    message,

    severity="INFO",

    details={}

}) {


    const detailRows =

        Object.entries(details)

        .map(([key,value])=>`

            <tr>

                <td>

                    ${key}

                </td>

                <td>

                    ${value}

                </td>

            </tr>

        `)

        .join("");



    return `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>${title}</title>

</head>


<body>


<h2>

${title}

</h2>


<p>

${message}

</p>


<table border="1"

cellpadding="8"

cellspacing="0">


${detailRows}


</table>


<p>

Severity:

<strong>

${severity}

</strong>

</p>



<hr>


<p>

HEMAP-RMS Automated Monitoring System

</p>


</body>

</html>

`;

}

/*
|--------------------------------------------------------------------------
| Send General Alarm Email
|--------------------------------------------------------------------------
*/

export async function sendAlarmEmail({

    recipient,

    siteName,

    alarm

}) {


    const html = buildEmailTemplate({

        title:

            "HEMAP-RMS Alarm Notification",

        message:

            alarm.message,

        severity:

            alarm.severity,

        details:{

            Site:

                siteName,

            Category:

                alarm.category,

            Time:

                new Date()

                .toISOString()

        }

    });



    return sendEmail({

        to:

            recipient,

        subject:

            `[${alarm.severity}] Alarm - ${siteName}`,

        html

    });

}


/*
|--------------------------------------------------------------------------
| Send Fault Email
|--------------------------------------------------------------------------
*/

export async function sendFaultEmail({

    recipient,

    siteName,

    fault

}) {


    const html = buildEmailTemplate({

        title:

            "HEMAP-RMS Fault Detected",

        message:

            fault.message,

        severity:

            "CRITICAL",

        details:{

            Site:

                siteName,

            faultType:

                fault.category,

            Description:

                fault.description ??

                fault.message,

            Time:

                new Date()

                .toISOString()

        }

    });



    return sendEmail({

        to:

            recipient,

        subject:

            `[CRITICAL] Fault - ${siteName}`,

        html

    });

}


/*
|--------------------------------------------------------------------------
| Battery Alert Email
|--------------------------------------------------------------------------
*/

export async function sendBatteryAlertEmail({

    recipient,

    siteName,

    battery

}) {


    const html = buildEmailTemplate({

        title:

            "Battery System Alert",

        message:

            battery.message,

        severity:

            battery.severity,

        details:{

            Site:

                siteName,

            SOC:

                `${battery.soc ?? 0}%`,

            Temperature:

                `${battery.temperature ?? 0}°C`,

            Voltage:

                `${battery.voltage ?? 0}V`

        }

    });



    return sendEmail({

        to:

            recipient,

        subject:

            `Battery Alert - ${siteName}`,

        html

    });

}


/*
|--------------------------------------------------------------------------
| Solar PV Alert Email
|--------------------------------------------------------------------------
*/

export async function sendSolarAlertEmail({

    recipient,

    siteName,

    solar

}) {


    const html = buildEmailTemplate({

        title:

            "Solar PV Performance Alert",

        message:

            solar.message,

        severity:

            solar.severity,

        details:{

            Site:

                siteName,

            PVOutput:

                `${solar.output ?? 0}W`,

            ExpectedOutput:

                `${solar.expected ?? 0}W`,

            Efficiency:

                `${solar.efficiency ?? 0}%`

        }

    });



    return sendEmail({

        to:

            recipient,

        subject:

            `Solar PV Alert - ${siteName}`,

        html

    });

}


/*
|--------------------------------------------------------------------------
| Generator Alert Email
|--------------------------------------------------------------------------
*/

export async function sendGeneratorAlertEmail({

    recipient,

    siteName,

    generator

}) {


    const html = buildEmailTemplate({

        title:

            "Generator System Alert",

        message:

            generator.message,

        severity:

            generator.severity,

        details:{

            Site:

                siteName,

            Status:

                generator.status,

            Runtime:

                `${generator.runtime ?? 0} Hours`,

            Temperature:

                `${generator.temperature ?? 0}°C`

        }

    });



    return sendEmail({

        to:

            recipient,

        subject:

            `Generator Alert - ${siteName}`,

        html

    });

}


/*
|--------------------------------------------------------------------------
| Grid Failure Email
|--------------------------------------------------------------------------
*/

export async function sendGridFailureEmail({

    recipient,

    siteName,

    grid

}) {


    const html = buildEmailTemplate({

        title:

            "Grid Power Failure",

        message:

            grid.message ??

            "Grid supply interruption detected",

        severity:

            "CRITICAL",

        details:{

            Site:

                siteName,

            Voltage:

                `${grid.voltage ?? 0}V`,

            Frequency:

                `${grid.frequency ?? 0}Hz`,

            DetectionTime:

                new Date()

                .toISOString()

        }

    });



    return sendEmail({

        to:

            recipient,

        subject:

            `[CRITICAL] Grid Failure - ${siteName}`,

        html

    });

}

/*
|--------------------------------------------------------------------------
| Reliability Report Email
|--------------------------------------------------------------------------
*/

export async function sendReliabilityReportEmail({

    recipient,

    siteName,

    report

}) {


    const html = buildEmailTemplate({

        title:

            "Reliability Performance Report",

        message:

            "Latest reliability analysis has been generated.",

        severity:

            report.risk ?? "INFO",

        details:{

            Site:

                siteName,

            ReliabilityIndex:

                report.reliability,

            ResilienceScore:

                report.resilience,

            Availability:

                `${report.availability}%`,

            SAIDI:

                report.saidi,

            SAIFI:

                report.saifi,

            ENS:

                `${report.ens} kWh`

        }

    });



    return sendEmail({

        to:

            recipient,

        subject:

            `Reliability Report - ${siteName}`,

        html

    });

}


/*
|--------------------------------------------------------------------------
| Optimization Report Email
|--------------------------------------------------------------------------
*/

export async function sendOptimizationReportEmail({

    recipient,

    siteName,

    optimization

}) {


    const html = buildEmailTemplate({

        title:

            "Energy Optimization Recommendation",

        message:

            "A new optimized dispatch recommendation is available.",

        severity:

            "INFO",

        details:{

            Site:

                siteName,

            RenewableContribution:

                `${optimization.renewableShare ?? 0}%`,

            FuelSaving:

                `${optimization.fuelSaving ?? 0}%`,

            EstimatedCostReduction:

                optimization.costReduction,

            Generated:

                new Date()

                .toISOString()

        }

    });



    return sendEmail({

        to:

            recipient,

        subject:

            `Optimization Report - ${siteName}`,

        html

    });

}


/*
|--------------------------------------------------------------------------
| Maintenance Reminder Email
|--------------------------------------------------------------------------
*/

export async function sendMaintenanceReminderEmail({

    recipient,

    siteName,

    maintenance

}) {


    const html = buildEmailTemplate({

        title:

            "Scheduled Maintenance Reminder",

        message:

            maintenance.message ??

            "Maintenance activity is due.",

        severity:

            "WARNING",

        details:{

            Site:

                siteName,

            Equipment:

                maintenance.equipment,

            DueDate:

                maintenance.dueDate,

            Priority:

                maintenance.priority

        }

    });



    return sendEmail({

        to:

            recipient,

        subject:

            `Maintenance Reminder - ${siteName}`,

        html

    });

}


/*
|--------------------------------------------------------------------------
| Forecast Warning Email
|--------------------------------------------------------------------------
*/

export async function sendForecastWarningEmail({

    recipient,

    siteName,

    forecast

}) {


    const html = buildEmailTemplate({

        title:

            "Renewable Forecast Warning",

        message:

            forecast.message,

        severity:

            "WARNING",

        details:{

            Site:

                siteName,

            ForecastPeriod:

                forecast.period,

            ExpectedSolar:

                `${forecast.solar ?? 0} kWh`,

            ExpectedWind:

                `${forecast.wind ?? 0} kWh`,

            WeatherCondition:

                forecast.condition

        }

    });



    return sendEmail({

        to:

            recipient,

        subject:

            `Forecast Warning - ${siteName}`,

        html

    });

}


/*
|--------------------------------------------------------------------------
| Daily Operations Summary Email
|--------------------------------------------------------------------------
*/

export async function sendDailySummaryEmail({

    recipient,

    siteName,

    summary

}) {


    const html = buildEmailTemplate({

        title:

            "Daily HEMAP-RMS Operations Summary",

        message:

            "Daily energy monitoring report.",

        severity:

            summary.status ?? "INFO",

        details:{

            Site:

                siteName,

            EnergyGenerated:

                `${summary.energyGenerated ?? 0} kWh`,

            RenewableEnergy:

                `${summary.renewableEnergy ?? 0} kWh`,

            GeneratorRuntime:

                `${summary.generatorRuntime ?? 0} hrs`,

            Downtime:

                `${summary.downtime ?? 0} hrs`

        }

    });



    return sendEmail({

        to:

            recipient,

        subject:

            `Daily Report - ${siteName}`,

        html

    });

}


/*
|--------------------------------------------------------------------------
| User Verification Email
|--------------------------------------------------------------------------
*/

export async function sendUserVerificationEmail({

    recipient,

    name,

    verificationLink

}) {


    const html = `

<h2>

Welcome to HEMAP-RMS

</h2>


<p>

Hello ${name},

</p>


<p>

Please verify your account by clicking below:

</p>


<a href="${verificationLink}">

Verify Account

</a>


`;



    return sendEmail({

        to:

            recipient,

        subject:

            "Verify Your HEMAP-RMS Account",

        html

    });

}


/*
|--------------------------------------------------------------------------
| Password Reset Email
|--------------------------------------------------------------------------
*/

export async function sendPasswordResetEmail({

    recipient,

    name,

    resetLink

}) {


    const html = `

<h2>

Password Reset Request

</h2>


<p>

Hello ${name},

</p>


<p>

A password reset request was received.

</p>


<p>

Click the link below:

</p>


<a href="${resetLink}">

Reset Password

</a>


<p>

If you did not request this action, ignore this email.

</p>

`;



    return sendEmail({

        to:

            recipient,

        subject:

            "HEMAP-RMS Password Reset",

        html

    });

}

/*
|--------------------------------------------------------------------------
| Send Email With Attachment
|--------------------------------------------------------------------------
*/

export async function sendEmailWithAttachment({

    to,

    subject,

    html,

    attachments = []

}) {


    return transporter.sendMail({

        from:

            email,


        to,


        subject,


        html,


        attachments

    });

}


/*
|--------------------------------------------------------------------------
| Send Email With Retry
|--------------------------------------------------------------------------
*/

export async function sendEmailWithRetry(

    options,

    retries = 3

) {


    let attempt = 0;


    while (

        attempt < retries

    ) {


        try {


            return await sendEmail(

                options

            );


        }

        catch(error){


            attempt++;



            if (

                attempt >= retries

            ) {


                throw error;

            }



            await new Promise(

                resolve =>

                setTimeout(

                    resolve,

                    3000

                )

            );


        }


    }

}


/*
|--------------------------------------------------------------------------
| Send PDF Report Email
|--------------------------------------------------------------------------
*/

export async function sendReportAttachmentEmail({

    recipient,

    reportName,

    filePath

}) {


    return sendEmailWithAttachment({

        to:

            recipient,


        subject:

            `HEMAP-RMS Report - ${reportName}`,



        html:

        `

        <h2>

        HEMAP-RMS Report

        </h2>


        <p>

        Please find attached your requested report.

        </p>

        `,


        attachments:[

            {

                filename:

                    reportName,


                path:

                    filePath

            }

        ]

    });

}


/*
|--------------------------------------------------------------------------
| Scheduled Report Email
|--------------------------------------------------------------------------
*/

export async function sendScheduledReportEmail({

    recipients=[],

    siteName,

    report

}) {


    const html = buildEmailTemplate({

        title:

            "Scheduled Energy Report",


        message:

            "Automated scheduled report generated.",


        severity:

            "INFO",


        details:{

            Site:

                siteName,


            Generated:

                new Date()

                .toISOString()

        }

    });



    return sendBulkEmail({

        recipients,


        subject:

            `Scheduled Report - ${siteName}`,

        html

    });

}


/*
|--------------------------------------------------------------------------
| Email Delivery Statistics
|--------------------------------------------------------------------------
*/

export async function getEmailStatistics(){

    return {


        service:

            "SMTP",


        status:

            "ACTIVE",


        checkedAt:

            new Date()


    };

}


/*
|--------------------------------------------------------------------------
| Test Email Service
|--------------------------------------------------------------------------
*/

export async function sendTestEmail(

    recipient

){


    return sendEmail({

        to:

            recipient,


        subject:

            "HEMAP-RMS Email Test",


        html:

        `

        <h2>

        Email Service Working

        </h2>


        <p>

        SMTP configuration is successful.

        </p>

        `


    });

}


/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {


    verifyEmailConnection,


    sendEmail,

    sendBulkEmail,

    sendEmailWithAttachment,

    sendEmailWithRetry,


    buildEmailTemplate,


    sendAlarmEmail,

    sendFaultEmail,


    sendBatteryAlertEmail,

    sendSolarAlertEmail,

    sendGeneratorAlertEmail,

    sendGridFailureEmail,


    sendReliabilityReportEmail,

    sendOptimizationReportEmail,


    sendMaintenanceReminderEmail,

    sendForecastWarningEmail,


    sendDailySummaryEmail,


    sendUserVerificationEmail,

    sendPasswordResetEmail,


    sendReportAttachmentEmail,

    sendScheduledReportEmail,


    getEmailStatistics,


    sendTestEmail

};