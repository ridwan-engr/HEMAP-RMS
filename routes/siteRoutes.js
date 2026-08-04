import { Router } from "express";

import siteController from "../controllers/siteController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {
    siteIdValidator,
    siteQueryValidator,
    createSiteValidator,
    updateSiteValidator
} from "../validators/siteValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Get All Sites
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    validate({
        query: siteQueryValidator
    }),
    siteController.getSites
);

/*
|--------------------------------------------------------------------------
| Get Site By ID
|--------------------------------------------------------------------------
*/

router.get(
    "/:id",
    validate({
        params: siteIdValidator
    }),
    siteController.getSite
);

/*
|--------------------------------------------------------------------------
| Create Site
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authorize("ADMIN"),
    validate({
        body: createSiteValidator
    }),
    siteController.createSite
);

/*
|--------------------------------------------------------------------------
| Update Site
|--------------------------------------------------------------------------
*/

router.put(
    "/:id",
    authorize("ADMIN"),
    validate({
        params: siteIdValidator,
        body: updateSiteValidator
    }),
    siteController.updateSite
);

/*
|--------------------------------------------------------------------------
| Activate Site
|--------------------------------------------------------------------------
*/

router.patch(
    "/:id/activate",
    authorize("ADMIN"),
    validate({
        params: siteIdValidator
    }),
    siteController.activateSite
);

/*
|--------------------------------------------------------------------------
| Deactivate Site
|--------------------------------------------------------------------------
*/

router.patch(
    "/:id/deactivate",
    authorize("ADMIN"),
    validate({
        params: siteIdValidator
    }),
    siteController.deactivateSite
);

/*
|--------------------------------------------------------------------------
| Delete Site
|--------------------------------------------------------------------------
*/

router.delete(

    "/:id",

    authorize("ADMIN"),

    validate({

        params: siteIdValidator

    }),

    siteController.deleteSite
    
);

export default router;