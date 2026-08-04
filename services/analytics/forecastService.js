import Telemetry from "../../models/Telemetry.js";
import Weather from "../../models/Weather.js";
import EnergyForecast from "../../models/EnergyForecast.js";
import mongoose from "mongoose";
import {
    emitAnalytics
} from "../../websocket/eventEmitters.js";
/*
|--------------------------------------------------------------------------
| Historical Telemetry
|--------------------------------------------------------------------------
*/

function buildSiteQuery(siteId) {

    if (
        typeof siteId === "string" &&
        mongoose.Types.ObjectId.isValid(siteId)
    ) {
        return {
            site: siteId
        };
    }

    return {};
}

export async function getHistoricalTelemetry(
    siteId,
    field,
    limit = 288
) {

    const records = await Telemetry.find(

        buildSiteQuery(siteId)

    )
        .select(`timestamp ${field}`)
        .sort({
            timestamp: -1
        })
        .limit(limit)
        .lean();

    return records.reverse();

}
/*
|--------------------------------------------------------------------------
| Historical Weather
|--------------------------------------------------------------------------
*/

export async function getHistoricalWeather(
    siteId,
    field,
    limit = 288
) {

    const records = await Weather.find(

        buildSiteQuery(siteId)

    )
        .select(`timestamp ${field}`)
        .sort({
            timestamp: -1
        })
        .limit(limit)
        .lean();

    return records.reverse();

}

/*
|--------------------------------------------------------------------------
| Extract Numeric Series
|--------------------------------------------------------------------------
*/

export function extractSeries(records, field) {

    return records
        .map(item => item[field])
        .filter(value => typeof value === "number");

}

/*
|--------------------------------------------------------------------------
| Persistence Forecast
|--------------------------------------------------------------------------
*/

export function persistenceForecast(series) {

    if (!series.length) {

        return 0;

    }

    return series[series.length - 1];

}

/*
|--------------------------------------------------------------------------
| Moving Average
|--------------------------------------------------------------------------
*/

export function movingAverage(
    series,
    window = 12
) {

    if (!series.length) {

        return 0;

    }

    const values = series.slice(-window);

    return values.reduce(

        (sum, value) => sum + value,

        0

    ) / values.length;

}

/*
|--------------------------------------------------------------------------
| Weighted Moving Average
|--------------------------------------------------------------------------
*/

export function weightedMovingAverage(series) {

    if (!series.length) {

        return 0;

    }

    const values = series.slice(-10);

    let numerator = 0;

    let denominator = 0;

    values.forEach((value, index) => {

        const weight = index + 1;

        numerator += value * weight;

        denominator += weight;

    });

    return numerator / denominator;

}

/*
|--------------------------------------------------------------------------
| Exponential Smoothing
|--------------------------------------------------------------------------
*/

export function exponentialSmoothing(

    series,

    alpha = 0.30

) {

    if (!series.length) {

        return 0;

    }

    let forecast = series[0];

    for (let i = 1; i < series.length; i++) {

        forecast =

            alpha * series[i] +

            (1 - alpha) * forecast;

    }

    return forecast;

}

/*
|--------------------------------------------------------------------------
| Linear Regression Forecast
|--------------------------------------------------------------------------
*/

export function linearRegressionForecast(series) {

    if (series.length < 2) {

        return persistenceForecast(series);

    }

    const n = series.length;

    let sumX = 0;

    let sumY = 0;

    let sumXY = 0;

    let sumXX = 0;

    for (let i = 0; i < n; i++) {

        sumX += i;

        sumY += series[i];

        sumXY += i * series[i];

        sumXX += i * i;

    }

    const slope =

        (

            n * sumXY -

            sumX * sumY

        ) /

        (

            n * sumXX -

            sumX * sumX

        );

    const intercept =

        (

            sumY -

            slope * sumX

        ) / n;

    return intercept + slope * n;

}

/*
|--------------------------------------------------------------------------
| Select Forecast Algorithm
|--------------------------------------------------------------------------
*/

