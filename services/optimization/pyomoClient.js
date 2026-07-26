import axios from "axios";

import logger from "../../utils/logger.js";

const client = axios.create({

    baseURL:

        process.env.PYOMO_SERVICE_URL,

    timeout:

        Number(

            process.env.PYOMO_TIMEOUT ||

            300000

        ),

    headers: {

        "Content-Type":

            "application/json"

    }

});

/*
|--------------------------------------------------------------------------
| Run Optimization
|--------------------------------------------------------------------------
*/

export async function solve(payload) {

    try {

        const response = await client.post(

            "/optimize",

            payload

        );

        return response.data;

    }

    catch (error) {

        logger.error({
            endpoint: "/optimize",
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        if (

            error.response

        ) {

            const message =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                error.message;

            throw new Error(message);

        }

        throw error;

    }

}

export async function solveSenario(payload, scenario) {

    try {

        const response = await client.post(

            "/optimize",

            payload,

            scenario

        );

        return response.data;

    }

    catch (error) {

        logger.error({
            endpoint: "/optimize",
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        if (

            error.response

        ) {

            const message =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                error.message;

            throw new Error(message);

        }

        throw error;

    }

}

export async function pareto(payload) {

    try {

        const response = await client.post(

            "/optimize",

            payload

        );

        return response.data;

    }

    catch (error) {

        logger.error({
            endpoint: "/optimize",
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        if (

            error.response

        ) {

            const message =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                error.message;

            throw new Error(message);

        }

        throw error;

    }

}

export async function sensitivity(payload, parameter, values) {

    try {

        const response = await client.post(

            "/optimize",

            payload,
            
            parameter, 
            
            values


        );

        return response.data;

    }

    catch (error) {

        logger.error({
            endpoint: "/optimize",
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        if (

            error.response

        ) {

            const message =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                error.message;

            throw new Error(message);

        }

        throw error;

    }

}




export async function health() {
    const response = await client.get("/health");
    return response.data;
}