import asyncHandler from "../utils/asyncHandler.js";
import * as roleService from "../services/users/roleService.js";

/*
|--------------------------------------------------------------------------
| Get Roles
|--------------------------------------------------------------------------
*/

export const getRoles = asyncHandler(async (req, res) => {

    const roles = await roleService.getRoles(req.query);

    return res.status(200).json({

        success: true,

        message: "Roles retrieved successfully.",

        data: roles

    });

});

/*
|--------------------------------------------------------------------------
| Get Role
|--------------------------------------------------------------------------
*/

export const getRole = asyncHandler(async (req, res) => {

    const role = await roleService.getRole(req.params.id);

    return res.status(200).json({

        success: true,

        message: "Role retrieved successfully.",

        data: role

    });

});

/*
|--------------------------------------------------------------------------
| Create Role
|--------------------------------------------------------------------------
*/

export const createRole = asyncHandler(async (req, res) => {

    const role = await roleService.createRole(req.body);

    return res.status(201).json({

        success: true,

        message: "Role created successfully.",

        data: role

    });

});

/*
|--------------------------------------------------------------------------
| Update Role
|--------------------------------------------------------------------------
*/

export const updateRole = asyncHandler(async (req, res) => {

    const role = await roleService.updateRole(

        req.params.id,

        req.body

    );

    return res.status(200).json({

        success: true,

        message: "Role updated successfully.",

        data: role

    });

});

/*
|--------------------------------------------------------------------------
| Delete Role
|--------------------------------------------------------------------------
*/

export const deleteRole = asyncHandler(async (req, res) => {

    await roleService.deleteRole(req.params.id);

    return res.status(200).json({

        success: true,

        message: "Role deleted successfully."

    });

});

export default {

    getRoles,

    getRole,

    createRole,

    updateRole,

    deleteRole

};