export function runForecast(

    series,

    algorithm = "moving-average"

) {

    switch (algorithm) {

        case "persistence":

            return persistenceForecast(series);

        case "weighted":

            return weightedMovingAverage(series);

        case "exponential":

            return exponentialSmoothing(series);

        case "linear":

            return linearRegressionForecast(series);

        default:

            return movingAverage(series);

    }

}

/*
|--------------------------------------------------------------------------
| Forecast Solar Generation
|--------------------------------------------------------------------------
*/

export async function forecastSolar(

    siteId,

    algorithm = "moving-average"

) {

    const history = await getHistoricalTelemetry(

        siteId,

        "solarPower"

    );

    const series = extractSeries(

        history,

        "solarPower"

    );

    const prediction = runForecast(

        series,

        algorithm

    );

    const forecast = {

        parameter: "solarPower",

        algorithm,

        predictedValue: Number(prediction.toFixed(2)),

        unit: "W",

        generatedAt: new Date()

    };

    return broadcastForecast(siteId, forecast);

}

/*
|--------------------------------------------------------------------------
| Forecast Battery SOC
|--------------------------------------------------------------------------
*/

export async function forecastBatterySOC(

    siteId,

    algorithm = "moving-average"

) {

    const history = await getHistoricalTelemetry(

        siteId,

        "batterySOC"

    );

    const series = extractSeries(

        history,

        "batterySOC"

    );

    const prediction = runForecast(

        series,

        algorithm

    );

    const forecast = {

        parameter: "batterySOC",

        algorithm,

        predictedValue: Number(prediction.toFixed(2)),

        unit: "%",

        generatedAt: new Date()

    };

    return broadcastForecast(siteId, forecast);

}

/*
|--------------------------------------------------------------------------
| Forecast Load Demand
|--------------------------------------------------------------------------
*/

export async function forecastLoad(

    siteId,

    algorithm = "moving-average"

) {

    const history = await getHistoricalTelemetry(

        siteId,

        "loadPower"

    );

    const series = extractSeries(

        history,

        "loadPower"

    );

    const prediction = runForecast(

        series,

        algorithm

    );

    const forecast = {

        parameter: "loadPower",

        algorithm,

        predictedValue: Number(prediction.toFixed(2)),

        unit: "W",

        generatedAt: new Date()

    };

    return broadcastForecast(siteId, forecast);
}

/*
|--------------------------------------------------------------------------
| Forecast Grid Import
|--------------------------------------------------------------------------
*/

export async function forecastGrid(

    siteId,

    algorithm = "moving-average"

) {

    const history = await getHistoricalTelemetry(

        siteId,

        "gridPower"

    );

    const series = extractSeries(

        history,

        "gridPower"

    );

    const prediction = runForecast(

        series,

        algorithm

    );

    const forecast = {

        parameter: "gridPower",

        algorithm,

        predictedValue: Number(prediction.toFixed(2)),

        unit: "W",

        generatedAt: new Date()

    };

    return broadcastForecast(siteId, forecast);

}

/*
|--------------------------------------------------------------------------
| Forecast Generator Output
|--------------------------------------------------------------------------
*/

export async function forecastGenerator(

    siteId,

    algorithm = "moving-average"

) {

    const history = await getHistoricalTelemetry(

        siteId,

        "generatorPower"

    );

    const series = extractSeries(

        history,

        "generatorPower"

    );

    const prediction = runForecast(

        series,

        algorithm

    );

    const forecast = {

        parameter: "generatorPower",

        algorithm,

        predictedValue: Number(prediction.toFixed(2)),

        unit: "W",

        generatedAt: new Date()

    };

    return broadcastForecast(siteId, forecast);

}

/*
|--------------------------------------------------------------------------
| Forecast Weather
|--------------------------------------------------------------------------
*/

