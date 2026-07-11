import * as siteService from "../services/sites/siteService.js";
import * as telemetryService from "../services/telemetry/telemetryService.js";
import * as statisticsService from "../services/analytics/statisticsService.js";
import * as reliabilityService from "../services/analytics/reliabilityService.js";

/*
|--------------------------------------------------------------------------
| Create Site
|--------------------------------------------------------------------------
*/

export async function createSite(req, res) {

    try {

        const site = await siteService.createSite(req.body);

        return res.status(201).json({
            success: true,
            message: "Site created successfully.",
            data: site
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
| Get All Sites
|--------------------------------------------------------------------------
*/

export async function getSites(req, res) {

    try {

        const options = {

            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 20,
            search: req.query.search || "",
            status: req.query.status || "",
            region: req.query.region || ""

        };

        const sites = await siteService.getSites(options);

        return res.status(200).json({
            success: true,
            data: sites
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
| Get Site By ID
|--------------------------------------------------------------------------
*/

export async function getSiteById(req, res) {

    try {

        const site = await siteService.getSiteById(req.params.id);

        if (!site) {

            return res.status(404).json({
                success: false,
                message: "Site not found."
            });

        }

        return res.status(200).json({
            success: true,
            data: site
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
| Update Site
|--------------------------------------------------------------------------
*/

export async function updateSite(req, res) {

    try {

        const site = await siteService.updateSite(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Site updated successfully.",
            data: site
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
| Delete Site
|--------------------------------------------------------------------------
*/

export async function deleteSite(req, res) {

    try {

        await siteService.deleteSite(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Site deleted successfully."
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
| Search Sites
|--------------------------------------------------------------------------
*/

export async function searchSites(req, res) {

    try {

        const results = await siteService.searchSites({

            keyword: req.query.keyword || "",

            region: req.query.region,

            state: req.query.state,

            status: req.query.status,

            technology: req.query.technology

        });

        return res.status(200).json({

            success: true,

            data: results

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
| Assign Engineer To Site
|--------------------------------------------------------------------------
*/

export async function assignEngineer(req, res) {

    try {

        const site = await siteService.assignEngineer(

            req.params.id,

            req.body.userId

        );

        return res.status(200).json({

            success: true,

            message: "Engineer assigned successfully.",

            data: site

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
| Remove Engineer From Site
|--------------------------------------------------------------------------
*/

export async function removeEngineer(req, res) {

    try {

        const site = await siteService.removeEngineer(

            req.params.id,

            req.params.userId

        );

        return res.status(200).json({

            success: true,

            message: "Engineer removed successfully.",

            data: site

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
| Activate Site
|--------------------------------------------------------------------------
*/

export async function activateSite(req, res) {

    try {

        const site = await siteService.activateSite(

            req.params.id

        );

        return res.status(200).json({

            success: true,

            message: "Site activated successfully.",

            data: site

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
| Deactivate Site
|--------------------------------------------------------------------------
*/

export async function deactivateSite(req, res) {

    try {

        const site = await siteService.deactivateSite(

            req.params.id

        );

        return res.status(200).json({

            success: true,

            message: "Site deactivated successfully.",

            data: site

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
| Update Site Coordinates
|--------------------------------------------------------------------------
*/

export async function updateCoordinates(req, res) {

    try {

        const site = await siteService.updateCoordinates(

            req.params.id,

            {

                latitude: req.body.latitude,

                longitude: req.body.longitude

            }

        );

        return res.status(200).json({

            success: true,

            message: "Coordinates updated successfully.",

            data: site

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
| Update Operational Status
|--------------------------------------------------------------------------
*/

export async function updateOperationalStatus(req, res) {

    try {

        const site = await siteService.updateOperationalStatus(

            req.params.id,

            req.body.status

        );

        return res.status(200).json({

            success: true,

            message: "Operational status updated.",

            data: site

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
| Site Health Summary
|--------------------------------------------------------------------------
*/

export async function siteHealthSummary(req, res) {

    try {

        const summary = await siteService.getSiteHealthSummary(

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
| Site Dashboard
|--------------------------------------------------------------------------
*/

export async function siteDashboard(req, res) {

    try {

        const dashboard = await siteService.getSiteDashboard(
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
| Site Telemetry Summary
|--------------------------------------------------------------------------
*/

export async function telemetrySummary(req, res) {

    try {

        const summary =
            await telemetryService.getTelemetrySummary(
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
| Site Energy Summary
|--------------------------------------------------------------------------
*/

export async function energySummary(req, res) {

    try {

        const energy =
            await statisticsService.getEnergyStatistics(
                req.params.id
            );

        return res.status(200).json({

            success: true,

            data: energy

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
| Site Alarm Summary
|--------------------------------------------------------------------------
*/

export async function alarmSummary(req, res) {

    try {

        const alarms =
            await siteService.getAlarmSummary(
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
| Site Installation Summary
|--------------------------------------------------------------------------
*/

export async function installationSummary(req, res) {

    try {

        const installations =
            await siteService.getInstallationSummary(
                req.params.id
            );

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
| Site Reliability Summary
|--------------------------------------------------------------------------
*/

export async function reliabilitySummary(req, res) {

    try {

        const report =
            await reliabilityService.generateReliabilityMetrics(
                req.params.id
            );

        return res.status(200).json({

            success: true,

            data: report

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
| Site Availability
|--------------------------------------------------------------------------
*/

export async function siteAvailability(req, res) {

    try {

        const availability =
            await reliabilityService.calculateAvailability(
                req.params.id
            );

        return res.status(200).json({

            success: true,

            data: availability

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
| Site Performance KPIs
|--------------------------------------------------------------------------
*/

export async function siteKPIs(req, res) {

    try {

        const kpis =
            await statisticsService.getSiteKPIs(
                req.params.id
            );

        return res.status(200).json({

            success: true,

            data: kpis

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
| Export Sites
|--------------------------------------------------------------------------
*/

export async function exportSites(req, res) {

    try {

        const result = await siteService.exportSites({

            format: req.query.format || "json",

            status: req.query.status,

            region: req.query.region

        });

        return res.status(200).json({

            success: true,

            message: "Sites exported successfully.",

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
| Import Sites
|--------------------------------------------------------------------------
*/

export async function importSites(req, res) {

    try {

        const result = await siteService.importSites(

            req.body.sites

        );

        return res.status(201).json({

            success: true,

            message: "Sites imported successfully.",

            data: result

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
| Archive Site
|--------------------------------------------------------------------------
*/

export async function archiveSite(req, res) {

    try {

        const site = await siteService.archiveSite(

            req.params.id

        );

        return res.status(200).json({

            success: true,

            message: "Site archived successfully.",

            data: site

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
| Restore Archived Site
|--------------------------------------------------------------------------
*/

export async function restoreSite(req, res) {

    try {

        const site = await siteService.restoreSite(

            req.params.id

        );

        return res.status(200).json({

            success: true,

            message: "Site restored successfully.",

            data: site

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
| Overall System Dashboard
|--------------------------------------------------------------------------
*/

export async function systemDashboard(req, res) {

    try {

        const dashboard = await siteService.getSystemDashboard();

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
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    createSite,

    getSites,

    getSiteById,

    updateSite,

    deleteSite,

    searchSites,

    assignEngineer,

    removeEngineer,

    activateSite,

    deactivateSite,

    updateCoordinates,

    updateOperationalStatus,

    siteHealthSummary,

    siteDashboard,

    telemetrySummary,

    energySummary,

    alarmSummary,

    installationSummary,

    reliabilitySummary,

    siteAvailability,

    siteKPIs,

    exportSites,

    importSites,

    archiveSite,

    restoreSite,

    systemDashboard

};