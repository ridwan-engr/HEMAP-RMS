import express from "express";

import * as installationController from "../controllers/installationController.js";

import authenticate from "../middlewares/auth.js";

import authorize from "../middlewares/authorize.js";

import validate from "../middlewares/validate.js";

import {

    installationIdValidator,

    installationQueryValidator,

    createInstallationValidator,

    updateInstallationValidator

} from "../validators/installationValidator.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| All Installation Routes Require Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Installation Routes
|--------------------------------------------------------------------------
*/

/*
| GET /api/installations
*/

router.get(

    "/",

    validate(installationQueryValidator, "query"),

    installationController.getInstallations

);

/*
| GET /api/installations/:id
*/

router.get(

    "/:id",

    validate(installationIdValidator, "params"),

    installationController.getInstallation

);

/*
| POST /api/installations
*/

router.post(

    "/",

    authorize("ADMIN", "ENGINEER"),

    validate(createInstallationValidator),

    installationController.createInstallation

);

/*
| PUT /api/installations/:id
*/

router.put(

    "/:id",

    authorize("ADMIN", "ENGINEER"),

    validate(installationIdValidator, "params"),

    validate(updateInstallationValidator),

    installationController.updateInstallation

);

/*
| DELETE /api/installations/:id
*/

router.delete(

    "/:id",

    authorize("ADMIN"),

    validate(installationIdValidator, "params"),

    installationController.deleteInstallation

);

/*
|--------------------------------------------------------------------------
| Synchronization
|--------------------------------------------------------------------------
*/

/*
| POST /api/installations/:id/synchronize
*/

router.post(

    "/:id/synchronize",

    authorize("ADMIN", "ENGINEER"),

    validate(installationIdValidator, "params"),

    installationController.synchronizeInstallation

);

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

/*
| GET /api/installations/:id/statistics
*/

router.get(

    "/:id/statistics",

    validate(installationIdValidator, "params"),

    installationController.getInstallationStatistics

);

export default router;