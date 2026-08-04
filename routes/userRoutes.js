import { Router } from "express";

import userController from "../controllers/userController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {

    createUserSchema,

    updateUserSchema,

    userQuerySchema,

    userIdSchema
    
} from "../validators/userValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Get All Users
|--------------------------------------------------------------------------
*/

router.get(

    "/",

    authorize("ADMIN"),

    validate({

        query: userQuerySchema

    }),

    userController.getUsers

);

/*
|--------------------------------------------------------------------------
| Get User By ID
|--------------------------------------------------------------------------
*/

router.get(

    "/:id",

    authorize("ADMIN"),

    validate({

        params: userIdSchema

    }),

    userController.getUser

);

/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/

router.post(

    "/",

    authorize("ADMIN"),

    validate({

        body: createUserSchema

    }),

    userController.createUser

);

/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/

router.put(

    "/:id",

    authorize("ADMIN"),

    validate({

        params: userIdSchema,

        body: updateUserSchema

    }),

    userController.updateUser

);

/*
|--------------------------------------------------------------------------
| Activate User
|--------------------------------------------------------------------------
*/


router.patch(

    "/:id/activate",

    authorize("ADMIN"),

    validate({

        params: userIdSchema

    }),

    userController.activateUser

);

/*
|--------------------------------------------------------------------------
| Deactivate User
|--------------------------------------------------------------------------
*/

router.patch(

    "/:id/deactivate",

    authorize("ADMIN"),

    validate({

        params: userIdSchema

    }),

    userController.deactivateUser

);

/*
|--------------------------------------------------------------------------
| Delete User
|--------------------------------------------------------------------------
*/

router.delete(

    "/:id",

    authorize("ADMIN"),

    validate({

        params: userIdSchema

    }),

    userController.deleteUser

);

export default router;