import { Router } from "express";

import userController from "../controllers/userController.js";

import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {

    createUserSchema,

    updateUserSchema,

    updateProfileSchema,

    assignRoleSchema,

    statusSchema,

    userIdSchema,

    paginationSchema

} from "../validators/userValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| User Management
|--------------------------------------------------------------------------
*/

router.get(

    "/",

    authenticate,

    authorize("admin"),

    validate({

        query: paginationSchema

    }),

    userController.getUsers

);

router.get(

    "/:userId",

    authenticate,

    validate({

        params: userIdSchema

    }),

    userController.getUserById

);

router.post(

    "/",

    authenticate,

    authorize("admin"),

    validate({

        body: createUserSchema

    }),

    userController.createUser

);

router.put(

    "/:userId",

    authenticate,

    validate({

        params: userIdSchema,

        body: updateUserSchema

    }),

    userController.updateUser

);

router.delete(

    "/:userId",

    authenticate,

    authorize("admin"),

    validate({

        params: userIdSchema

    }),

    userController.deleteUser

);

/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

router.get(

    "/profile/me",

    authenticate,

    userController.getProfile

);

router.patch(
    "/:userId/status",
    authenticate,
    authorize("admin"),
    validate({
        params: userIdSchema,
        body: statusSchema
    }),
    userController.updateStatus
);

/*
|--------------------------------------------------------------------------
| Role Assignment
|--------------------------------------------------------------------------
*/

router.patch(

    "/:userId/role",

    authenticate,

    authorize("admin"),

    validate({

        params: userIdSchema,

        body: assignRoleSchema

    }),

    userController.assignRole

);

/*
|--------------------------------------------------------------------------
| Activate / Deactivate User
|--------------------------------------------------------------------------
*/

router.patch(

    "/:userId/status",

    authenticate,

    authorize("admin"),

    validate({

        params: userIdSchema,

        body: statusSchema

    }),

    userController.updateStatus

);

export default router;