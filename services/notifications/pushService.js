import admin from "firebase-admin";

import {

    firebaseProjectId,

    firebasePrivateKey,

    firebaseClientEmail

} from "../../config/env.js";


/*
|--------------------------------------------------------------------------
| Firebase Initialization
|--------------------------------------------------------------------------
*/

let firebaseInitialized = false;



export function initializeFirebase(){


    if (

        firebaseInitialized

    ) {


        return;

    }



    admin.initializeApp({

        credential:

            admin.credential.cert({

                projectId:

                    firebaseProjectId,


                privateKey:

                    firebasePrivateKey

                    ?.replace(

                        /\\n/g,

                        "\n"

                    ),


                clientEmail:

                    firebaseClientEmail

            })

    });



    firebaseInitialized = true;

}



/*
|--------------------------------------------------------------------------
| Send Firebase Push Notification
|--------------------------------------------------------------------------
*/

export async function sendPushNotification({

    token,

    title,

    body,

    data={}

}) {


    if (!firebaseInitialized) {


        initializeFirebase();

    }



    if (!token) {


        throw new Error(

            "Push token required"

        );

    }



    const message = {


        token,


        notification:{

            title,

            body

        },


        data

    };



    return admin.messaging()

        .send(

            message

        );

}



/*
|--------------------------------------------------------------------------
| Send Multiple Push Notifications
|--------------------------------------------------------------------------
*/

export async function sendBulkPushNotification({

    tokens=[],

    title,

    body,

    data={}

}) {


    if (!tokens.length) {


        return null;

    }



    if (!firebaseInitialized) {


        initializeFirebase();

    }



    return admin.messaging()

        .sendEachForMulticast({

            tokens,


            notification:{

                title,

                body

            },


            data

        });

}

import {

    Server

} from "socket.io";


let io;


/*
|--------------------------------------------------------------------------
| Initialize Socket.IO
|--------------------------------------------------------------------------
*/

export function initializeSocket(

    server,

    options={}

){


    io = new Server(

        server,

        {

            cors:{

                origin:

                    options.origin ??

                    "*",


                methods:[

                    "GET",

                    "POST"

                ]

            }

        }

    );



    io.on(

        "connection",

        socket => {


            console.log(

                `Socket connected: ${socket.id}`

            );



            /*
            |--------------------------------------------------------------------------
            | Join User Room
            |--------------------------------------------------------------------------
            */


            socket.on(

                "joinUserRoom",

                userId=>{


                    socket.join(

                        `user_${userId}`

                    );


                }

            );



            /*
            |--------------------------------------------------------------------------
            | Join Site Room
            |--------------------------------------------------------------------------
            */


            socket.on(

                "joinSiteRoom",

                siteId=>{


                    socket.join(

                        `site_${siteId}`

                    );


                }

            );



            /*
            |--------------------------------------------------------------------------
            | Join Role Room
            |--------------------------------------------------------------------------
            */


            socket.on(

                "joinRoleRoom",

                role=>{


                    socket.join(

                        `role_${role}`

                    );


                }

            );



            socket.on(

                "disconnect",

                ()=>{


                    console.log(

                        `Socket disconnected: ${socket.id}`

                    );


                }

            );


        }

    );



    return io;

}


/*
|--------------------------------------------------------------------------
| Get Socket Instance
|--------------------------------------------------------------------------
*/

export function getSocket(){

    if(!io){

        throw new Error(

            "Socket.IO not initialized"

        );

    }


    return io;

}


/*
|--------------------------------------------------------------------------
| Send To User
|--------------------------------------------------------------------------
*/

export function pushToUser(

    userId,

    event,

    payload

){


    if(!io){

        return;

    }



    io.to(

        `user_${userId}`

    )

    .emit(

        event,

        payload

    );

}


/*
|--------------------------------------------------------------------------
| Send To Site Users
|--------------------------------------------------------------------------
*/

