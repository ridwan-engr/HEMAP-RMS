import Weather from "../../models/Weather.js";
import Site from "../../models/Site.js";
import Telemetry from "../../models/Telemetry.js";

/*
|--------------------------------------------------------------------------
| Create Weather Record
|--------------------------------------------------------------------------
*/

export async function createWeather(data) {

    const site = await Site.findById(data.site);

    if (!site) {

        throw new Error(
            "Site not found."
        );

    }

    return await Weather.create(data);

}

/*
|--------------------------------------------------------------------------
| Get Weather Records
|--------------------------------------------------------------------------
*/

export async function getWeatherRecords(filters = {}) {

    const query = {};

    if (filters.site) {

        query.site = filters.site;

    }

    return await Weather.find(query)

        .populate("site")

        .sort({

            timestamp: -1

        });

}

/*
|--------------------------------------------------------------------------
| Get Weather By ID
|--------------------------------------------------------------------------
*/

export async function getWeatherById(id) {

    const weather = await Weather.findById(id)

        .populate("site");

    if (!weather) {

        throw new Error(
            "Weather record not found."
        );

    }

    return weather;

}

/*
|--------------------------------------------------------------------------
| Update Weather
|--------------------------------------------------------------------------
*/

export async function updateWeather(

    id,

    payload

) {

    const weather = await Weather.findByIdAndUpdate(

        id,

        payload,

        {

            new: true,

            runValidators: true

        }

    ).populate("site");

    if (!weather) {

        throw new Error(
            "Weather record not found."
        );

    }

    return weather;

}

/*
|--------------------------------------------------------------------------
| Delete Weather
|--------------------------------------------------------------------------
*/

export async function deleteWeather(id) {

    const weather = await Weather.findByIdAndDelete(id);

    if (!weather) {

        throw new Error(
            "Weather record not found."
        );

    }

    return weather;

}

/*
|--------------------------------------------------------------------------
| Latest Weather
|--------------------------------------------------------------------------
*/

export async function getLatestWeather(siteId) {

    return await Weather.findOne({

        site: siteId

    })

    .sort({

        timestamp: -1

    });

}

/*
|--------------------------------------------------------------------------
| Weather History
|--------------------------------------------------------------------------
*/

export async function getWeatherHistory(

    siteId,

    limit = 500

) {

    return await Weather.find({

        site: siteId

    })

    .sort({

        timestamp: -1

    })

    .limit(limit);

}

/*
|--------------------------------------------------------------------------
| Current Environmental Conditions
|--------------------------------------------------------------------------
*/

export async function getCurrentConditions(siteId) {

    const weather = await getLatestWeather(siteId);

    if (!weather) {

        return null;

    }

    return {

        temperature:

            weather.temperature,

        humidity:

            weather.humidity,

        windSpeed:

            weather.windSpeed,

        solarIrradiance:

            weather.solarIrradiance,

        rainfall:

            weather.rainfall,

        timestamp:

            weather.timestamp

    };

}

/*
|--------------------------------------------------------------------------
| Calculate Average Weather
|--------------------------------------------------------------------------
*/

export async function calculateAverageWeather(

    siteId,

    limit = 288

) {

    const history = await Weather.find({

        site: siteId

    })

    .sort({

        timestamp: -1

    })

    .limit(limit);

    if (!history.length) {

        return null;

    }

    const averageTemperature =

        history.reduce(

            (sum, item) =>

                sum + (item.temperature ?? 0),

            0

        ) / history.length;

    const averageHumidity =

        history.reduce(

            (sum, item) =>

                sum + (item.humidity ?? 0),

            0

        ) / history.length;

    const averageIrradiance =

        history.reduce(

            (sum, item) =>

                sum + (item.solarIrradiance ?? 0),

            0

        ) / history.length;

    const averageWindSpeed =

        history.reduce(

            (sum, item) =>

                sum + (item.windSpeed ?? 0),

            0

        ) / history.length;

    return {

        averageTemperature:

            Number(

                averageTemperature.toFixed(2)

            ),

        averageHumidity:

            Number(

                averageHumidity.toFixed(2)

            ),

        averageIrradiance:

            Number(

                averageIrradiance.toFixed(2)

            ),

        averageWindSpeed:

            Number(

                averageWindSpeed.toFixed(2)

            )

    };

}

/*
|--------------------------------------------------------------------------
| Solar Weather Index
|--------------------------------------------------------------------------
*/

export async function calculateSolarWeatherIndex(

    siteId

) {

    const latest = await getLatestWeather(siteId);

    if (!latest) {

        return null;

    }

    let score = 100;

    score -= Math.max(

        0,

        (latest.cloudCover ?? 0) * 0.35

    );

    score -= Math.max(

        0,

        (latest.humidity ?? 0) * 0.10

    );

    score += Math.min(

        20,

        (latest.solarIrradiance ?? 0) / 100

    );

    score = Math.max(

        0,

        Math.min(score, 100)

    );

    return {

        weatherIndex:

            Number(score.toFixed(2)),

        condition:

            score >= 80

                ? "EXCELLENT"

                : score >= 60

                ? "GOOD"

                : score >= 40

                ? "FAIR"

                : "POOR"

    };

}

/*
|--------------------------------------------------------------------------
| Weather Impact on Solar
|--------------------------------------------------------------------------
*/

export async function getWeatherImpact(

    siteId

) {

    const [

        weather,

        telemetry

    ] = await Promise.all([

        getLatestWeather(siteId),

        getLatestSolarTelemetry(siteId)

    ]);

    if (!weather || !telemetry) {

        return null;

    }

    return {

        irradiance:

            weather.solarIrradiance,

        cloudCover:

            weather.cloudCover,

        temperature:

            weather.temperature,

        solarPower:

            telemetry.power,

        performanceFactor:

            weather.solarIrradiance > 0

                ? Number(

                    (

                        telemetry.power /

                        weather.solarIrradiance

                    ).toFixed(4)

                )

                : 0

    };

}

/*
|--------------------------------------------------------------------------
| Weather Dashboard
|--------------------------------------------------------------------------
*/

export async function getWeatherDashboard(

    siteId

) {

    const [

        latest,

        history,

        averages,

        weatherIndex,

        impact

    ] = await Promise.all([

        getLatestWeather(siteId),

        getWeatherHistory(siteId, 100),

        calculateAverageWeather(siteId),

        calculateSolarWeatherIndex(siteId),

        getWeatherImpact(siteId)

    ]);

    return {

        latest,

        history,

        averages,

        weatherIndex,

        impact

    };

}

export default {

    createWeather,

    getWeather,

    getWeatherById,

    updateWeather,

    deleteWeather,

    getLatestWeather,

    getWeatherHistory,

    calculateAverageWeather,

    calculateSolarWeatherIndex,

    getWeatherImpact,

    getWeatherDashboard

};