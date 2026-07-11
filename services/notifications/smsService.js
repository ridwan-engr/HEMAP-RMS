import axios from "axios";

import { env } from "../../config/env.js";


/*
|--------------------------------------------------------------------------
| SMS Provider Configuration
|--------------------------------------------------------------------------
*/

const SMS_PROVIDER =

    env.smsProvider || "termii";



/*
|--------------------------------------------------------------------------
| Generic SMS Request
|--------------------------------------------------------------------------
*/

async function sendProviderRequest(

    payload

) {


    switch (

        SMS_PROVIDER.toLowerCase()

    ) {


        case "termii":


            return sendTermiiSMS(

                payload

            );



        case "africastalking":


            return sendAfricaTalkingSMS(

                payload

            );



        case "twilio":


            return sendTwilioSMS(

                payload

            );



        default:


            throw new Error(

                `Unsupported SMS provider: ${SMS_PROVIDER}`

            );

    }

}



/*
|--------------------------------------------------------------------------
| Send SMS Core Function
|--------------------------------------------------------------------------
*/

export async function sendSMS({

    phone,

    message

}) {


    if (!phone) {


        throw new Error(

            "Recipient phone number required"

        );

    }



    if (!message) {


        throw new Error(

            "SMS message required"

        );

    }



    return sendProviderRequest({

        phone,

        message

    });

}


/*
|--------------------------------------------------------------------------
| Termii SMS Provider
|--------------------------------------------------------------------------
*/

export async function sendTermiiSMS({

    phone,

    message

}) {


    const response =

        await axios.post(

            `${smsBaseUrl}/api/sms/send`,


            {

                to:

                    phone,


                from:

                    smsSenderId,


                sms:

                    message,


                type:

                    "plain",


                channel:

                    "generic"

            },


            {

                headers:{

                    Authorization:

                        `Bearer ${smsApiKey}`

                }

            }

        );



    return response.data;

}


/*
|--------------------------------------------------------------------------
| Africa's Talking Provider
|--------------------------------------------------------------------------
*/

export async function sendAfricaTalkingSMS({

    phone,

    message

}) {


    const response =

        await axios.post(

            smsBaseUrl,


            {

                username:

                    process.env.AT_USERNAME,


                to:

                    [phone],


                message,


                from:

                    smsSenderId

            },


            {

                headers:{

                    apiKey:

                        smsApiKey

                }

            }

        );



    return response.data;

}


/*
|--------------------------------------------------------------------------
| Twilio Provider
|--------------------------------------------------------------------------
*/

