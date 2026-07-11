import { get } from "./apiClient.js";
import { env } from "../../config/env.js";
import logger from "../../utils/logger.js";
import Installation from "../../models/Installation.js";

/*
|--------------------------------------------------------------------------
| Fetch Installations
|--------------------------------------------------------------------------
*/

export async function getInstallations() {

    return await Installation.find({

        isActive: true

    })
    .populate("site")
    .lean();

}

/*
|--------------------------------------------------------------------------
| Fetch One Installation
|--------------------------------------------------------------------------
*/

export async function getInstallation(installationId) {

    try {

        return await get(

            `/installations/${installationId}`

        );

    }

    catch (error) {

        logger.error(error);

        throw error;

    }

}

export default {

    getInstallations,

    getInstallation

};