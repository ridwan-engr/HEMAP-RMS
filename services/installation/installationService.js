import Installation from "../../models/Installation.js";

/*
|--------------------------------------------------------------------------
| Get Installations
|--------------------------------------------------------------------------
*/

export async function getInstallations(filters = {}) {

    const query = {};

    if (filters.siteId) {

        query.site = filters.siteId;

    }

    if (filters.customer) {

        query.customer = filters.customer;

    }

    if (filters.status) {

        query.status = filters.status;

    }

    if (filters.type) {

        query.type = filters.type;

    }

    return Installation.find(query)

        .populate("site")

        .sort({

            createdAt: -1

        });

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
| Create Installation
|--------------------------------------------------------------------------
*/

export async function createInstallation(data) {

    const exists = await Installation.findOne({

        code: data.code

    });

    if (exists) {

        throw new Error(

            "Installation code already exists."

        );

    }

    return Installation.create(data);

}

/*
|--------------------------------------------------------------------------
| Update Installation
|--------------------------------------------------------------------------
*/

export async function updateInstallation(id, data) {

    const installation = await Installation.findById(id);

    if (!installation) {

        throw new Error(

            "Installation not found."

        );

    }

    if (data.code) {

        const duplicate = await Installation.findOne({

            code: data.code,

            _id: {

                $ne: id

            }

        });

        if (duplicate) {

            throw new Error(

                "Installation code already exists."

            );

        }

    }

    Object.assign(

        installation,

        data

    );

    await installation.save();

    return installation;

}

/*
|--------------------------------------------------------------------------
| Delete Installation
|--------------------------------------------------------------------------
*/

export async function deleteInstallation(id) {

    const installation = await Installation.findById(id);

    if (!installation) {

        throw new Error(

            "Installation not found."

        );

    }

    await installation.deleteOne();

    return true;

}

/*
|--------------------------------------------------------------------------
| Synchronize Installation
|--------------------------------------------------------------------------
*/

export async function synchronizeInstallation(id) {

    const installation = await Installation.findById(id);

    if (!installation) {

        throw new Error(

            "Installation not found."

        );

    }

    installation.lastSynchronization = new Date();

    await installation.save();

    return installation;

}

/*
|--------------------------------------------------------------------------
| Installation Statistics
|--------------------------------------------------------------------------
*/

export async function getInstallationStatistics(id) {

    const installation = await Installation.findById(id)

        .populate("site");

    if (!installation) {

        throw new Error(

            "Installation not found."

        );

    }

    return {

        installationId: installation._id,

        code: installation.code,

        site: installation.site,

        status: installation.status,

        lastSynchronization:

            installation.lastSynchronization,

        createdAt:

            installation.createdAt,

        updatedAt:

            installation.updatedAt

    };

}

export default {

    getInstallations,

    getInstallation,

    createInstallation,

    updateInstallation,

    deleteInstallation,

    synchronizeInstallation,

    getInstallationStatistics

};