import Site from "../../models/Site.js";

/*
|--------------------------------------------------------------------------
| Get Sites
|--------------------------------------------------------------------------
*/

export async function getSites(filters = {}) {

    const query = {};

    if (filters.customer) {

        query.customer = filters.customer;

    }

    if (filters.state) {

        query["location.state"] = filters.state;

    }

    if (filters.status) {

        query.status = filters.status;

    }

    if (filters.isActive !== undefined) {

        query.isActive = filters.isActive;

    }

    return Site.find(query)

        .sort({

            createdAt: -1

        });

}

/*
|--------------------------------------------------------------------------
| Get Site
|--------------------------------------------------------------------------
*/

export async function getSite(id) {

    const site = await Site.findById(id);

    if (!site) {

        throw new Error("Site not found.");

    }

    return site;

}

/*
|--------------------------------------------------------------------------
| Create Site
|--------------------------------------------------------------------------
*/

export async function createSite(data) {

    const exists = await Site.findOne({

        siteCode: data.siteCode

    });

    if (exists) {

        throw new Error(

            "Site code already exists."

        );

    }

    return Site.create(data);

}

/*
|--------------------------------------------------------------------------
| Update Site
|--------------------------------------------------------------------------
*/

export async function updateSite(id, data) {

    const site = await Site.findById(id);

    if (!site) {

        throw new Error("Site not found.");

    }

    if (data.siteCode) {

        const duplicate = await Site.findOne({

            siteCode: data.siteCode,

            _id: {

                $ne: id

            }

        });

        if (duplicate) {

            throw new Error(

                "Site code already exists."

            );

        }

    }

    Object.assign(site, data);

    await site.save();

    return site;

}

/*
|--------------------------------------------------------------------------
| Delete Site
|--------------------------------------------------------------------------
*/

export async function deleteSite(id) {

    const site = await Site.findById(id);

    if (!site) {

        throw new Error(

            "Site not found."

        );

    }

    await site.deleteOne();

    return true;

}

/*
|--------------------------------------------------------------------------
| Activate Site
|--------------------------------------------------------------------------
*/

export async function activateSite(id) {

    const site = await Site.findById(id);

    if (!site) {

        throw new Error(

            "Site not found."

        );

    }

    site.isActive = true;

    await site.save();

    return site;

}

/*
|--------------------------------------------------------------------------
| Deactivate Site
|--------------------------------------------------------------------------
*/

export async function deactivateSite(id) {

    const site = await Site.findById(id);

    if (!site) {

        throw new Error(

            "Site not found."

        );

    }

    site.isActive = false;

    await site.save();

    return site;

}

export default {

    getSites,

    getSite,

    createSite,

    updateSite,

    deleteSite,

    activateSite,

    deactivateSite

};