import axios from "axios";
import { env } from "../../config/env.js";
import logger from "../../utils/logger.js";

const api = axios.create({

    baseURL: env.vrmApiBaseUrl,

    timeout: 30000,

    headers: {

        Accept: "application/json",

        "Content-Type": "application/json",

        "x-authorization": `Token ${env.vrmAccessToken}`

    }

});

/*
|--------------------------------------------------------------------------
| Request Logger
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(config => {

    console.log(
        "GET:",
        config.baseURL + config.url
    );

    return config;

});

/*
|--------------------------------------------------------------------------
| Response Logger
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(

    response => response,

    error => {

        console.error({

            status: error.response?.status,

            url: error.config?.url,

            method: error.config?.method,

            data: error.response?.data


        });

        return Promise.reject(error);

    }

);

export async function get(endpoint, params = {}) {

    const { data } = await api.get(endpoint, {

        params

    });

    return data;

}

export async function post(endpoint, payload = {}) {

    const { data } = await api.post(endpoint, payload);

    return data;

}

export async function put(endpoint, payload = {}) {

    const { data } = await api.put(endpoint, payload);

    return data;

}

export async function remove(endpoint) {

    const { data } = await api.delete(endpoint);

    return data;

}

export default api;