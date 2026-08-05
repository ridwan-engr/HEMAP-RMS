import { get } from "./apiClient.js";
import logger from "../../utils/logger.js";
import Installation from "../../models/Installation.js";

/*
|--------------------------------------------------------------------------
| Active Installations
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

            error: error.message

        });

        throw error;

    }

}

/*
|--------------------------------------------------------------------------
| Single Installation
|--------------------------------------------------------------------------
*/

export async function getInstallation(installationId) {

    if (!installationId) {

        throw new Error("Installation ID is required.");

    }

    try {

        const installation = await Installation.findOne({

            installationId

        })

        .populate(

            "site",

            "name code location"

        )

        .lean();

        if (!installation) {

            throw new Error("Installation not found.");

        }

        return installation;

    }

    catch (error) {

        logger.error({

            installationId,

            message: "Failed to retrieve installation.",

            error: error.message

        });

        throw error;

    }

}

export default {

    getInstallations,

    getInstallation

};