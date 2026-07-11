import { Router } from "express";

import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

import {
    createFault,
    getFaults,
    getFaultById,
    getFaultsBySite,
    //acknowledgeFault,
    updateFault,
    deleteFault
} from "../controllers/faultController.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Site Faults
|--------------------------------------------------------------------------
*/

router.get(
    "/site/:siteId",
    authenticate,
    getFaultsBySite
);

/*
|--------------------------------------------------------------------------
| CRUD
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authenticate,
    authorize("Administrator", "Engineer"),
    createFault
);

router.get(
    "/",
    authenticate,
    getFaults
);

router.get(
    "/:id",
    authenticate,
    getFaultById
);

/*router.patch(
    "/:id/acknowledge",
    authenticate,
    authorize("Administrator", "Engineer"),
    acknowledgeFault
);*/

router.patch(
    "/:id/resolve",
    authenticate,
    authorize("Administrator", "Engineer"),
    updateFault
);

router.delete(
    "/:id",
    authenticate,
    authorize("Administrator"),
    deleteFault
);

export default router;