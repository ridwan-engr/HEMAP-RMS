import * as Device from "../../models/Device.js";


/**
 * Device Service
 *
 * Business logic for Device Management.
 */

/**
 * Get all devices
 */
export async function getDevices(filters = {}) {
    const {
        siteId,
        type,
        status,
        manufacturer,
        search
    } = filters;

    const query = {};

    if (siteId) {
        query.site = siteId;
    }

    if (type) {
        query.type = type;
    }

    if (status) {
        query.status = status;
    }

    if (manufacturer) {
        query.manufacturer = manufacturer;
    }

    if (search) {
        query.$or = [
            {
                name: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                deviceId: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                serialNumber: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                manufacturer: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                model: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }

    return Device.find(query)
        .populate("site", "name")
        .sort({
            createdAt: -1
        })
        .lean();
}

/**
 * Get device by ID
 *
 * Supports MongoDB _id.
 */
export async function getDeviceById(deviceId) {
    return Device.findById(deviceId)
        .populate("site", "name")
        .lean();
}

/**
 * Get device by deviceId
 */
export async function getDeviceByDeviceId(deviceId) {
    return Device.findOne({
        deviceId
    })
        .populate("site", "name")
        .lean();
}

/**
 * Create device
 */
export async function createDevice(payload) {
    const device = await Device.create(payload);

    return Device.findById(device._id)
        .populate("site", "name")
        .lean();
}

/**
 * Update device
 */
export async function updateDevice(
    deviceId,
    payload
) {
    return Device.findByIdAndUpdate(
        deviceId,
        {
            $set: payload
        },
        {
            new: true,
            runValidators: true
        }
    )
        .populate("site", "name")
        .lean();
}

/**
 * Delete device
 */
export async function deleteDevice(deviceId) {
    return Device.findByIdAndDelete(
        deviceId
    ).lean();
}

/**
 * Get device summary
 */
export async function getDeviceSummary(
    filters = {}
) {
    const {
        siteId
    } = filters;

    const match = {};

    if (siteId) {
        match.site = siteId;
    }

    const [
        total,
        online,
        offline,
        warning,
        fault
    ] = await Promise.all([
        Device.countDocuments(match),

        Device.countDocuments({
            ...match,
            status: "ONLINE"
        }),

        Device.countDocuments({
            ...match,
            status: "OFFLINE"
        }),

        Device.countDocuments({
            ...match,
            status: "WARNING"
        }),

        Device.countDocuments({
            ...match,
            status: "FAULT"
        })
    ]);

    return {
        total,
        online,
        offline,
        warning,
        fault
    };
}

/**
 * Get device statistics
 */
export async function getDeviceStatistics(
    filters = {}
) {
    const {
        siteId
    } = filters;

    const match = {};

    if (siteId) {
        match.site = siteId;
    }

    const [
        byType,
        byManufacturer,
        byStatus
    ] = await Promise.all([
        Device.aggregate([
            {
                $match: match
            },
            {
                $group: {
                    _id: "$type",
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ]),

        Device.aggregate([
            {
                $match: match
            },
            {
                $group: {
                    _id: "$manufacturer",
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ]),

        Device.aggregate([
            {
                $match: match
            },
            {
                $group: {
                    _id: "$status",
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ])
    ]);

    return {
        byType,
        byManufacturer,
        byStatus
    };
}

/**
 * Get device health
 */
export async function getDeviceHealth(
    filters = {}
) {
    const {
        siteId
    } = filters;

    const match = {};

    if (siteId) {
        match.site = siteId;
    }

    const devices = await Device.find(match)
        .select(
            "deviceId name type status lastCommunication site"
        )
        .populate("site", "name")
        .sort({
            lastCommunication: -1
        })
        .lean();

    const now = Date.now();

    const health = devices.map(
        (device) => {
            const lastCommunication =
                device.lastCommunication
                    ? new Date(
                        device.lastCommunication
                    ).getTime()
                    : null;

            const communicationAge =
                lastCommunication
                    ? now - lastCommunication
                    : null;

            let healthStatus =
                "UNKNOWN";

            if (
                device.status ===
                "FAULT"
            ) {
                healthStatus = "FAULT";
            }
            else if (
                device.status ===
                "WARNING"
            ) {
                healthStatus = "WARNING";
            }
            else if (
                device.status ===
                "OFFLINE"
            ) {
                healthStatus = "OFFLINE";
            }
            else if (
                device.status ===
                "ONLINE"
            ) {
                healthStatus = "HEALTHY";
            }

            return {
                ...device,
                healthStatus,
                communicationAge
            };
        }
    );

    return health;
}

/**
 * Refresh devices
 *
 * For now this refreshes the device dataset from
 * MongoDB. External synchronization can be added
 * later for VRM/GX/device integrations.
 */
export async function refreshDevices(
    filters = {}
) {
    const devices =
        await getDevices(filters);

    return {
        refreshedAt: new Date(),
        count: devices.length,
        devices
    };
}

/**
 * Get firmware versions
 */
export async function getFirmwareVersions(
    filters = {}
) {
    const {
        siteId
    } = filters;

    const match = {};

    if (siteId) {
        match.site = siteId;
    }

    return Device.aggregate([
        {
            $match: match
        },
        {
            $group: {
                _id: "$firmwareVersion",
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ]);
}

/**
 * Get device types
 */
export async function getDeviceTypes(
    filters = {}
) {
    const {
        siteId
    } = filters;

    const match = {};

    if (siteId) {
        match.site = siteId;
    }

    return Device.aggregate([
        {
            $match: match
        },
        {
            $group: {
                _id: "$type",
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ]);
}

/**
 * Get manufacturers
 */
export async function getManufacturers(
    filters = {}
) {
    const {
        siteId
    } = filters;

    const match = {};

    if (siteId) {
        match.site = siteId;
    }

    return Device.aggregate([
        {
            $match: match
        },
        {
            $group: {
                _id: "$manufacturer",
                count: {
                    $sum: 1
                }
            },
            $sort: {
                count: -1
            }
        }
    ]);
}

export default {
    getDevices,
    getDeviceById,
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