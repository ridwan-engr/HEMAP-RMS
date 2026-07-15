import faultService from "../services/faults/faultService.js";

import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Create Fault
|--------------------------------------------------------------------------
*/

export async function createFault(req, res, next) {

    try {

        const fault = await faultService.createFault(

            req.body

        );

        return res.status(201).json({

            success: true,

            message: "Fault created successfully.",

            data: fault

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Get All Faults
|--------------------------------------------------------------------------
*/

export async function getFaults(req, res, next) {

    try {

        const faults =

            await faultService.getFaults();

        return res.status(200).json({

            success: true,

            data: faults

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Get Fault By ID
|--------------------------------------------------------------------------
*/

export async function getFaultById(req, res, next) {

    try {

        const fault =

            await faultService.getFaultById(

                req.body.id

            );

        if (!fault) {

            return res.status(404).json({

                success: false,

                message: "Fault not found."

            });

        }

        return res.status(200).json({

            success: true,

            data: fault

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Update Fault
|--------------------------------------------------------------------------
*/

export async function updateFault(req, res, next) {

    try {

        const fault =

            await faultService.updateFault(

                req.body.id,

                req.body

            );

        if (!fault) {

            return res.status(404).json({

                success: false,

                message: "Fault not found."

            });

        }

        return res.status(200).json({

            success: true,

            message: "Fault updated successfully.",

            data: fault

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Delete Fault
|--------------------------------------------------------------------------
*/

export async function deleteFault(req, res, next) {

    try {

        const deleted =

            await faultService.deleteFault(

                req.body.id

            );

        if (!deleted) {

            return res.status(404).json({

                success: false,

                message: "Fault not found."

            });

        }

        return res.status(200).json({

            success: true,

            message: "Fault deleted successfully."

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Get Faults By Site
|--------------------------------------------------------------------------
*/

export async function getFaultsBySite(req, res, next) {

    try {

        const faults =

            await faultService.getFaultsBySite(

                req.body.siteId

            );

        return res.status(200).json({

            success: true,

            data: faults

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

export default {

    createFault,

    getFaults,

    getFaultById,

    updateFault,

    deleteFault,

    getFaultsBySite

};