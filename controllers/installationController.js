import * as installationService from "../services/sites/installationService.js";
import * as solarService from "../services/sites/solarService.js";
import * as batteryService from "../services/sites/batteryService.js";
import * as generatorService from "../services/sites/generatorService.js";
import * as gridService from "../services/sites/gridService.js";
import * as telemetryService from "../services/telemetry/telemetryService.js";
import * as alarmService from "../services/telemetry/alarmService.js";
import * as statisticsService from "../services/analytics/statisticsService.js";
import * as reliabilityService from "../services/analytics/reliabilityService.js";
/*
|--------------------------------------------------------------------------
| Create Installation
|--------------------------------------------------------------------------
*/

export async function createInstallation(req, res) {

    try {

        const installation =
            await installationService.createInstallation(
                req.body
            );

        return res.status(201).json({

            success: true,

            message: "Installation created successfully.",

            data: installation

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Get Installations
|--------------------------------------------------------------------------
*/

export async function getInstallations(req, res) {

    try {

        const installations =
            await installationService.getInstallations({

                page: Number(req.query.page) || 1,

                limit: Number(req.query.limit) || 20,

                siteId: req.query.siteId,

                status: req.query.status

            });

        return res.status(200).json({

            success: true,

            data: installations

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Get Installation By ID
|--------------------------------------------------------------------------
*/

export async function getInstallation(req, res) {

    try {

        const installation =
            await installationService.getInstallationById(
                req.params.id
            );

        if (!installation) {

            return res.status(404).json({

                success: false,

                message: "Installation not found."

            });

        }

        return res.status(200).json({

            success: true,

            data: installation

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Update Installation
|--------------------------------------------------------------------------
*/

export async function updateInstallation(req, res) {

    try {

        const installation =
            await installationService.updateInstallation(

                req.params.id,

                req.body

            );

        return res.status(200).json({

            success: true,

            message: "Installation updated successfully.",

            data: installation

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Delete Installation
|--------------------------------------------------------------------------
*/

export async function deleteInstallation(req, res) {

    try {

        await installationService.deleteInstallation(

            req.params.id

        );

        return res.status(200).json({

            success: true,

            message: "Installation deleted successfully."

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}

/*
|--------------------------------------------------------------------------
| Assign Installation To Site
|--------------------------------------------------------------------------
*/

export async function assignToSite(req, res) {

    try {

        const installation =
            await installationService.assignToSite(

                req.params.id,

                req.body.siteId

            );

        return res.status(200).json({

            success: true,

            message: "Installation assigned successfully.",

            data: installation

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Commission Installation
|--------------------------------------------------------------------------
*/

export async function commissionInstallation(req, res) {

    try {

        const installation =
            await installationService.commissionInstallation(

                req.params.id,

                req.body

            );

        return res.status(200).json({

            success: true,

            message: "Installation commissioned successfully.",

            data: installation

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Decommission Installation
|--------------------------------------------------------------------------
*/

export async function decommissionInstallation(req, res) {

    try {

        const installation =
            await installationService.decommissionInstallation(

                req.params.id,

                req.body.reason

            );

        return res.status(200).json({

            success: true,

            message: "Installation decommissioned successfully.",

            data: installation

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Register Solar Array
|--------------------------------------------------------------------------
*/

export async function registerSolarArray(req, res) {

    try {

        const solar =
            await solarService.registerSolarArray(

                req.params.id,

                req.body

            );

        return res.status(201).json({

            success: true,

            message: "Solar array registered successfully.",

            data: solar

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Register Battery Bank
|--------------------------------------------------------------------------
*/

export async function registerBatteryBank(req, res) {

    try {

        const battery =
            await batteryService.registerBatteryBank(

                req.params.id,

                req.body

            );

        return res.status(201).json({

            success: true,

            message: "Battery bank registered successfully.",

            data: battery

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Register Generator
|--------------------------------------------------------------------------
*/

export async function registerGenerator(req, res) {

    try {

        const generator =
            await generatorService.registerGenerator(

                req.params.id,

                req.body

            );

        return res.status(201).json({

            success: true,

            message: "Generator registered successfully.",

            data: generator

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Register Grid Connection
|--------------------------------------------------------------------------
*/

export async function registerGrid(req, res) {

    try {

        const grid =
            await gridService.registerGridConnection(

                req.params.id,

                req.body

            );

        return res.status(201).json({

            success: true,

            message: "Grid connection registered successfully.",

            data: grid

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Register Victron GX Device
|--------------------------------------------------------------------------
*/

export async function registerVictronGX(req, res) {

    try {

        const device =
            await installationService.registerVictronGX(

                req.params.id,

                req.body

            );

        return res.status(201).json({

            success: true,

            message: "Victron GX device registered successfully.",

            data: device

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Register Huawei Rectifier
|--------------------------------------------------------------------------
*/

export async function registerHuaweiRectifier(req, res) {

    try {

        const rectifier =
            await installationService.registerHuaweiRectifier(

                req.params.id,

                req.body

            );

        return res.status(201).json({

            success: true,

            message: "Huawei rectifier registered successfully.",

            data: rectifier

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Register Smart Meter
|--------------------------------------------------------------------------
*/

export async function registerSmartMeter(req, res) {

    try {

        const meter =
            await installationService.registerSmartMeter(

                req.params.id,

                req.body

            );

        return res.status(201).json({

            success: true,

            message: "Smart meter registered successfully.",

            data: meter

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}
/*
|--------------------------------------------------------------------------
| Installation Dashboard
|--------------------------------------------------------------------------
*/

export async function installationDashboard(req, res) {

    try {

        const dashboard =
            await installationService.getInstallationDashboard(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            data: dashboard
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

/*
|--------------------------------------------------------------------------
| Installation Health
|--------------------------------------------------------------------------
*/

export async function installationHealth(req, res) {

    try {

        const health =
            await installationService.getInstallationHealth(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            data: health
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Configuration Summary
|--------------------------------------------------------------------------
*/

export async function configurationSummary(req, res) {

    try {

        const summary =
            await installationService.getConfigurationSummary(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            data: summary
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

/*
|--------------------------------------------------------------------------
| Asset Inventory
|--------------------------------------------------------------------------
*/

export async function assetInventory(req, res) {

    try {

        const inventory =
            await installationService.getAssetInventory(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            data: inventory
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Energy Configuration Summary
|--------------------------------------------------------------------------
*/

export async function energyConfiguration(req, res) {

    try {

        const configuration =
            await installationService.getEnergyConfiguration(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            data: configuration
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

/*
|--------------------------------------------------------------------------
| Communication Status
|--------------------------------------------------------------------------
*/

export async function communicationStatus(req, res) {

    try {

        const status =
            await telemetryService.getCommunicationStatus(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            data: status
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Installation Alarm Summary
|--------------------------------------------------------------------------
*/

export async function installationAlarms(req, res) {

    try {

        const alarms =
            await alarmService.getInstallationAlarms(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            data: alarms
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Installation Performance Metrics
|--------------------------------------------------------------------------
*/

export async function installationPerformance(req, res) {

    try {

        const performance =
            await statisticsService.getInstallationPerformance(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            data: performance
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
/*
|--------------------------------------------------------------------------
| Installation Reliability Metrics
|--------------------------------------------------------------------------
*/

export async function installationReliability(req, res) {

    try {

        const metrics =
            await reliabilityService.generateReliabilityMetrics(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            data: metrics
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

/*
|--------------------------------------------------------------------------
| Export Installation Configuration
|--------------------------------------------------------------------------
*/

export async function exportInstallation(req, res) {

    try {

        const result =
            await installationService.exportInstallation(
                req.params.id,
                req.query.format || "json"
            );

        return res.status(200).json({

            success: true,

            message: "Installation exported successfully.",

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Clone Installation
|--------------------------------------------------------------------------
*/

export async function cloneInstallation(req, res) {

    try {

        const installation =
            await installationService.cloneInstallation(

                req.params.id,

                req.body.siteId

            );

        return res.status(201).json({

            success: true,

            message: "Installation cloned successfully.",

            data: installation

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Validate Installation
|--------------------------------------------------------------------------
*/

export async function validateInstallation(req, res) {

    try {

        const validation =
            await installationService.validateInstallation(

                req.params.id

            );

        return res.status(200).json({

            success: true,

            data: validation

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Archive Installation
|--------------------------------------------------------------------------
*/

export async function archiveInstallation(req, res) {

    try {

        const installation =
            await installationService.archiveInstallation(

                req.params.id

            );

        return res.status(200).json({

            success: true,

            message: "Installation archived successfully.",

            data: installation

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Restore Installation
|--------------------------------------------------------------------------
*/

export async function restoreInstallation(req, res) {

    try {

        const installation =
            await installationService.restoreInstallation(

                req.params.id

            );

        return res.status(200).json({

            success: true,

            message: "Installation restored successfully.",

            data: installation

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Installation Statistics
|--------------------------------------------------------------------------
*/

export async function installationStatistics(req, res) {

    try {

        const statistics =
            await installationService.getInstallationStatistics();

        return res.status(200).json({

            success: true,

            data: statistics

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    // CRUD
    createInstallation,
    getInstallations,
    getInstallation,
    updateInstallation,
    deleteInstallation,

    // Lifecycle
    assignToSite,
    commissionInstallation,
    decommissionInstallation,

    // Assets
    registerSolarArray,
    registerBatteryBank,
    registerGenerator,
    registerGrid,
    registerVictronGX,
    registerHuaweiRectifier,
    registerSmartMeter,

    // Monitoring
    installationDashboard,
    installationHealth,
    configurationSummary,
    assetInventory,
    energyConfiguration,
    communicationStatus,
    installationAlarms,
    installationPerformance,
    installationReliability,

    // Administration
    exportInstallation,
    cloneInstallation,
    validateInstallation,
    archiveInstallation,
    restoreInstallation,
    installationStatistics

};