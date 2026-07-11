import asyncHandler from "express-async-handler";

import authService from "../services/auth/authService.js";

import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

export const register = asyncHandler(async (req, res) => {

    const user = await authService.register(req.body);

    res.status(201).json({

        success: true,

        message: "User registered successfully.",

        data: user

    });

});

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export const login = asyncHandler(async (req, res) => {

    const {

        email,

        password

    } = req.body;

    const result = await authService.login(

        email,

        password

    );

    res.json({

        success: true,

        message: "Login successful.",

        data: result

    });

});

/*
|--------------------------------------------------------------------------
| Refresh Token
|--------------------------------------------------------------------------
*/

export const refreshToken = asyncHandler(async (req, res) => {

    const token = await authService.refresh(

        req.user

    );

    res.json({

        success: true,

        accessToken: token

    });

});

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

export const getCurrentUser = asyncHandler(async (req, res) => {

    const user = await authService.me(

        req.user.id

    );

    res.json({

        success: true,

        data: user

    });

});

/*
|--------------------------------------------------------------------------
| Placeholder Methods
|--------------------------------------------------------------------------
*/

export const forgotPassword = asyncHandler(async (req, res) => {

    res.status(501).json({

        success: false,

        message: "Forgot password not implemented."

    });

});

export const resetPassword = asyncHandler(async (req, res) => {

    res.status(501).json({

        success: false,

        message: "Reset password not implemented."

    });

});

export const logout = asyncHandler(async (req, res) => {

    res.json({

        success: true,

        message: "Logged out successfully."

    });

});

export const changePassword = asyncHandler(async (req, res) => {

    res.status(501).json({

        success: false,

        message: "Change password not implemented."

    });

});

export const getActiveSessions = asyncHandler(async (req, res) => {

    res.status(501).json({

        success: false,

        message: "Session management not implemented."

    });

});

export const revokeSession = asyncHandler(async (req, res) => {

    res.status(501).json({

        success: false,

        message: "Session revocation not implemented."

    });

});

export default {

    register,

    login,

    refreshToken,

    forgotPassword,

    resetPassword,

    logout,

    getCurrentUser,

    changePassword,

    getActiveSessions,

    revokeSession

};