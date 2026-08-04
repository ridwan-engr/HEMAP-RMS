import { Router } from "express";

import roleController from "../controllers/roleController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {
    createRoleValidator,
    updateRoleValidator,
    roleIdValidator,
    roleQueryValidator
} from "../validators/roleValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Get All Roles
|--------------------------------------------------------------------------
*/

router.get(

    "/",

    authorize("ADMIN"),

    validate({
        query: roleQueryValidator
    }),

    roleController.getRoles
);

/*
|--------------------------------------------------------------------------
| Get Single Role
|--------------------------------------------------------------------------
*/

router.get(

    "/:id",

    authorize("ADMIN"),

    validate({

        params: roleIdValidator

    }),

    roleController.getRole

);

/*
|--------------------------------------------------------------------------
| Create Role
|--------------------------------------------------------------------------
*/

router.post(

    "/",

    authorize("ADMIN"),
    
    validate({
        body: createRoleValidator
    }),
    roleController.createRole
);

/*
|--------------------------------------------------------------------------
| Update Role
|--------------------------------------------------------------------------
*/

router.put(

    "/:id",

    authorize("ADMIN"),
    validate({
        params: roleIdValidator,
        body: updateRoleValidator
    }),
    roleController.updateRole
);

/*
|--------------------------------------------------------------------------
| Delete Role
|--------------------------------------------------------------------------
*/

router.delete(

    "/:id",

    authorize("ADMIN"),
    validate({
        params: roleIdValidator
    }),
    roleController.deleteRole
);

export default router;