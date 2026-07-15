import EnergyForecast from "../models/EnergyForecast.js";
import forecastService from "../services/analytics/forecastService.js";
import logger from "../utils/logger.js";


export async function createForecast(req, res, next) {

    try {

        const forecast = await EnergyForecast.create(

            req.body

        );

        return res.status(201).json({

            success: true,

            data: forecast

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

export async function getForecasts(req, res, next) {

    try {

        const forecasts =

            await EnergyForecast.find()

            .populate("site")

            .sort({

                forecastDate: -1

            });

        return res.status(200).json({

            success: true,

            data: forecasts

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

export async function getForecastById(req, res, next) {

    try {

        const forecast =

            await EnergyForecast.findById(

                req.body.id

            );

        if (!forecast) {

            return res.status(404).json({

                success: false,

                message: "Forecast not found."

            });

        }

        return res.status(200).json({

            success: true,

            data: forecast

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

export async function updateForecast(req, res, next) {

    try {

        const forecast =

            await EnergyForecast.findByIdAndUpdate(

                req.body.id,

                req.body,

                {

                    new: true,

                    runValidators: true

                }

            );

        return res.status(200).json({

            success: true,

            data: forecast

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

export async function deleteForecast(req, res, next) {

    try {

        await EnergyForecast.findByIdAndDelete(

            req.body.id

        );

        return res.status(200).json({

            success: true,

            message: "Forecast deleted."

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}

export async function runForecast(req, res, next) {

    try {

        const result =

            await forecastService.runForecast(

                req.body.id

            );

        return res.status(200).json({

            success: true,

            data: result

        });

    }

    catch (error) {

        logger.error(error);

        next(error);

    }

}