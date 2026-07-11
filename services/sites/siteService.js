import Site from "../../models/Site.js";

/*
|--------------------------------------------------------------------------
| Create Site
|--------------------------------------------------------------------------
*/

export async function createSite(siteData) {

    const exists = await Site.findOne({
        installationId: siteData.installationId
    });

    if (exists) {

        throw new Error(
            "Site already exists."
        );

    }

    return await Site.create(siteData);

}

/*
|--------------------------------------------------------------------------
| Get All Sites
|--------------------------------------------------------------------------
*/

export async function getSites(filters = {}) {

    const query = {};

    if (filters.status) {

        query.status = filters.status;

    }

    if (filters.systemType) {

        query.systemType = filters.systemType;

    }

    return await Site.find(query)
        .sort({
            name: 1
        });

}

/*
|--------------------------------------------------------------------------
| Get Site By ID
|--------------------------------------------------------------------------
*/

export async function getSiteById(id) {

    const site = await Site.findById(id);

    if (!site) {

        throw new Error(
            "Site not found."
        );

    }

    return site;

}

/*
|--------------------------------------------------------------------------
| Get Site By Installation ID
|--------------------------------------------------------------------------
*/

export async function getSiteByInstallationId(
    installationId
) {

    const site = await Site.findOne({
        installationId
    });

    if (!site) {

        throw new Error(
            "Site not found."
        );

    }

    return site;

}

/*
|--------------------------------------------------------------------------
| Update Site
|--------------------------------------------------------------------------
*/

export async function updateSite(
    id,
    payload
) {

    const site = await Site.findByIdAndUpdate(

        id,

        payload,

        {
            new: true,
            runValidators: true
        }

    );

    if (!site) {

        throw new Error(
            "Site not found."
        );

    }

    return site;

}

/*
|--------------------------------------------------------------------------
| Delete Site
|--------------------------------------------------------------------------
*/

export async function deleteSite(id) {

    const site = await Site.findByIdAndDelete(id);

    if (!site) {

        throw new Error(
            "Site not found."
        );

    }

    return site;

}

/*
|--------------------------------------------------------------------------
| Update Synchronization
|--------------------------------------------------------------------------
*/

export async function updateSiteSync(
    installationId,
    status = "ONLINE"
) {

    return await Site.findOneAndUpdate(

        {
            installationId
        },

        {
            lastSync: new Date(),
            status
        },

        {
            new: true
        }

    );

}

export default {

    createSite,

    getSites,

    getSiteById,

    getSiteByInstallationId,

    updateSite,

    deleteSite,

    updateSiteSync

};