import axios from "axios";

import logger from "../../utils/logger.js";

const client = axios.create({

    baseURL:

        process.env.PYOMO_SERVICE_URL,

    timeout:

        Number(

            process.env.PYOMO_TIMEOUT ??

            300000

        ),

    headers: {

        "Content-Type":

            "application/json"

    }

});

/*
|--------------------------------------------------------------------------
| Generic Request
|--------------------------------------------------------------------------
*/

async function post(endpoint, payload) {

    const started = Date.now();

    try {

        const response = await client.post(

            endpoint,

            payload

        );

        if (!response.data) {

            throw new Error(

                "Optimization service returned an empty response."

            );

        }

        logger.info(

            `${endpoint} completed in ${Date.now()-started} ms.`

        );

        return response.data;

    }

    catch (error) {

        logger.error({

            endpoint,

            status:

                error.response?.status,

            data:

                error.response?.data,

            message:

                error.message

        });

        throw new Error(

            error.response?.data?.detail ||

            error.response?.data?.message ||

            error.message

        );

    }

}

/*
|--------------------------------------------------------------------------
| Optimization
|--------------------------------------------------------------------------
*/

export function solve(payload) {

    return post(

        "/optimize",

        payload

    );

}

/*
|--------------------------------------------------------------------------
| Scenario
|--------------------------------------------------------------------------
*/

export function solveScenario(

    payload,

    scenario

) {

    return post(

        `/optimize/scenario/${scenario}`,

        payload

    );

}

/*
|--------------------------------------------------------------------------
| Pareto
|--------------------------------------------------------------------------
*/

export function pareto(payload) {

    return post(

        "/optimize/pareto",

        payload

    );

}

/*
|--------------------------------------------------------------------------
| Sensitivity
|--------------------------------------------------------------------------
*/

export function sensitivity(

    payload,

    parameter,

    values

) {

    return post(

        `/optimize/sensitivity?parameter=${parameter}&values=${values.join(",")}`,

        payload

    );

}

/*
|--------------------------------------------------------------------------
| Health
|--------------------------------------------------------------------------
*/

export async function health() {

    const response = await client.get(

        "/health",

        {

            timeout: 5000

        }

    );

    return response.data;

}