export async function forecastWeather(

    siteId,

    algorithm = "moving-average"

) {

    const temperatureHistory = await getHistoricalWeather(

        siteId,

        "temperature"

    );

    const irradianceHistory = await getHistoricalWeather(

        siteId,

        "solarIrradiance"

    );

    const forecast = {

        temperature: Number(

            runForecast(

                extractSeries(

                    temperatureHistory,

                    "temperature"

                ),

                algorithm

            ).toFixed(2)

        ),

        solarIrradiance: Number(

            runForecast(

                extractSeries(

                    irradianceHistory,

                    "solarIrradiance"

                ),

                algorithm

            ).toFixed(2)

        ),

        algorithm,

        generatedAt: new Date()

    };

    return broadcastForecast(siteId, forecast);
}

/*
|--------------------------------------------------------------------------
| Save Forecast
|--------------------------------------------------------------------------
*/

export async function saveForecast(

    siteId,

    parameter,

    value,

    algorithm

) {

    const payload = {

        parameter,

        algorithm,

        predictedValue: value,

        forecastTime: new Date(),

        createdAt: new Date()

    };

    if (
        typeof siteId === "string" &&
        mongoose.Types.ObjectId.isValid(siteId)
    ) {
        payload.site = siteId;
    }

    return EnergyForecast.create(payload);

}

/*
|--------------------------------------------------------------------------
| Broadcast Forecast
|--------------------------------------------------------------------------
*/

async function broadcastForecast(siteId, forecast) {

    if (!siteId) {
        return forecast;
    }

    emitAnalytics(siteId, {
        type: "forecast",
        data: forecast,
        timestamp: new Date()
    });

    return forecast;

}

/*
|--------------------------------------------------------------------------
| Forecast Dashboard
|--------------------------------------------------------------------------
*/

