import batteryService from "../services/sites/batteryService.js";

import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Create Battery
|--------------------------------------------------------------------------
*/

export async function createBattery(req, res, next) {

    try {

        const battery = await batteryService.registerBatteryBank(

            req.body

        );

        return res.status(201).json({

            success: true,

            message: "Battery created successfully.",

            data: battery

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Get All Batteries
|--------------------------------------------------------------------------
*/

export async function getBatteries(req, res, next) {

    try {

        const batteries =

            await batteryService.getBatteryBanks();

        return res.status(200).json({

            success: true,

            data: batteries

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Get Battery By ID
|--------------------------------------------------------------------------
*/

export async function getBatteryById(req, res, next) {

    try {

        const battery =

            await batteryService.getBatteryBank(

                req.body.id

            );

        if (!battery) {

            return res.status(404).json({

                success: false,

                message: "Battery not found."

            });

        }

        return res.status(200).json({

            success: true,

            data: battery

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Update Battery
|--------------------------------------------------------------------------
*/

export async function updateBattery(req, res, next) {

    try {

        const battery =

            await batteryService.updateBatteryBank(

                req.body.id,

                req.body

            );

        if (!battery) {

            return res.status(404).json({

                success: false,

                message: "Battery not found."

            });

        }

        return res.status(200).json({

            success: true,

            message: "Battery updated successfully.",

            data: battery

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Delete Battery
|--------------------------------------------------------------------------
*/

export async function deleteBattery(req, res, next) {

    try {

        const battery =

            await batteryService.deleteBatteryBank(

                req.body.id

            );

        if (!battery) {

            return res.status(404).json({

                success: false,

                message: "Battery not found."

            });

        }

        return res.status(200).json({

            success: true,

            message: "Battery deleted successfully."

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Get Batteries By Site
|--------------------------------------------------------------------------
*/

export async function getBatteryBySite(req, res, next) {

    try {

        const batteries =

            await batteryService.getBatteryBanks(

                req.body.siteId

            );

        return res.status(200).json({

            success: true,

            data: batteries

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    createBattery,

    getBatteries,

    getBatteryById,

    updateBattery,

    deleteBattery,

    getBatteryBySite

};