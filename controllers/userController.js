import asyncHandler from "../utils/asyncHandler.js";

import * as userService from "../services/users/userService.js";

import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Get All Users
|--------------------------------------------------------------------------
*/

export const getUsers = asyncHandler(async (req, res) => {

    const users = await userService.getUsers(

        req.query

    );

    return res.status(200).json({

        success: true,

        message: "Users retrieved successfully.",

        data: users

    });

});

/*
|--------------------------------------------------------------------------
| Get User
|--------------------------------------------------------------------------
*/

export const getUser = asyncHandler(async (req, res) => {

    const user = await userService.getUser(

        req.params.id

    );

    return res.status(200).json({

        success: true,

        message: "User retrieved successfully.",

        data: user

    });

});

/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/

export const createUser = asyncHandler(async (req, res) => {

    const user = await userService.createUser(

        req.body,

        req.user

    );

    logger.info({

        message: "User created.",

        userId: user._id,

        email: user.email

    });

    return res.status(201).json({

        success: true,

        message: "User created successfully.",

        data: user

    });

});

/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/

export const updateUser = asyncHandler(async (req, res) => {

    const user = await userService.updateUser(

        req.params.id,

        req.body,

        req.user

    );

    logger.info({

        message: "User updated.",

        userId: user._id

    });

    return res.status(200).json({

        success: true,

        message: "User updated successfully.",

        data: user

    });

});

/*
|--------------------------------------------------------------------------
| Delete User
|--------------------------------------------------------------------------
*/

export const deleteUser = asyncHandler(async (req, res) => {

    await userService.deleteUser(

        req.params.id,

        req.user

    );

    logger.info({

        message: "User deleted.",

        userId: req.params.id

    });

    return res.status(200).json({

        success: true,

        message: "User deleted successfully."

    });

});

/*
|--------------------------------------------------------------------------
| Activate User
|--------------------------------------------------------------------------
*/

export const activateUser = asyncHandler(async (req, res) => {

    const user = await userService.activateUser(

        req.params.id,

        req.user

    );

    return res.status(200).json({

        success: true,

        message: "User activated successfully.",

        data: user

    });

});

/*
|--------------------------------------------------------------------------
| Deactivate User
|--------------------------------------------------------------------------
*/

export const deactivateUser = asyncHandler(async (req, res) => {

    const user = await userService.deactivateUser(

        req.params.id,

        req.user

    );

    return res.status(200).json({

        success: true,

        message: "User deactivated successfully.",

        data: user

    });

});

export default {

    getUsers,

    getUser,

    createUser,

    updateUser,

    activateUser,

    deactivateUser,

    deleteUser

};