export async function getForecastDashboard(

    siteId,

    algorithm = "moving-average"

) {

    const [

        solar,

        battery,

        load,

        grid,

        generator,

        weather

    ] = await Promise.all([

        forecastSolar(siteId, algorithm),

        forecastBatterySOC(siteId, algorithm),

        forecastLoad(siteId, algorithm),

        forecastGrid(siteId, algorithm),

        forecastGenerator(siteId, algorithm),

        forecastWeather(siteId, algorithm)

    ]);

    const dashboard = {

        solar,

        battery,

        load,

        grid,

        generator,

        weather,

        generatedAt: new Date()

    };

    emitAnalytics(siteId, {
        type: "forecast-dashboard",
        data: dashboard
    });

    return dashboard;

}

    /*
    |--------------------------------------------------------------------------
    | Mean Absolute Error (MAE)
    |--------------------------------------------------------------------------
    */

    export function calculateMAE(actual, predicted) {

        if (!actual.length || actual.length !== predicted.length) {

            return 0;

        }

        const error = actual.reduce((sum, value, index) => {

            return sum + Math.abs(value - predicted[index]);

        }, 0);

        return Number((error / actual.length).toFixed(4));

    }

    /*
    |--------------------------------------------------------------------------
    | Root Mean Square Error (RMSE)
    |--------------------------------------------------------------------------
    */

    export function calculateRMSE(actual, predicted) {

        if (!actual.length || actual.length !== predicted.length) {

            return 0;

        }

        const mse = actual.reduce((sum, value, index) => {

            return sum + Math.pow(value - predicted[index], 2);

        }, 0) / actual.length;

        return Number(Math.sqrt(mse).toFixed(4));

    }

    /*
    |--------------------------------------------------------------------------
    | Mean Absolute Percentage Error (MAPE)
    |--------------------------------------------------------------------------
    */

    export function calculateMAPE(actual, predicted) {

        if (!actual.length || actual.length !== predicted.length) {

            return 0;

        }

        const percentageError = actual.reduce((sum, value, index) => {

            if (value === 0) {

                return sum;

            }

            return sum + Math.abs((value - predicted[index]) / value);

        }, 0);

        return Number(

            ((percentageError / actual.length) * 100).toFixed(2)

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Forecast Accuracy Evaluation
    |--------------------------------------------------------------------------
    */

    export function evaluateForecastAccuracy(actual, predicted) {

        return {

            mae: calculateMAE(actual, predicted),

            rmse: calculateRMSE(actual, predicted),

            mape: calculateMAPE(actual, predicted)

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Automatic Algorithm Selection
    |--------------------------------------------------------------------------
    */

    export function selectBestAlgorithm(results) {

        if (!Array.isArray(results) || !results.length) {

            return null;

        }

        return results.reduce((best, current) => {

            return current.rmse < best.rmse ? current : best;

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Multi-Step Forecast Series
    |--------------------------------------------------------------------------
    */

    export function generateForecastSeries(

        initialValue,

        steps = 24

    ) {

        return Array.from({ length: steps }, (_, index) => ({

            step: index + 1,

            predictedValue: Number(initialValue.toFixed(2))

        }));

    }

    /*
    |--------------------------------------------------------------------------
    | Forecast Next 24 Hours
    |--------------------------------------------------------------------------
    */

    export async function forecastNext24Hours(

        siteId,

        algorithm = "moving-average"

    ) {

        const solar = await forecastSolar(siteId, algorithm);

        return generateForecastSeries(

            solar.predictedValue,

            24

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Forecast Next 7 Days
    |--------------------------------------------------------------------------
    */

    export async function forecastNext7Days(

        siteId,

        algorithm = "moving-average"

    ) {

        const load = await forecastLoad(siteId, algorithm);

        return generateForecastSeries(

            load.predictedValue,

            7

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Forecast Model Registry
    |--------------------------------------------------------------------------
    */

    const forecastModels = {

        persistence: persistenceForecast,

        movingAverage,

        weighted: weightedMovingAverage,

        exponential: exponentialSmoothing,

        linear: linearRegressionForecast

    };

    /*
    |--------------------------------------------------------------------------
    | Register Custom Forecast Model
    |--------------------------------------------------------------------------
    */

    export function registerForecastModel(

        name,

        handler

    ) {

        if (typeof handler !== "function") {

            throw new Error("Forecast model must be a function.");

        }

        forecastModels[name] = handler;

    }

    /*
    |--------------------------------------------------------------------------
    | Get Registered Forecast Models
    |--------------------------------------------------------------------------
    */

    export function getForecastModels() {

        return Object.keys(forecastModels);

    }

    /*
    |--------------------------------------------------------------------------
    | Future ML Hooks
    |--------------------------------------------------------------------------
    */

    export async function runARIMAForecast() {

        throw new Error(

            "ARIMA model not yet implemented."

        );

    }

    export async function runLSTMForecast() {

        throw new Error(

            "LSTM model not yet implemented."

        );

    }

    export async function runProphetForecast() {

        throw new Error(

            "Prophet model not yet implemented."

        );

    }

    export async function runPyTorchForecast() {

        throw new Error(

            "PyTorch forecast model not yet implemented."

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Dashboard Wrapper
    |--------------------------------------------------------------------------
    */

    export async function getDashboardForecast(filters = {}) {

        const siteId = filters.siteId || null;

        return getForecastDashboard(siteId);

    }
    /*
    |--------------------------------------------------------------------------
    | Default Export
    |--------------------------------------------------------------------------
    */

    export default {

        getHistoricalTelemetry,

        getHistoricalWeather,

        extractSeries,

        persistenceForecast,

        movingAverage,

        weightedMovingAverage,

        exponentialSmoothing,

        linearRegressionForecast,

        runForecast,

        forecastSolar,

        forecastBatterySOC,

        forecastLoad,

        forecastGrid,

        forecastGenerator,

        forecastWeather,

        saveForecast,

        getForecastDashboard,

        calculateMAE,

        calculateRMSE,

        calculateMAPE,

        evaluateForecastAccuracy,

        selectBestAlgorithm,

        generateForecastSeries,

        forecastNext24Hours,

        forecastNext7Days,

        registerForecastModel,

        getForecastModels,

        runARIMAForecast,

        runLSTMForecast,

        runProphetForecast,

        runPyTorchForecast,

        getDashboardForecast

    };