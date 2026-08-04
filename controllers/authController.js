import asyncHandler from "express-async-handler";

import authService from "../services/auth/authService.js";
import tokenService from "../services/auth/tokenService.js";

import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

export const register = asyncHandler(async (req, res) => {

    const user = await authService.register(req.body);

    logger.info({

        message: "User registered successfully.",

        email: user.email

    });

    return res.status(201).json({

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

    logger.info({

        message: "User logged in.",

        email

    });

    return res.status(200).json({

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

    const refreshTokenValue = req.body?.refreshToken;

    if (!refreshTokenValue) {

        return res.status(400).json({

            success: false,

            message: "Refresh token is required."

        });

    }

    const payload = tokenService.verifyToken(

        refreshTokenValue

    );

    const accessToken = await authService.refresh(payload);

    return res.status(200).json({

        success: true,

        message: "Token refreshed successfully.",

        data: {

            accessToken

        }

    });

});

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

export const getCurrentUser = asyncHandler(async (req, res) => {

    const user = await authService.me(

        req.user._id

    );

    return res.status(200).json({

        success: true,

        message: "Current user retrieved successfully.",

        data: user

    });

});

/*
|--------------------------------------------------------------------------
| Forgot Password
|--------------------------------------------------------------------------
*/

export const forgotPassword = asyncHandler(async (req, res) => {

    await authService.forgotPassword(req.body.email);

    return res.status(200).json({

        success: true,

        message: "Password reset instructions sent."

    });

});

/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
*/

export const resetPassword = asyncHandler(async (req, res) => {

    await authService.resetPassword(

        req.body.token,

        req.body.password

    );

    return res.status(200).json({

        success: true,

        message: "Password reset successfully."

    });

});

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export const logout = asyncHandler(async (req, res) => {

    await authService.logout(req.user);

    return res.status(200).json({

        success: true,

        message: "Logged out successfully."

    });

});

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

export const changePassword = asyncHandler(async (req, res) => {

    await authService.changePassword(

        req.user,

        req.body

    );

    return res.status(200).json({

        success: true,

        message: "Password changed successfully."

    });

});

/*
|--------------------------------------------------------------------------
| Active Sessions
|--------------------------------------------------------------------------
*/

export const getActiveSessions = asyncHandler(async (req, res) => {

    const sessions = await authService.getActiveSessions(

        req.user

    );

    return res.status(200).json({

        success: true,

        message: "Sessions retrieved successfully.",

        data: sessions

    });

});

/*
|--------------------------------------------------------------------------
| Revoke Session
|--------------------------------------------------------------------------
*/

export const revokeSession = asyncHandler(async (req, res) => {

    await authService.revokeSession(

        req.user,

        req.params.sessionId

    );

    return res.status(200).json({

        success: true,

        message: "Session revoked successfully."

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