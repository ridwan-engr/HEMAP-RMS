import batteryService from "../services/sites/batteryService.js";

import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Create Battery
|--------------------------------------------------------------------------
*/

export async function createBattery(req, res, next) {
    try {
        const battery = await batteryService.registerBatteryBank(req.body);

        return res.status(201).json({
            success: true,
            message: "Battery created successfully.",
            data: battery
        });
    } catch (error) {
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
        const batteries = await batteryService.getBatteryBanks(req.query);

        return res.status(200).json({
            success: true,
            message: "Batteries retrieved successfully.",
            data: batteries
        });
    } catch (error) {
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
        const battery = await batteryService.getBatteryBank(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Battery retrieved successfully.",
            data: battery
        });
    } catch (error) {
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
        const battery = await batteryService.updateBatteryBank(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Battery updated successfully.",
            data: battery
        });
    } catch (error) {
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
        await batteryService.deleteBatteryBank(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Battery deleted successfully."
        });
    } catch (error) {
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
        const batteries = await batteryService.getBatteryBanks({
            siteId: req.params.siteId
        });

        return res.status(200).json({
            success: true,
            message: "Site batteries retrieved successfully.",
            data: batteries
        });
    } catch (error) {
        logger.error(error);
        next(error);
    }
}

export default {

    createBattery,

    getBatteries,

    getBatteryById,

    updateBattery,

    deleteBattery,

    getBatteryBySite

};