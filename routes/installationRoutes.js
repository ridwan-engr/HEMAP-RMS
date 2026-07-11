import { Router } from "express";

import installationController from "../controllers/installationController.js";

import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {

    createInstallationSchema,

    updateInstallationSchema,

    installationIdSchema,

    installationQuerySchema,

    installationStatusSchema

} from "../validators/installationValidator.js";

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
    validate({
        body: createInstallationSchema
    }),
    installationController.createInstallation
);

router.get(
    "/",
    authenticate,
    validate({
        query: installationQuerySchema
    }),
    installationController.getInstallations
);

router.get(
    "/:installationId",
    authenticate,
    validate({
        params: installationIdSchema
    }),
    installationController.getInstallation
);

router.put(
    "/:installationId",
    authenticate,
    authorize("admin"),
    validate({
        params: installationIdSchema,
        body: updateInstallationSchema
    }),
    installationController.updateInstallation
);

router.delete(
    "/:installationId",
    authenticate,
    authorize("admin"),
    validate({
        params: installationIdSchema
    }),
    installationController.deleteInstallation
);

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

router.patch(
    "/:installationId/site",
    authenticate,
    authorize("admin"),
    validate({
        params: installationIdSchema
    }),
    installationController.assignToSite
);

router.patch(
    "/:installationId/commission",
    authenticate,
    authorize("admin"),
    validate({
        params: installationIdSchema
    }),
    installationController.commissionInstallation
);

router.patch(
    "/:installationId/decommission",
    authenticate,
    authorize("admin"),
    validate({
        params: installationIdSchema
    }),
    installationController.decommissionInstallation
);

/*
|--------------------------------------------------------------------------
| Assets Registration
|--------------------------------------------------------------------------
*/

router.post(
    "/:installationId/solar",
    authenticate,
    authorize("admin"),
    validate({
        params: installationIdSchema
    }),
    installationController.registerSolarArray
);

router.post(
    "/:installationId/battery",
    authenticate,
    authorize("admin"),
    validate({
        params: installationIdSchema
    }),
    installationController.registerBatteryBank
);

router.post(
    "/:installationId/generator",
    authenticate,
    authorize("admin"),
    validate({
        params: installationIdSchema
    }),
    installationController.registerGenerator
);

router.post(
    "/:installationId/grid",
    authenticate,
    authorize("admin"),
    validate({
        params: installationIdSchema
    }),
    installationController.registerGrid
);

router.post(
    "/:installationId/victron",
    authenticate,
    authorize("admin"),
    validate({
        params: installationIdSchema
    }),
    installationController.registerVictronGX
);

router.post(
    "/:installationId/huawei",
    authenticate,
    authorize("admin"),
    validate({
        params: installationIdSchema
    }),
    installationController.registerHuaweiRectifier
);

router.post(
    "/:installationId/smart-meter",
    authenticate,
    authorize("admin"),
    validate({
        params: installationIdSchema
    }),
    installationController.registerSmartMeter
);

/*
|--------------------------------------------------------------------------
| Monitoring
|--------------------------------------------------------------------------
*/

router.get(
    "/:installationId/dashboard",
    authenticate,
    validate({
        params: installationIdSchema
    }),
    installationController.installationDashboard
);

router.get(
    "/:installationId/health",
    authenticate,
    validate({
        params: installationIdSchema
    }),
    installationController.installationHealth
);

router.get(
    "/:installationId/configuration",
    authenticate,
    validate({
        params: installationIdSchema
    }),
    installationController.configurationSummary
);

router.get(
    "/:installationId/assets",
    authenticate,
    validate({
        params: installationIdSchema
    }),
    installationController.assetInventory
);

router.get(
    "/:installationId/energy",
    authenticate,
    validate({
        params: installationIdSchema
    }),
    installationController.energyConfiguration
);

router.get(
    "/:installationId/communication",
    authenticate,
    validate({
        params: installationIdSchema
    }),
    installationController.communicationStatus
);

router.get(
    "/:installationId/alarms",
    authenticate,
    validate({
        params: installationIdSchema
    }),
    installationController.installationAlarms
);

router.get(
    "/:installationId/performance",
    authenticate,
    validate({
        params: installationIdSchema
    }),
    installationController.installationPerformance
);

router.get(
    "/:installationId/reliability",
    authenticate,
    validate({
        params: installationIdSchema
    }),
    installationController.installationReliability
);

/*
|--------------------------------------------------------------------------
| Administration
|--------------------------------------------------------------------------
*/

router.get(
    "/:installationId/export",
    authenticate,
    authorize("admin"),
    validate({
        params: installationIdSchema
    }),
    installationController.exportInstallation
);

router.post(
    "/:installationId/clone",
    authenticate,
    authorize("admin"),
    validate({
        params: installationIdSchema
    }),
    installationController.cloneInstallation
);

router.post(
    "/:installationId/validate",
    authenticate,
    authorize("admin"),
    validate({
        params: installationIdSchema
    }),
    installationController.validateInstallation
);

router.patch(
    "/:installationId/archive",
    authenticate,
    authorize("admin"),
    validate({
        params: installationIdSchema
    }),
    installationController.archiveInstallation
);

router.patch(
    "/:installationId/restore",
    authenticate,
    authorize("admin"),
    validate({
        params: installationIdSchema
    }),
    installationController.restoreInstallation
);

router.get(
    "/statistics",
    authenticate,
    authorize("admin"),
    installationController.installationStatistics
);

export default router;