import axios from "axios";
import { env } from "../../config/env.js";
import logger from "../../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Validate Configuration
|--------------------------------------------------------------------------
*/

if (!env.vrmApiBaseUrl) {

    throw new Error(

        "VRM API base URL is not configured."

    );

}

if (!env.vrmAccessToken) {

    throw new Error(

        "VRM access token is not configured."

    );

}

/*
|--------------------------------------------------------------------------
| Axios Instance
|--------------------------------------------------------------------------
*/

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

api.interceptors.request.use(

    config => {

        logger.info({

            service: "VRM",

            method: config.method?.toUpperCase(),

            url: `${config.baseURL}${config.url}`,

            params: config.params,

            data: config.data

        });

        return config;

    },

    error => {

        logger.error({

            service: "VRM",

            stage: "request",

            message: error.message

        });

        return Promise.reject(error);

    }

);

/*
|--------------------------------------------------------------------------
| Response Logger
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(

    response => {

        logger.info({

            service: "VRM",

            method: response.config.method?.toUpperCase(),

            url: response.config.url,

            status: response.status

        });

        return response;

    },

    error => {

        logger.error({

            service: "VRM",

            stage: "response",

            method: error.config?.method?.toUpperCase(),

            url: error.config?.url,

            status: error.response?.status,

            message: error.message,

            data: error.response?.data

        });

        return Promise.reject(error);

    }

);

/*
|--------------------------------------------------------------------------
| HTTP Methods
|--------------------------------------------------------------------------
*/

export async function get(endpoint, params = {}) {

    const response = await api.get(endpoint, {

        params

    });

    return response.data;

}

export async function post(endpoint, payload = {}) {

    const response = await api.post(

        endpoint,

        payload

    );

    return response.data;

}

export async function put(endpoint, payload = {}) {

    const response = await api.put(

        endpoint,

        payload

    );

    return response.data;

}

export async function patch(endpoint, payload = {}) {

    const response = await api.patch(

        endpoint,

        payload

    );

    return response.data;

}

export async function remove(endpoint) {

    const response = await api.delete(

        endpoint

    );

    return response.data;

}

export default {

    api,

    get,

    post,

    put,

    patch,

    remove

};