export function pushToSite(

    siteId,

    event,

    payload

){


    if(!io){

        return;

    }



    io.to(

        `site_${siteId}`

    )

    .emit(

        event,

        payload

    );

}


/*
|--------------------------------------------------------------------------
| Send To Role
|--------------------------------------------------------------------------
*/

export function pushToRole(

    role,

    event,

    payload

){


    if(!io){

        return;

    }



    io.to(

        `role_${role}`

    )

    .emit(

        event,

        payload

    );

}

/*
|--------------------------------------------------------------------------
| Push Alarm Notification
|--------------------------------------------------------------------------
*/

export function pushAlarmNotification({

    siteId,

    alarm

}) {


    pushToSite(

        siteId,

        "alarm",

        {

            type:

                "ALARM",


            site:

                siteId,


            data:

                alarm,


            timestamp:

                new Date()

        }

    );

}


/*
|--------------------------------------------------------------------------
| Push Fault Notification
|--------------------------------------------------------------------------
*/

export function pushFaultNotification({

    siteId,

    fault

}) {


    pushToSite(

        siteId,

        "fault",

        {

            type:

                "FAULT",


            site:

                siteId,


            severity:

                "CRITICAL",


            data:

                fault,


            timestamp:

                new Date()

        }

    );

}


/*
|--------------------------------------------------------------------------
| Push Battery Status
|--------------------------------------------------------------------------
*/

export function pushBatteryAlert({

    siteId,

    battery

}) {


    pushToSite(

        siteId,

        "batteryAlert",

        {

            type:

                "BATTERY",


            site:

                siteId,


            data:

                battery,


            timestamp:

                new Date()

        }

    );

}


/*
|--------------------------------------------------------------------------
| Push Solar Update
|--------------------------------------------------------------------------
*/

export function pushSolarAlert({

    siteId,

    solar

}) {


    pushToSite(

        siteId,

        "solarUpdate",

        {

            type:

                "SOLAR",


            site:

                siteId,


            data:

                solar,


            timestamp:

                new Date()

        }

    );

}


/*
|--------------------------------------------------------------------------
| Push Generator Update
|--------------------------------------------------------------------------
*/

export function pushGeneratorAlert({

    siteId,

    generator

}) {


    pushToSite(

        siteId,

        "generatorUpdate",

        {

            type:

                "GENERATOR",


            site:

                siteId,


            data:

                generator,


            timestamp:

                new Date()

        }

    );

}


/*
|--------------------------------------------------------------------------
| Push Grid Status
|--------------------------------------------------------------------------
*/

export function pushGridAlert({

    siteId,

    grid

}) {


    pushToSite(

        siteId,

        "gridUpdate",

        {

            type:

                "GRID",


            site:

                siteId,


            data:

                grid,


            timestamp:

                new Date()

        }

    );

}


/*
|--------------------------------------------------------------------------
| Push Live Telemetry
|--------------------------------------------------------------------------
*/

export function pushTelemetryUpdate({

    siteId,

    telemetry

}) {


    pushToSite(

        siteId,

        "telemetryUpdate",

        {

            type:

                "TELEMETRY",


            site:

                siteId,


            data:

                telemetry,


            timestamp:

                new Date()

        }

    );

}


/*
|--------------------------------------------------------------------------
| Push Forecast Update
|--------------------------------------------------------------------------
*/

export function pushForecastUpdate({

    siteId,

    forecast

}) {


    pushToSite(

        siteId,

        "forecastUpdate",

        {

            type:

                "FORECAST",


            site:

                siteId,


            data:

                forecast,


            timestamp:

                new Date()

        }

    );

}


/*
|--------------------------------------------------------------------------
| Push Optimization Result
|--------------------------------------------------------------------------
*/

export function pushOptimizationResult({

    siteId,

    optimization

}) {


    pushToSite(

        siteId,

        "optimizationUpdate",

        {

            type:

                "OPTIMIZATION",


            site:

                siteId,


            data:

                optimization,


            timestamp:

                new Date()

        }

    );

}


