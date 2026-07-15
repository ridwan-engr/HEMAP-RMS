import Weather from "../models/Weather.js";
import Site from "../models/Site.js";
import AuditLog from "../models/AuditLog.js";
import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Create Weather Record
|--------------------------------------------------------------------------
*/

export async function createWeather(req, res, next) {

    try {

        const {

            site,

            timestamp,

            temperature,

            humidity,

            solarIrradiance,

            windSpeed,

            windDirection,

            rainfall,

            pressure,

            cloudCover,

            weatherCondition

        } = req.body;

        const siteExists = await Site.findById(site);

        if (!siteExists) {

            return res.status(404).json({

                success: false,

                message: "Site not found."

            });

        }

        const weather = await Weather.create({

            site,

            timestamp,

            temperature,

            humidity,

            solarIrradiance,

            windSpeed,

            windDirection,

            rainfall,

            pressure,

            cloudCover,

            weatherCondition

        });

        await AuditLog.create({

            action: "WEATHER_CREATED",

            module: "WEATHER",

            performedBy: req.user.id,

            details: `Weather record created for ${siteExists.name}.`

        });

        logger.success("Weather record created.");

        return res.status(201).json({

            success: true,

            data: weather

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Get Latest Weather
|--------------------------------------------------------------------------
*/

export async function getLatestWeather(req, res, next) {

    try {

        const weather = await Weather

            .findOne({

                site: req.body.siteId

            })

            .sort({

                timestamp: -1

            })

            .populate("site");

        if (!weather) {

            return res.status(404).json({

                success: false,

                message: "Weather data not found."

            });

        }

        return res.json({

            success: true,

            data: weather

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Weather History
|--------------------------------------------------------------------------
*/

export async function getWeatherHistory(req, res, next) {

    try {

        const {

            page = 1,

            limit = 100,

            start,

            end

        } = req.body;

        const filter = {

            site: req.body.siteId

        };

        if (start || end) {

            filter.timestamp = {};

            if (start)

                filter.timestamp.$gte = new Date(start);

            if (end)

                filter.timestamp.$lte = new Date(end);

        }

        const weather = await Weather

            .find(filter)

            .populate("site")

            .sort({

                timestamp: -1

            })

            .skip(

                (Number(page) - 1) *

                Number(limit)

            )

            .limit(

                Number(limit)

            );

        const total = await Weather.countDocuments(

            filter

        );

        return res.json({

            success: true,

            total,

            page: Number(page),

            limit: Number(limit),

            data: weather

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Get Weather By ID
|--------------------------------------------------------------------------
*/

export async function getWeatherById(req, res, next) {

    try {

        const weather = await Weather

            .findById(req.body.id)

            .populate("site");

        if (!weather) {

            return res.status(404).json({

                success: false,

                message: "Weather record not found."

            });

        }

        return res.json({

            success: true,

            data: weather

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Update Weather
|--------------------------------------------------------------------------
*/

export async function updateWeather(req, res, next) {

    try {

        const weather = await Weather.findByIdAndUpdate(

            req.body.id,

            req.body,

            {

                new: true,

                runValidators: true

            }

        );

        if (!weather) {

            return res.status(404).json({

                success: false,

                message: "Weather record not found."

            });

        }

        await AuditLog.create({

            action: "WEATHER_UPDATED",

            module: "WEATHER",

            performedBy: req.user.id,

            details: `Updated weather ${weather._id}.`

        });

        logger.success("Weather updated.");

        return res.json({

            success: true,

            data: weather

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Delete Weather
|--------------------------------------------------------------------------
*/

export async function deleteWeather(req, res, next) {

    try {

        const weather = await Weather.findByIdAndDelete(

            req.body.id

        );

        if (!weather) {

            return res.status(404).json({

                success: false,

                message: "Weather record not found."

            });

        }

        await AuditLog.create({

            action: "WEATHER_DELETED",

            module: "WEATHER",

            performedBy: req.user.id,

            details: `Deleted weather ${weather._id}.`

        });

        logger.success("Weather deleted.");

        return res.json({

            success: true,

            message: "Weather record deleted successfully."

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Export Controller
|--------------------------------------------------------------------------
*/

export default {

    createWeather,

    getLatestWeather,

    getWeatherHistory,

    getWeatherById,

    updateWeather,

    deleteWeather

};