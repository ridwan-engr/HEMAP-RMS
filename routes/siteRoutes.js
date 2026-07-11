import { Router } from "express";

import siteController from "../controllers/siteController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {

    createSiteSchema,

    updateSiteSchema,

    siteQuerySchema,

    assignEngineerSchema,

    coordinateSchema,

    operationalStatusSchema,

    siteIdSchema

} from "../validators/siteValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| CRUD
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authenticate,
    authorize("admin"),
    validate({ body: createSiteSchema }),
    siteController.createSite
);

router.get(
    "/",
    authenticate,
    validate({ query: siteQuerySchema }),
    siteController.getSites
);

router.get(
    "/:siteId",
    authenticate,
    validate({ params: siteIdSchema }),
    siteController.getSiteById
);

router.put(
    "/:siteId",
    authenticate,
    authorize("admin"),
    validate({
        params: siteIdSchema,
        body: updateSiteSchema
    }),
    siteController.updateSite
);

router.delete(
    "/:siteId",
    authenticate,
    authorize("admin"),
    validate({ params: siteIdSchema }),
    siteController.deleteSite
);

/*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
*/

router.get(
    "/search/query",
    authenticate,
    validate({ query: siteQuerySchema }),
    siteController.searchSites
);

/*
|--------------------------------------------------------------------------
| Engineer Assignment
|--------------------------------------------------------------------------
*/

router.post(
    "/:siteId/engineer",
    authenticate,
    authorize("admin"),
    validate({
        params: siteIdSchema,
        body: assignEngineerSchema
    }),
    siteController.assignEngineer
);

router.delete(
    "/:siteId/engineer",
    authenticate,
    authorize("admin"),
    validate({ params: siteIdSchema }),
    siteController.removeEngineer
);

/*
|--------------------------------------------------------------------------
| Status
|--------------------------------------------------------------------------
*/

router.patch(
    "/:siteId/activate",
    authenticate,
    authorize("admin"),
    validate({ params: siteIdSchema }),
    siteController.activateSite
);

router.patch(
    "/:siteId/deactivate",
    authenticate,
    authorize("admin"),
    validate({ params: siteIdSchema }),
    siteController.deactivateSite
);

router.patch(
    "/:siteId/coordinates",
    authenticate,
    authorize("admin"),
    validate({
        params: siteIdSchema,
        body: coordinateSchema
    }),
    siteController.updateCoordinates
);

router.patch(
    "/:siteId/status",
    authenticate,
    authorize("admin"),
    validate({
        params: siteIdSchema,
        body: operationalStatusSchema
    }),
    siteController.updateOperationalStatus
);

/*
|--------------------------------------------------------------------------
| Dashboard & Analytics
|--------------------------------------------------------------------------
*/

router.get(
    "/:siteId/dashboard",
    authenticate,
    validate({ params: siteIdSchema }),
    siteController.siteDashboard
);

router.get(
    "/:siteId/health",
    authenticate,
    validate({ params: siteIdSchema }),
    siteController.siteHealthSummary
);

router.get(
    "/:siteId/telemetry",
    authenticate,
    validate({ params: siteIdSchema }),
    siteController.telemetrySummary
);

router.get(
    "/:siteId/energy",
    authenticate,
    validate({ params: siteIdSchema }),
    siteController.energySummary
);

router.get(
    "/:siteId/alarms",
    authenticate,
    validate({ params: siteIdSchema }),
    siteController.alarmSummary
);

router.get(
    "/:siteId/installations",
    authenticate,
    validate({ params: siteIdSchema }),
    siteController.installationSummary
);

router.get(
    "/:siteId/reliability",
    authenticate,
    validate({ params: siteIdSchema }),
    siteController.reliabilitySummary
);

router.get(
    "/:siteId/availability",
    authenticate,
    validate({ params: siteIdSchema }),
    siteController.siteAvailability
);

router.get(
    "/:siteId/kpis",
    authenticate,
    validate({ params: siteIdSchema }),
    siteController.siteKPIs
);

/*
|--------------------------------------------------------------------------
| Import / Export
|--------------------------------------------------------------------------
*/

router.get(
    "/export/all",
    authenticate,
    authorize("admin"),
    siteController.exportSites
);

router.post(
    "/import",
    authenticate,
    authorize("admin"),
    siteController.importSites
);

/*
|--------------------------------------------------------------------------
| Archive
|--------------------------------------------------------------------------
*/

router.patch(
    "/:siteId/archive",
    authenticate,
    authorize("admin"),
    validate({ params: siteIdSchema }),
    siteController.archiveSite
);

router.patch(
    "/:siteId/restore",
    authenticate,
    authorize("admin"),
    validate({ params: siteIdSchema }),
    siteController.restoreSite
);

/*
|--------------------------------------------------------------------------
| Global Dashboard
|--------------------------------------------------------------------------
*/

router.get(
    "/dashboard/system",
    authenticate,
    authorize("admin"),
    siteController.systemDashboard
);

export default router;