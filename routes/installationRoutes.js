import { Router } from "express";

import installationController from "../controllers/installationController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {
    installationIdValidator,
    installationQueryValidator,
    createInstallationValidator,
    updateInstallationValidator
} from "../validators/installationValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Get Installations
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    validate({
        query: installationQueryValidator
    }),
    installationController.getInstallations
);

/*
|--------------------------------------------------------------------------
| Get Installation
|--------------------------------------------------------------------------
*/

router.get(
    "/:id",
    validate({
        params: installationIdValidator
    }),
    installationController.getInstallation
);

/*
|--------------------------------------------------------------------------
| Create Installation
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authorize("ADMIN"),
    validate({
        body: createInstallationValidator
    }),
    installationController.createInstallation
);

/*
|--------------------------------------------------------------------------
| Update Installation
|--------------------------------------------------------------------------
*/

router.put(
    "/:id",
    authorize("ADMIN"),
    validate({
        params: installationIdValidator,
        body: updateInstallationValidator
    }),
    installationController.updateInstallation
);

/*
|--------------------------------------------------------------------------
| Synchronize Installation
|--------------------------------------------------------------------------
*/

router.post(
    "/:id/synchronize",
    authorize("ADMIN"),
    validate({
        params: installationIdValidator
    }),
    installationController.synchronizeInstallation
);

/*
|--------------------------------------------------------------------------
| Installation Statistics
|--------------------------------------------------------------------------
*/

router.get(
    "/:id/statistics",
    validate({
        params: installationIdValidator
    }),
    installationController.getInstallationStatistics
);

/*
|--------------------------------------------------------------------------
| Delete Installation
|--------------------------------------------------------------------------
*/

router.delete(
    "/:id",
    authorize("ADMIN"),
    validate({
        params: installationIdValidator
    }),
    installationController.deleteInstallation
);

export default router;