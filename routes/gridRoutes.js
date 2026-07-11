import { Router } from "express";

import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

import {

    createGrid,

    getGrids,

    getGrid,

    updateGrid,

    deleteGrid

    //getGridBySite

} from "../controllers/gridController.js";

const router = Router();

/*router.get(
    "/site/:siteId",
    authenticate,
    getGridBySite
);*/

router.post(
    "/",
    authenticate,
    authorize("Administrator", "Engineer"),
    createGrid
);

router.get(
    "/",
    authenticate,
    getGrids
);

router.get(
    "/:id",
    authenticate,
    getGrid
);

router.put(
    "/:id",
    authenticate,
    authorize("Administrator", "Engineer"),
    updateGrid
);

router.delete(
    "/:id",
    authenticate,
    authorize("Administrator"),
    deleteGrid
);

export default router;