import Installation from "../../models/Installation.js";
import Site from "../../models/Site.js";

/*
|--------------------------------------------------------------------------
| Create Installation
|--------------------------------------------------------------------------
*/

export async function createInstallation(data) {

    const site = await Site.findById(
        data.site
    );

    if (!site) {

        throw new Error(
            "Site not found."
        );

    }

    const exists = await Installation.findOne({

        installationId: data.installationId

    });

    if (exists) {

        throw new Error(
            "Installation already exists."
        );

    }

    return await Installation.create(data);

}

/*
|--------------------------------------------------------------------------
| Get Installations
|--------------------------------------------------------------------------
*/

export async function getInstallations() {

    return await Installation.find({

        isActive: true

    })
    .populate("site")
    .lean();

}

/*
|--------------------------------------------------------------------------
| Get Installation
|--------------------------------------------------------------------------
*/

export async function getInstallation(id) {

    const installation = await Installation.findById(id)

        .populate("site");

    if (!installation) {

        throw new Error(
            "Installation not found."
        );

    }

    return installation;

}

/*
|--------------------------------------------------------------------------
| Get By VRM Installation ID
|--------------------------------------------------------------------------
*/

export async function getInstallationByVRMId(
    installationId
) {

    return await Installation.findOne({

        installationId

    }).populate("site");

}

/*
|--------------------------------------------------------------------------
| Update Installation
|--------------------------------------------------------------------------
*/

export async function updateInstallation(
    id,
    payload
) {

    const installation = await Installation.findByIdAndUpdate(

        id,

        payload,

        {
            new: true,
            runValidators: true
        }

    ).populate("site");

    if (!installation) {

        throw new Error(
            "Installation not found."
        );

    }

    return installation;

}

/*
|--------------------------------------------------------------------------
| Update Sync Status
|--------------------------------------------------------------------------
*/

export async function updateInstallationSync(
    installationId,
    status = "ONLINE"
) {

    return await Installation.findOneAndUpdate(

        {
            installationId
        },

        {
            status,
            lastSync: new Date(),
            lastTelemetry: new Date()
        },

        {
            new: true
        }

    );

}

/*
|--------------------------------------------------------------------------
| Delete Installation
|--------------------------------------------------------------------------
*/

export async function deleteInstallation(id) {

    const installation = await Installation.findByIdAndDelete(id);

    if (!installation) {

        throw new Error(
            "Installation not found."
        );

    }

    return installation;

}

export default {

    createInstallation,

    getInstallations,

    getInstallation,

    getInstallationByVRMId,

    updateInstallation,

    updateInstallationSync,

    deleteInstallation

};