import asyncHandler from "../utils/asyncHandler.js";

import * as siteService from "../services/sites/siteService.js";

/*
|--------------------------------------------------------------------------
| Get Sites
|--------------------------------------------------------------------------
*/

export const getSites = asyncHandler(async (req, res) => {

    const sites = await siteService.getSites(req.query);

    return res.status(200).json({

        success: true,

        message: "Sites retrieved successfully.",

        data: sites

    });

});

/*
|--------------------------------------------------------------------------
| Get Site
|--------------------------------------------------------------------------
*/

export const getSite = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const site = await siteService.getSite(id);

    return res.status(200).json({

        success: true,

        message: "Site retrieved successfully.",

        data: site

    });

});

/*
|--------------------------------------------------------------------------
| Create Site
|--------------------------------------------------------------------------
*/

export const createSite = asyncHandler(async (req, res) => {

    const site = await siteService.createSite(

        req.body,

        req.user

    );

    return res.status(201).json({

        success: true,

        message: "Site created successfully.",

        data: site

    });

});

/*
|--------------------------------------------------------------------------
| Update Site
|--------------------------------------------------------------------------
*/

export const updateSite = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const site = await siteService.updateSite(

        id,

        req.body,

        req.user

    );

    return res.status(200).json({

        success: true,

        message: "Site updated successfully.",

        data: site

    });

});

/*
|--------------------------------------------------------------------------
| Delete Site
|--------------------------------------------------------------------------
*/

export const deleteSite = asyncHandler(async (req, res) => {

    const { id } = req.params;

    await siteService.deleteSite(

        id,

        req.user

    );

    return res.status(200).json({

        success: true,

        message: "Site deleted successfully."

    });

});

/*
|--------------------------------------------------------------------------
| Activate Site
|--------------------------------------------------------------------------
*/

export const activateSite = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const site = await siteService.activateSite(

        id,

        req.user

    );

    return res.status(200).json({

        success: true,

        message: "Site activated successfully.",

        data: site

    });

});

/*
|--------------------------------------------------------------------------
| Deactivate Site
|--------------------------------------------------------------------------
*/

export const deactivateSite = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const site = await siteService.deactivateSite(

        id,

        req.user

    );

    return res.status(200).json({

        success: true,

        message: "Site deactivated successfully.",

        data: site

    });

});

export default {

    getSites,

    getSite,

    createSite,

    updateSite,

    deleteSite,

    activateSite,

    deactivateSite

};