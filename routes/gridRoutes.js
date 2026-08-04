import { Router } from "express";


import {

    createGrid,

    getGrids,

    getGrid,

    updateGrid,

    deleteGrid
    
} from "../controllers/gridController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| All Grid Routes Require Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Get All Grids
|--------------------------------------------------------------------------
*/

router.get(
    "/",

    getGrids
);

/*
|--------------------------------------------------------------------------
| Get Grid By ID
|--------------------------------------------------------------------------
*/

router.get(
    "/:id",

    getGrid
);

/*
|--------------------------------------------------------------------------
| Create Grid
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authorize(
        "ADMIN",
        "ENGINEER"
    ),
    createGrid
);

/*
|--------------------------------------------------------------------------
| Update Grid
|--------------------------------------------------------------------------
*/

router.put(
    "/:id",
    authorize(
        "ADMIN",
        "ENGINEER"
    ),
    updateGrid
);

/*
|--------------------------------------------------------------------------
| Delete Grid
|--------------------------------------------------------------------------
*/

router.delete(
    "/:id",

    authorize("ADMIN"),
    deleteGrid
);

export default router;