import asyncHandler from "../utils/asyncHandler.js";

import * as installationService from "../services/installation/installationService.js";

/*
|--------------------------------------------------------------------------
| Get Installations
|--------------------------------------------------------------------------
*/

export const getInstallations = asyncHandler(async (req, res) => {

    const installations = await installationService.getInstallations(

        req.query

    );

    return res.status(200).json({

        success: true,

        message: "Installations retrieved successfully.",

        data: installations

    });

});

/*
|--------------------------------------------------------------------------
| Get Installation
|--------------------------------------------------------------------------
*/

export const getInstallation = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const installation = await installationService.getInstallation(id);

    return res.status(200).json({

        success: true,

        message: "Installation retrieved successfully.",

        data: installation

    });

});

/*
|--------------------------------------------------------------------------
| Create Installation
|--------------------------------------------------------------------------
*/

export const createInstallation = asyncHandler(async (req, res) => {

    const installation = await installationService.createInstallation(

        req.body,

        req.user

    );

    return res.status(201).json({

        success: true,

        message: "Installation created successfully.",

        data: installation

    });

});

/*
|--------------------------------------------------------------------------
| Update Installation
|--------------------------------------------------------------------------
*/

export const updateInstallation = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const installation = await installationService.updateInstallation(

        id,

        req.body,

        req.user

    );

    return res.status(200).json({

        success: true,

        message: "Installation updated successfully.",

        data: installation

    });

});

/*
|--------------------------------------------------------------------------
| Delete Installation
|--------------------------------------------------------------------------
*/

export const deleteInstallation = asyncHandler(async (req, res) => {

    const { id } = req.params;

    await installationService.deleteInstallation(

        id,

        req.user

    );

    return res.status(200).json({

        success: true,

        message: "Installation deleted successfully."

    });

});

/*
|--------------------------------------------------------------------------
| Synchronize Installation
|--------------------------------------------------------------------------
*/

export const synchronizeInstallation = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const result = await installationService.synchronizeInstallation(

        id,

        req.user

    );

    return res.status(200).json({

        success: true,

        message: "Installation synchronized successfully.",

        data: result

    });

});

/*
|--------------------------------------------------------------------------
| Installation Statistics
|--------------------------------------------------------------------------
*/

export const getInstallationStatistics = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const statistics = await installationService.getInstallationStatistics(id);

    return res.status(200).json({

        success: true,

        message: "Installation statistics retrieved successfully.",

        data: statistics

    });

});

export default {

    getInstallations,

    getInstallation,

    createInstallation,

    updateInstallation,

    deleteInstallation,

    synchronizeInstallation,

    getInstallationStatistics

};