import { Router } from "express";


import {

    createGenerator,

    getGenerators,

    getGenerator,

    updateGenerator,

    deleteGenerator
    
} from "../controllers/generatorController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Generator CRUD
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authenticate,
    authorize("ADMIN", "ENGINEER"),
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
    authorize("ADMIN", "ENGINEER"),
    updateGenerator
);

router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    deleteGenerator
);

export default router;