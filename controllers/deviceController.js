import deviceService from "../services/device/deviceService.js";

/**
 * Device Controller
 */

/**
 * Get all devices
 */
export async function getDevices(
    req,
    res,
    next
) {
    try {
        const devices =
            await deviceService.getDevices(
                req.query
            );

        return res.status(200).json({
            success: true,
            message:
                "Devices retrieved successfully.",
            data: devices
        });
    }
    catch (error) {
        next(error);
    }
}

/**
 * Get device by MongoDB ID
 */
export async function getDevice(
    req,
    res,
    next
) {
    try {
        const device =
            await deviceService.getDeviceById(
                req.params.id
            );

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found."
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Device retrieved successfully.",
            data: device
        });
    }
    catch (error) {
        next(error);
    }
}

/**
 * Get device by deviceId
 */
export async function getDeviceByDeviceId(
    req,
    res,
    next
) {
    try {
        const device =
            await deviceService
                .getDeviceByDeviceId(
                    req.params.deviceId
                );

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found."
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Device retrieved successfully.",
            data: device
        });
    }
    catch (error) {
        next(error);
    }
}

/**
 * Create device
 */
export async function createDevice(
    req,
    res,
    next
) {
    try {
        const device =
            await deviceService.createDevice(
                req.body
            );

        return res.status(201).json({
            success: true,
            message:
                "Device created successfully.",
            data: device
        });
    }
    catch (error) {
        next(error);
    }
}

/**
 * Update device
 */
export async function updateDevice(
    req,
    res,
    next
) {
    try {
        const device =
            await deviceService.updateDevice(
                req.params.id,
                req.body
            );

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found."
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Device updated successfully.",
            data: device
        });
    }
    catch (error) {
        next(error);
    }
}

/**
 * Delete device
 */
export async function deleteDevice(
    req,
    res,
    next
) {
    try {
        const device =
            await deviceService.deleteDevice(
                req.params.id
            );

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found."
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Device deleted successfully.",
            data: device
        });
    }
    catch (error) {
        next(error);
    }
}

/**
 * Device summary
 */
export async function getDeviceSummary(
    req,
    res,
    next
) {
    try {
        const summary =
            await deviceService.getDeviceSummary(
                req.query
            );

        return res.status(200).json({
            success: true,
            message:
                "Device summary retrieved successfully.",
            data: summary
        });
    }
    catch (error) {
        next(error);
    }
}

/**
 * Device statistics
 */
export async function getDeviceStatistics(
    req,
    res,
    next
) {
    try {
        const statistics =
            await deviceService
                .getDeviceStatistics(
                    req.query
                );

        return res.status(200).json({
            success: true,
            message:
                "Device statistics retrieved successfully.",
            data: statistics
        });
    }
    catch (error) {
        next(error);
    }
}

/**
 * Device health
 */
export async function getDeviceHealth(
    req,
    res,
    next
) {
    try {
        const health =
            await deviceService.getDeviceHealth(
                req.query
            );

        return res.status(200).json({
            success: true,
            message:
                "Device health retrieved successfully.",
            data: health
        });
    }
    catch (error) {
        next(error);
    }
}

/**
 * Refresh devices
 */
export async function refreshDevices(
    req,
    res,
    next
) {
    try {
        const result =
            await deviceService.refreshDevices(
                req.query
            );

        return res.status(200).json({
            success: true,
            message:
                "Devices refreshed successfully.",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
}

/**
 * Firmware versions
 */
export async function getFirmwareVersions(
    req,
    res,
    next
) {
    try {
        const versions =
            await deviceService
                .getFirmwareVersions(
                    req.query
                );

        return res.status(200).json({
            success: true,
            message:
                "Firmware versions retrieved successfully.",
            data: versions
        });
    }
    catch (error) {
        next(error);
    }
}

/**
 * Device types
 */
export async function getDeviceTypes(
    req,
    res,
    next
) {
    try {
        const types =
            await deviceService.getDeviceTypes(
                req.query
            );

        return res.status(200).json({
            success: true,
            message:
                "Device types retrieved successfully.",
            data: types
        });
    }
    catch (error) {
        next(error);
    }
}

/**
 * Manufacturers
 */
export async function getManufacturers(
    req,
    res,
    next
) {
    try {
        const manufacturers =
            await deviceService
                .getManufacturers(
                    req.query
                );

        return res.status(200).json({
            success: true,
            message:
                "Manufacturers retrieved successfully.",
            data: manufacturers
        });
    }
    catch (error) {
        next(error);
    }
}

export default {
    getDevices,
    getDevice,
    getDeviceByDeviceId,
    createDevice,
    updateDevice,
    deleteDevice,
    getDeviceSummary,
    getDeviceStatistics,
    getDeviceHealth,
    refreshDevices,
    getFirmwareVersions,
    getDeviceTypes,
    getManufacturers
};