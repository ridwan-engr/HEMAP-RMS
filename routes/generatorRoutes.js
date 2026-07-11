import { Router } from "express";

import {authenticate} from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

import {

    createGenerator,

    getGenerators,

    getGenerator,

    updateGenerator,

    deleteGenerator

    //getGeneratorBySite

} from "../controllers/generatorController.js";

const router = Router();

/*router.get(
|   "/site/:siteId",
|    authenticate,
|    getGeneratorBySite
);*/

router.post(
    "/",
    authenticate,
    authorize("Administrator", "Engineer"),
    createGenerator
);

router.get(
    "/",
    authenticate,
    getGenerators
);

router.get(
    "/:id",
    authenticate,
    getGenerator
);

router.put(
    "/:id",
    authenticate,
    authorize("Administrator", "Engineer"),
    updateGenerator
);

router.delete(
    "/:id",
    authenticate,
    authorize("Administrator"),
    deleteGenerator
);

export default router;