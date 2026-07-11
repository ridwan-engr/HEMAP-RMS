import { Router } from "express";

import authenticate from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

import {

    createSolar,

    getSolarSystems,

    getSolar,

    updateSolar,

    deleteSolar,

    getSolarBySite

} from "../controllers/solarController.js";

const router = Router();

router.get(
    "/site/:siteId",
    authenticate,
    getSolarBySite
);

router.post(
    "/",
    authenticate,
    authorize("Administrator", "Engineer"),
    createSolar
);

router.get(
    "/",
    authenticate,
    getSolarSystems
);

router.get(
    "/:id",
    authenticate,
    getSolar
);

router.put(
    "/:id",
    authenticate,
    authorize("Administrator", "Engineer"),
    updateSolar
);

router.delete(
    "/:id",
    authenticate,
    authorize("Administrator"),
    deleteSolar
);

export default router;