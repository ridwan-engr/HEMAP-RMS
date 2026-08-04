import Fault from "../../models/Fault.js";

/*
|--------------------------------------------------------------------------
| Get Faults
|--------------------------------------------------------------------------
*/

export async function getFaults(filters = {}) {

    const query = {};

    if (filters.siteId) {

        query.site = filters.siteId;

    }

    if (filters.installationId) {

        query.installation = filters.installationId;

    }

    if (filters.deviceId) {

        query.device = filters.deviceId;

    }

    if (filters.status) {

        query.status = filters.status;

    }

    if (filters.severity) {

        query.severity = filters.severity;

    }

    if (filters.startDate || filters.endDate) {

        query.createdAt = {};

        if (filters.startDate) {

            query.createdAt.$gte = new Date(

                filters.startDate

            );

        }

        if (filters.endDate) {

            query.createdAt.$lte = new Date(

                filters.endDate

            );

        }

    }

    return Fault.find(query)

        .populate("site")

        .populate("installation")

        .populate("device")

        .populate("assignedTo", "firstName lastName")

        .sort({

            createdAt: -1

        });

}

/*
|--------------------------------------------------------------------------
| Get Fault
|--------------------------------------------------------------------------
*/

export async function getFaultById(faultId) {

    const fault = await Fault.findById(

        faultId

    )

    .populate("site")

    .populate("installation")

    .populate("device")

    .populate("assignedTo", "firstName lastName")

    .populate("resolvedBy", "firstName lastName");

    if (!fault) {

        throw new Error(

            "Fault record not found."

        );

    }

    return fault;

}

/*
|--------------------------------------------------------------------------
| Create Fault
|--------------------------------------------------------------------------
*/

export async function createFault(

    payload,

    user

) {

    const fault = await Fault.create({

        ...payload,

        reportedBy: user._id

    });

    return getFaultById(

        fault._id

    );

}

/*
|--------------------------------------------------------------------------
| Update Fault
|--------------------------------------------------------------------------
*/

export async function updateFault(

    faultId,

    payload,

    user

) {

    const fault = await getFaultById(

        faultId

    );

    Object.assign(

        fault,

        payload

    );

    fault.updatedBy = user._id;

    await fault.save();

    return getFaultById(

        fault._id

    );

}

/*
|--------------------------------------------------------------------------
| Resolve Fault
|--------------------------------------------------------------------------
*/

export async function resolveFault(

    faultId,

    payload,

    user

) {

    const fault = await getFaultById(

        faultId

    );

    fault.status = "RESOLVED";

    fault.resolution =

        payload.resolution;

    fault.resolvedAt = new Date();

    fault.resolvedBy = user._id;

    await fault.save();

    return getFaultById(

        fault._id

    );

}

/*
|--------------------------------------------------------------------------
| Delete Fault
|--------------------------------------------------------------------------
*/

export async function deleteFault(

    faultId

) {

    const fault = await getFaultById(

        faultId

    );

    await fault.deleteOne();

    return true;

}

export default {

    getFaults,

    getFaultById,

    createFault,

    updateFault,

    resolveFault,

    deleteFault

};