import asyncHandler from "express-async-handler";

import Solar from "../models/Solar.js";
import Site from "../models/Site.js";

import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Get Solar Assets
|--------------------------------------------------------------------------
*/

export const getSolars = asyncHandler(async (req, res) => {

    const page = Number(req.body.page) || 1;

    const limit = Number(req.body.limit) || 20;

    const skip = (page - 1) * limit;

    const filter = {};

    if (req.body.site) {

        filter.site = req.body.site;

    }

    if (req.body.status) {

        filter.status = req.body.status;

    }

    const total = await Solar.countDocuments(filter);

    const assets = await Solar.find(filter)

        .populate("site", "name siteCode")

        .sort({ createdAt: -1 })

        .skip(skip)

        .limit(limit);

    res.json({

        success: true,

        total,

        page,

        pages: Math.ceil(total / limit),

        data: assets

    });

});

/*
|--------------------------------------------------------------------------
| Get Solar Asset
|--------------------------------------------------------------------------
*/

export const getSolar = asyncHandler(async (req, res) => {

    const asset = await Solar.findById(req.body.id)

        .populate("site", "name siteCode");

    if (!asset) {

        res.status(404);

        throw new Error("Solar asset not found.");

    }

    res.json({

        success: true,

        data: asset

    });

});

/*
|--------------------------------------------------------------------------
| Create Solar Asset
|--------------------------------------------------------------------------
*/

export const createSolar = asyncHandler(async (req, res) => {

    const site = await Site.findById(req.body.site);

    if (!site) {

        res.status(404);

        throw new Error("Site not found.");

    }

    const asset = await Solar.create(req.body);

    logger.success(

        `Solar asset ${asset._id} created.`

    );

    res.status(201).json({

        success: true,

        data: asset

    });

});

/*
|--------------------------------------------------------------------------
| Update Solar Asset
|--------------------------------------------------------------------------
*/

export const updateSolar = asyncHandler(async (req, res) => {

    const asset = await Solar.findById(req.body.id);

    if (!asset) {

        res.status(404);

        throw new Error("Solar asset not found.");

    }

    Object.assign(asset, req.body);

    await asset.save();

    logger.info(

        `Solar asset ${asset._id} updated.`

    );

    res.json({

        success: true,

        data: asset

    });

});

/*
|--------------------------------------------------------------------------
| Delete Solar Asset
|--------------------------------------------------------------------------
*/

export const deleteSolar = asyncHandler(async (req, res) => {

    const asset = await Solar.findById(req.body.id);

    if (!asset) {

        res.status(404);

        throw new Error("Solar asset not found.");

    }

    await asset.deleteOne();

    logger.warn(

        `Solar asset ${asset._id} deleted.`

    );

    res.json({

        success: true,

        message: "Solar asset deleted."

    });

});

/*
|--------------------------------------------------------------------------
| Get Site Solar System
|--------------------------------------------------------------------------
*/

export const getSolarBySite = asyncHandler(async (req, res) => {

    const assets = await Solar.find({

        site: req.body.siteId

    }).sort({

        createdAt: -1

    });

    res.json({

        success: true,

        count: assets.length,

        data: assets

    });

});

/*
|--------------------------------------------------------------------------
| Get Solar Summary
|--------------------------------------------------------------------------
*/

export const getSolarSystems = asyncHandler(async (req, res) => {

    const siteId = req.body.siteId;

    const assets = await Solar.find({

        site: siteId

    });

    let installedCapacity = 0;

    let currentPower = 0;

    let dailyEnergy = 0;

    assets.forEach(asset => {

        installedCapacity += asset.installedCapacity || 0;

        currentPower += asset.currentPower || 0;

        dailyEnergy += asset.dailyEnergy || 0;

    });

    const efficiency =

        installedCapacity > 0

            ? Number(

                (

                    currentPower /

                    installedCapacity *

                    100

                ).toFixed(2)

            )

            : 0;

    res.json({

        success: true,

        data: {

            installedCapacity,

            currentPower,

            dailyEnergy,

            efficiency

        }

    });

});

/*
|--------------------------------------------------------------------------
| Update Live Solar Values
|--------------------------------------------------------------------------
*/

export const updateSolarRealtime = asyncHandler(async (req, res) => {

    const asset = await Solar.findById(req.body.id);

    if (!asset) {

        res.status(404);

        throw new Error("Solar asset not found.");

    }

    asset.currentPower = req.body.currentPower;

    asset.dailyEnergy = req.body.dailyEnergy;

    asset.temperature = req.body.temperature;

    asset.lastUpdate = new Date();

    await asset.save();

    logger.info(

        `Realtime solar updated for ${asset._id}`

    );

    res.json({

        success: true,

        data: asset

    });

});

export default {

    getSolars,

    getSolar,

    createSolar,

    updateSolar,

    deleteSolar,

    getSolarBySite,

    getSolarSystems,

    updateSolarRealtime

};