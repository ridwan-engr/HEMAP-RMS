import { get } from "./apiClient.js";
import logger from "../../utils/logger.js";
import Installation from "../../models/Installation.js";

/*
|--------------------------------------------------------------------------
| Fetch Active Installations from MongoDB
|--------------------------------------------------------------------------
*/

export async function getInstallations() {

    try {

        return await Installation.find({

            isActive: true

        })

            .populate(

                "site",

                "name code location"

            )

            .lean();

    }

    catch (error) {

        logger.error({

            message: "Failed to retrieve installations.",

            error: error.message,

            stack: error.stack

        });

        throw error;

    }

}

/*
|--------------------------------------------------------------------------
| Fetch One Installation From VRM
|--------------------------------------------------------------------------
*/

export async function getInstallation(installationId) {

    if (!installationId) {

        throw new Error(

            "Installation ID is required."

        );

    }

    try {

        return await get(

            `/installations/${installationId}`

        );

    }

    catch (error) {

        logger.error({

            message: "Failed to retrieve installation from VRM.",

            installationId,

            status: error.response?.status,

            data: error.response?.data,

            error: error.message

        });

        throw error;

    }

}

export default {

    getInstallations,

    getInstallation

};