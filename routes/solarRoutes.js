import { Router } from "express";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";

import {

    createSolar,

    getSolars,

    getSolarSystems,

    getSolar,

    updateSolar,

    deleteSolar,

    getSolarBySite
    
} from "../controllers/solarController.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Site Solar Assets
|--------------------------------------------------------------------------
|
| Controller currently expects req.body.siteId.
|
*/

router.post(
    "/site",
    getSolarBySite
);

/*
|--------------------------------------------------------------------------
| Solar Assets
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    getSolars
);

/*
|--------------------------------------------------------------------------
| Solar Summary
|--------------------------------------------------------------------------
*/

router.post(
    "/summary",
    getSolarSystems
);

/*
|--------------------------------------------------------------------------
| Get Solar Asset
|--------------------------------------------------------------------------
*/

router.post(
    "/details",
    getSolar
);

/*
|--------------------------------------------------------------------------
| Create Solar Asset
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authorize("ADMIN", "ENGINEER"),
    createSolar
);

/*
|--------------------------------------------------------------------------
| Update Solar Asset
|--------------------------------------------------------------------------
*/

router.put(
    "/",
    authorize("ADMIN", "ENGINEER"),
    updateSolar
);

/*
|--------------------------------------------------------------------------
| Delete Solar Asset
|--------------------------------------------------------------------------
*/

router.delete(
    "/",
    authorize("ADMIN"),
    deleteSolar
);

export default router;