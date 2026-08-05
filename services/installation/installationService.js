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

    if (filters.installationId) {
        query.installationId = filters.installationId;
    }

    if (filters.identifier) {
        query.identifier = {
            $regex: filters.identifier,
            $options: "i"
        };
    }

    if (filters.systemType) {
        query.systemType = filters.systemType;
    }

    if (filters.status) {
        query.status = filters.status;
    }

    if (filters.isActive !== undefined) {
        query.isActive = filters.isActive;
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;

    const [installations, total] = await Promise.all([

        Installation.find(query)
            .populate("site")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),

        Installation.countDocuments(query)

    ]);

    return {

        data: installations,

        pagination: {

            page,

            limit,

            total,

            pages: Math.ceil(total / limit)

        }

    };

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

        throw new Error("Installation not found.");

    }

    return installation;

}

/*
|--------------------------------------------------------------------------
| Create Installation
|--------------------------------------------------------------------------
*/

export async function createInstallation(data) {

    const duplicateInstallationId =
        await Installation.findOne({

            installationId: data.installationId

        });

    if (duplicateInstallationId) {

        throw new Error(

            "Installation ID already exists."

        );

    }

    const duplicateIdentifier =
        await Installation.findOne({

            identifier: data.identifier

        });

    if (duplicateIdentifier) {

        throw new Error(

            "Installation identifier already exists."

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

    if (

        data.installationId &&
        data.installationId !== installation.installationId

    ) {

        const duplicate =
            await Installation.findOne({

                installationId: data.installationId,

                _id: { $ne: id }

            });

        if (duplicate) {

            throw new Error(

                "Installation ID already exists."

            );

        }

    }

    if (

        data.identifier &&
        data.identifier !== installation.identifier

    ) {

        const duplicate =
            await Installation.findOne({

                identifier: data.identifier,

                _id: { $ne: id }

            });

        if (duplicate) {

            throw new Error(

                "Installation identifier already exists."

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

    const installation =
        await Installation.findById(id);

    if (!installation) {

        throw new Error(

            "Installation not found."

        );

    }

    await installation.deleteOne();

    return {

        success: true

    };

}

/*
|--------------------------------------------------------------------------
| Synchronize Installation
|--------------------------------------------------------------------------
*/

export async function synchronizeInstallation(id) {

    const installation =
        await Installation.findById(id);

    if (!installation) {

        throw new Error(

            "Installation not found."

        );

    }

    installation.lastSync = new Date();

    await installation.save();

    return installation;

}

/*
|--------------------------------------------------------------------------
| Installation Statistics
|--------------------------------------------------------------------------
*/

export async function getInstallationStatistics(id) {

    const installation =
        await Installation.findById(id)
            .populate("site");

    if (!installation) {

        throw new Error(

            "Installation not found."

        );

    }

    return {

        id: installation._id,

        installationId: installation.installationId,

        identifier: installation.identifier,

        name: installation.name,

        systemType: installation.systemType,

        status: installation.status,

        lastSync: installation.lastSync,

        lastTelemetry: installation.lastTelemetry,

        isActive: installation.isActive,

        createdAt: installation.createdAt,

        updatedAt: installation.updatedAt

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