/*
|--------------------------------------------------------------------------
| Push Reliability Report
|--------------------------------------------------------------------------
*/

export function pushReliabilityReport({

    siteId,

    reliability

}) {


    pushToSite(

        siteId,

        "reliabilityUpdate",

        {

            type:

                "RELIABILITY",


            site:

                siteId,


            data:

                reliability,


            timestamp:

                new Date()

        }

    );

}

/*
|--------------------------------------------------------------------------
| Push Notification To User
|--------------------------------------------------------------------------
*/

export async function pushNotificationToUser({

    userId,

    token,

    title,

    message,

    data={}

}) {


    /*
    |--------------------------------------------------------------------------
    | Firebase Mobile Push
    |--------------------------------------------------------------------------
    */


    if(token){


        await sendPushNotification({

            token,


            title,


            body:

                message,


            data

        });


    }



    /*
    |--------------------------------------------------------------------------
    | Socket.IO User Push
    |--------------------------------------------------------------------------
    */


    pushToUser(

        userId,


        "notification",


        {

            title,


            message,


            data,


            timestamp:

                new Date()

        }

    );


}


/*
|--------------------------------------------------------------------------
| Push Dashboard Message
|--------------------------------------------------------------------------
*/

export function pushDashboardMessage({

    siteId,

    message,

    type="INFO"

}) {


    pushToSite(

        siteId,


        "dashboardMessage",


        {

            type,


            message,


            timestamp:

                new Date()

        }

    );

}


/*
|--------------------------------------------------------------------------
| Push User Assignment Update
|--------------------------------------------------------------------------
*/

export function pushUserAssignmentUpdate({

    userId,

    site

}) {


    pushToUser(

        userId,


        "siteAssignment",


        {

            message:

                "New site assignment received",


            site,


            timestamp:

                new Date()

        }

    );

}


/*
|--------------------------------------------------------------------------
| Notification Acknowledgement
|--------------------------------------------------------------------------
*/

export function acknowledgeNotification({

    userId,

    notificationId

}) {


    pushToUser(

        userId,


        "notificationAcknowledged",


        {

            notificationId,


            acknowledgedAt:

                new Date()

        }

    );


    return {

        success:true,


        notificationId

    };

}


/*
|--------------------------------------------------------------------------
| Socket Connection Status
|--------------------------------------------------------------------------
*/

export function getSocketStatus(){


    if(!io){


        return {


            status:

                "OFFLINE"

        };

    }



    return {


        status:

            "ACTIVE"

    };


}


/*
|--------------------------------------------------------------------------
| Push Statistics
|--------------------------------------------------------------------------
*/

export function getPushStatistics(){


    return {


        service:

            "Push Notification Engine",


        socketStatus:

            io

            ?

            "ACTIVE"

            :

            "INACTIVE",



        firebase:

            firebaseInitialized

            ?

            "ACTIVE"

            :

            "NOT_INITIALIZED",



        timestamp:

            new Date()

    };


}


/*
|--------------------------------------------------------------------------
| Broadcast System Notification
|--------------------------------------------------------------------------
*/

export function broadcastSystemNotification({

    title,

    message

}) {


    if(!io){

        return;

    }



    io.emit(

        "systemNotification",


        {


            title,


            message,


            timestamp:

                new Date()


        }

    );

}


/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {


    initializeFirebase,


    sendPushNotification,


    sendBulkPushNotification,


    initializeSocket,


    getSocket,


    pushToUser,


    pushToSite,


    pushToRole,


    pushAlarmNotification,


    pushFaultNotification,


    pushBatteryAlert,


    pushSolarAlert,


    pushGeneratorAlert,


    pushGridAlert,


    pushTelemetryUpdate,


    pushForecastUpdate,


    pushOptimizationResult,


    pushReliabilityReport,


    pushNotificationToUser,


    pushDashboardMessage,


    pushUserAssignmentUpdate,


    acknowledgeNotification,


    getSocketStatus,


    getPushStatistics,


    broadcastSystemNotification

};