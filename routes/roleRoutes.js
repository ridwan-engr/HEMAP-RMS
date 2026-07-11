import { Router } from "express";

import roleController from "../controllers/roleController.js";

import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {

    createRoleSchema,

    updateRoleSchema,

    permissionsSchema,

    roleIdSchema,

    roleQuerySchema

} from "../validators/roleValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Role Management
|--------------------------------------------------------------------------
*/

router.post(

    "/",

    authenticate,

    authorize("admin"),

    validate({

        body: createRoleSchema

    }),

    roleController.createRole

);

router.get(

    "/",

    authenticate,

    authorize("admin"),

    validate({

        query: roleQuerySchema

    }),

    roleController.getRoles

);

router.get(

    "/id/:id",

    authenticate,

    roleController.getRoleById

);

router.get(

    "/name/:name",

    authenticate,

    roleController.getRoleByName

);

router.put(

    "/:id",

    authenticate,

    authorize("admin"),

    validate({

        body: updateRoleSchema

    }),

    roleController.updateRole

);

router.delete(

    "/:id",

    authenticate,

    authorize("admin"),

    roleController.deleteRole

);

/*
|--------------------------------------------------------------------------
| Permissions
|--------------------------------------------------------------------------
*/

router.post(

    "/:id/permissions",

    authenticate,

    authorize("admin"),

    validate({

        body: permissionsSchema

    }),

    roleController.addPermissionToRole

);

router.delete(

    "/:id/permissions/:permissionId",

    authenticate,

    authorize("admin"),

    roleController.removePermissionFromRole

);

router.put(

    "/:id/permissions",

    authenticate,

    authorize("admin"),

    validate({

        body: permissionsSchema

    }),

    roleController.replacePermissions

);

/*
|--------------------------------------------------------------------------
| Permission Checks
|--------------------------------------------------------------------------
*/

router.get(

    "/:roleId/permissions/:permission",

    authenticate,

    roleController.checkRolePermission

);

router.get(

    "/users/:userId/permissions/:permission",

    authenticate,

    roleController.checkUserPermission

);

/*
|--------------------------------------------------------------------------
| Users
|--------------------------------------------------------------------------
*/

router.get(

    "/:roleId/users",

    authenticate,

    authorize("admin"),

    roleController.getUsersByRole

);

router.get(

    "/:roleId/users/count",

    authenticate,

    authorize("admin"),

    roleController.countUsersByRole

);

router.get(

    "/users/:userId/is-admin",

    authenticate,

    authorize("admin"),

    roleController.checkAdministrator

);

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

router.get(

    "/statistics",

    authenticate,

    authorize("admin"),

    roleController.roleStatistics

);

router.get(

    "/permissions/statistics",

    authenticate,

    authorize("admin"),

    roleController.permissionStatistics

);

router.get(

    "/rbac/status",

    authenticate,

    authorize("admin"),

    roleController.rbacStatus

);

/*
|--------------------------------------------------------------------------
| Initialization
|--------------------------------------------------------------------------
*/

router.post(

    "/initialize",

    authenticate,

    authorize("admin"),

    roleController.initializeRoles

);

router.post(

    "/initialize/permissions",

    authenticate,

    authorize("admin"),

    roleController.assignDefaultPermissions

);

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

router.get(

    "/exists/:name",

    authenticate,

    roleController.roleExists

);

export default router;