export async function sendTwilioSMS({

    phone,

    message

}) {


    const accountSid =

        process.env.TWILIO_ACCOUNT_SID;


    const authToken =

        process.env.TWILIO_AUTH_TOKEN;


    const from =

        process.env.TWILIO_PHONE_NUMBER;



    const body =

        new URLSearchParams({

            To:

                phone,


            From:

                from,


            Body:

                message

        });



    const response =

        await axios.post(

            `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,


            body,


            {

                auth:{

                    username:

                        accountSid,


                    password:

                        authToken

                }

            }

        );



    return response.data;

}

/*
|--------------------------------------------------------------------------
| Send Alarm SMS
|--------------------------------------------------------------------------
*/

export async function sendAlarmSMS({

    phone,

    siteName,

    alarm

}) {


    const message =

`HEMAP-RMS ALERT

Site: ${siteName}

Type: ${alarm.category}

Severity: ${alarm.severity}

Message: ${alarm.message}

Time: ${new Date().toISOString()}`;



    return sendSMS({

        phone,

        message

    });

}


/*
|--------------------------------------------------------------------------
| Send Fault SMS
|--------------------------------------------------------------------------
*/

export async function sendFaultSMS({

    phone,

    siteName,

    fault

}) {


    const message =

`HEMAP-RMS CRITICAL FAULT

Site: ${siteName}

Equipment: ${fault.category}

Fault: ${fault.message}

Action Required Immediately.

Time: ${new Date().toISOString()}`;



    return sendSMS({

        phone,

        message

    });

}


/*
|--------------------------------------------------------------------------
| Battery Alert SMS
|--------------------------------------------------------------------------
*/

export async function sendBatteryAlertSMS({

    phone,

    siteName,

    battery

}) {


    const message =

`HEMAP-RMS BATTERY ALERT

Site: ${siteName}

SOC: ${battery.soc ?? 0}%

Temperature: ${battery.temperature ?? 0}C

Status: ${battery.severity}

${battery.message}`;



    return sendSMS({

        phone,

        message

    });

}


/*
|--------------------------------------------------------------------------
| Solar PV Alert SMS
|--------------------------------------------------------------------------
*/

export async function sendSolarAlertSMS({

    phone,

    siteName,

    solar

}) {


    const message =

`HEMAP-RMS SOLAR ALERT

Site: ${siteName}

PV Output:

${solar.output ?? 0}W


Expected:

${solar.expected ?? 0}W


Efficiency:

${solar.efficiency ?? 0}%


${solar.message}`;



    return sendSMS({

        phone,

        message

    });

}


/*
|--------------------------------------------------------------------------
| Generator Alert SMS
|--------------------------------------------------------------------------
*/

export async function sendGeneratorAlertSMS({

    phone,

    siteName,

    generator

}) {


    const message =

`HEMAP-RMS GENERATOR ALERT

Site: ${siteName}

Status:

${generator.status}


Runtime:

${generator.runtime ?? 0} hrs


Temperature:

${generator.temperature ?? 0}C


${generator.message}`;



    return sendSMS({

        phone,

        message

    });

}


/*
|--------------------------------------------------------------------------
| Grid Failure SMS
|--------------------------------------------------------------------------
*/

export async function sendGridFailureSMS({

    phone,

    siteName,

    grid

}) {


    const message =

`HEMAP-RMS GRID FAILURE

Site: ${siteName}

Voltage:

${grid.voltage ?? 0}V


Frequency:

${grid.frequency ?? 0}Hz


${grid.message ?? "Grid supply unavailable"}


Immediate attention required.`;



    return sendSMS({

        phone,

        message

    });

}

/*
|--------------------------------------------------------------------------
| Send Reliability Warning SMS
|--------------------------------------------------------------------------
*/

export async function sendReliabilitySMS({

    phone,

    siteName,

    reliability

}) {


    const message =

`HEMAP-RMS RELIABILITY WARNING

Site: ${siteName}

Reliability Index:

${reliability.reliability ?? 0}


Resilience Score:

${reliability.resilience ?? 0}


Risk Level:

${reliability.risk ?? "UNKNOWN"}


Action:

Review system performance.

Time:

${new Date().toISOString()}`;



    return sendSMS({

        phone,

        message

    });

}


/*
|--------------------------------------------------------------------------
| Send Optimization Recommendation SMS
|--------------------------------------------------------------------------
*/

export async function sendOptimizationSMS({

    phone,

    siteName,

    optimization

}) {


    const message =

`HEMAP-RMS OPTIMIZATION UPDATE

Site:

${siteName}


Recommendation:

${optimization.message ??

"New dispatch recommendation available"}


Renewable Contribution:

${optimization.renewableShare ?? 0}%


Fuel Saving:

${optimization.fuelSaving ?? 0}%


Time:

${new Date().toISOString()}`;



    return sendSMS({

        phone,

        message

    });

}


/*
|--------------------------------------------------------------------------
| Send Maintenance Reminder SMS
|--------------------------------------------------------------------------
*/

export async function sendMaintenanceSMS({

    phone,

    siteName,

    maintenance

}) {


    const message =

`HEMAP-RMS MAINTENANCE REMINDER

Site:

${siteName}


Equipment:

${maintenance.equipment ?? "System"}


Task:

${maintenance.message}


Due Date:

${maintenance.dueDate ?? "Not specified"}


Priority:

${maintenance.priority ?? "NORMAL"}`;



    return sendSMS({

        phone,

        message

    });

}


/*
|--------------------------------------------------------------------------
| Send Forecast Warning SMS
|--------------------------------------------------------------------------
*/

export async function sendForecastWarningSMS({

    phone,

    siteName,

    forecast

}) {


    const message =

`HEMAP-RMS FORECAST WARNING

Site:

${siteName}


Condition:

${forecast.condition ?? "Unknown"}


Expected Renewable Energy:

${forecast.energy ?? 0} kWh


Recommendation:

${forecast.message}`;



    return sendSMS({

        phone,

        message

    });

}


/*
|--------------------------------------------------------------------------
| Send Daily Summary SMS
|--------------------------------------------------------------------------
*/

export async function sendDailySummarySMS({

    phone,

    siteName,

    summary

}) {


    const message =

`HEMAP-RMS DAILY SUMMARY

Site:

${siteName}


Energy Generated:

${summary.energyGenerated ?? 0} kWh


Renewable Energy:

${summary.renewableEnergy ?? 0} kWh


Generator Runtime:

${summary.generatorRuntime ?? 0} hrs


Availability:

${summary.availability ?? 0}%`;


    return sendSMS({

        phone,

        message

    });

}


/*
|--------------------------------------------------------------------------
| Send Bulk SMS
|--------------------------------------------------------------------------
*/

export async function sendBulkSMS({

    phones=[],

    message

}) {


    if (!phones.length) {


        return null;

    }


    const results=[];



    for (

        const phone of phones

    ) {


        results.push(

            await sendSMS({

                phone,

                message

            })

        );


    }



    return results;

}


/*
|--------------------------------------------------------------------------
| Emergency Escalation SMS
|--------------------------------------------------------------------------
*/

export async function sendEmergencySMS({

    escalationList=[],

    siteName,

    message

}) {


    const sms =

`HEMAP-RMS EMERGENCY

SITE:

${siteName}


MESSAGE:

${message}


Immediate action required.

TIME:

${new Date().toISOString()}`;



    return sendBulkSMS({

        phones:

            escalationList,


        message:

            sms

    });

}

/*
|--------------------------------------------------------------------------
| Send SMS With Retry
|--------------------------------------------------------------------------
*/

export async function sendSMSWithRetry(

    options,

    retries = 3

) {


    let attempt = 0;


    while (

        attempt < retries

    ) {


        try {


            return await sendSMS(

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

                    2000

                )

            );


        }

    }

}


/*
|--------------------------------------------------------------------------
| Provider Health Check
|--------------------------------------------------------------------------
*/

export async function checkSMSProviderHealth(){

    try {


        if (

            !smsApiKey

        ) {


            return {

                status:

                    "FAILED",

                message:

                    "SMS API key missing"

            };

        }



        return {

            status:

                "ACTIVE",

            provider:

                SMS_PROVIDER,

            checkedAt:

                new Date()

        };


    }

    catch(error){


        return {

            status:

                "FAILED",

            error:

                error.message

        };

    }

}


/*
|--------------------------------------------------------------------------
| SMS Delivery Status
|--------------------------------------------------------------------------
*/

export async function getSMSDeliveryStatus(

    messageId

) {


    /*
    |--------------------------------------------------------------------------
    | Provider-specific delivery tracking
    |--------------------------------------------------------------------------
    |
    | Termii / Twilio / Africa's Talking
    | APIs can be integrated here.
    |
    */


    return {


        messageId,


        status:

            "PENDING",


        checkedAt:

            new Date()

    };

}


/*
|--------------------------------------------------------------------------
| SMS Statistics
|--------------------------------------------------------------------------
*/

export async function getSMSStatistics(){


    return {


        provider:

            SMS_PROVIDER,


        service:

            "SMS Notification Engine",


        status:

            "ACTIVE",


        timestamp:

            new Date()


    };

}


/*
|--------------------------------------------------------------------------
| Test SMS
|--------------------------------------------------------------------------
*/

export async function sendTestSMS(

    phone

) {


    return sendSMS({

        phone,


        message:

`HEMAP-RMS TEST MESSAGE

SMS notification service is operational.

Time:

${new Date().toISOString()}`


    });

}


/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {


    sendSMS,


    sendSMSWithRetry,


    sendTermiiSMS,


    sendAfricaTalkingSMS,


    sendTwilioSMS,


    sendBulkSMS,

    sendEmergencySMS,


    sendAlarmSMS,

    sendFaultSMS,


    sendBatteryAlertSMS,

    sendSolarAlertSMS,

    sendGeneratorAlertSMS,

    sendGridFailureSMS,


    sendReliabilitySMS,

    sendOptimizationSMS,


    sendMaintenanceSMS,

    sendForecastWarningSMS,


    sendDailySummarySMS,


    checkSMSProviderHealth,


    getSMSDeliveryStatus,


    getSMSStatistics,


    sendTestSMS

};