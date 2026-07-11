import Fault from "../../models/Fault.js";

/*
|--------------------------------------------------------------------------
| Create Fault
|--------------------------------------------------------------------------
*/

export async function createFault(data) {

    return await Fault.create(data);

}

/*
|--------------------------------------------------------------------------
| Get All Faults
|--------------------------------------------------------------------------
*/

export async function getFaults() {

    return await Fault.find()

        .populate("site")

        .populate("device")

        .sort({

            detectedAt: -1

        });

}

/*
|--------------------------------------------------------------------------
| Get Fault By ID
|--------------------------------------------------------------------------
*/

export async function getFaultById(id) {

    return await Fault.findById(id)

        .populate("site")

        .populate("device");

}

/*
|--------------------------------------------------------------------------
| Get Faults By Site
|--------------------------------------------------------------------------
*/

export async function getFaultsBySite(siteId) {

    return await Fault.find({

        site: siteId

    })

    .populate("device")

    .sort({

        detectedAt: -1

    });

}

/*
|--------------------------------------------------------------------------
| Update Fault
|--------------------------------------------------------------------------
*/

export async function updateFault(id, data) {

    return await Fault.findByIdAndUpdate(

        id,

        data,

        {

            new: true,

            runValidators: true

        }

    );

}

/*
|--------------------------------------------------------------------------
| Delete Fault
|--------------------------------------------------------------------------
*/

export async function deleteFault(id) {

    return await Fault.findByIdAndDelete(id);

}

/*
|--------------------------------------------------------------------------
| Get Open Faults
|--------------------------------------------------------------------------
*/

export async function getOpenFaults(siteId = null) {

    const query = {

        status: {

            $in: [

                "OPEN",

                "ASSIGNED",

                "IN_PROGRESS"

            ]

        }

    };

    if (siteId) {

        query.site = siteId;

    }

    return await Fault.find(query)

        .sort({

            severity: -1,

            detectedAt: -1

        });

}

/*
|--------------------------------------------------------------------------
| Get Critical Faults
|--------------------------------------------------------------------------
*/

export async function getCriticalFaults(siteId = null) {

    const query = {

        severity: "CRITICAL"

    };

    if (siteId) {

        query.site = siteId;

    }

    return await Fault.find(query)

        .sort({

            detectedAt: -1

        });

}

/*
|--------------------------------------------------------------------------
| Resolve Fault
|--------------------------------------------------------------------------
*/

export async function resolveFault(

    id,

    correctiveAction,

    rootCause

) {

    return await Fault.findByIdAndUpdate(

        id,

        {

            status: "RESOLVED",

            correctiveAction,

            rootCause,

            resolvedAt: new Date()

        },

        {

            new: true

        }

    );

}

/*
|--------------------------------------------------------------------------
| Fault Statistics
|--------------------------------------------------------------------------
*/

export async function faultStatistics(siteId = null) {

    const query = {};

    if (siteId) {

        query.site = siteId;

    }

    const [

        total,

        open,

        resolved,

        critical

    ] = await Promise.all([

        Fault.countDocuments(query),

        Fault.countDocuments({

            ...query,

            status: {

                $in: [

                    "OPEN",

                    "ASSIGNED",

                    "IN_PROGRESS"

                ]

            }

        }),

        Fault.countDocuments({

            ...query,

            status: "RESOLVED"

        }),

        Fault.countDocuments({

            ...query,

            severity: "CRITICAL"

        })

    ]);

    return {

        total,

        open,

        resolved,

        critical

    };

}

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    createFault,

    getFaults,

    getFaultById,

    getFaultsBySite,

    updateFault,

    deleteFault,

    getOpenFaults,

    getCriticalFaults,

    resolveFault,

    faultStatistics

};