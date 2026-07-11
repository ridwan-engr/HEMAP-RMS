import { Router } from "express";

import * as authController from "../controllers/authController.js";

// Middleware
import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

// Validation
import {

    loginValidator,

    registerValidator,

    forgotPasswordValidator,

    resetPasswordValidator,

    changePasswordValidator

} from "../validators/authValidator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.post(
    "/register",
    validate(registerValidator),
    authController.register
);

router.post(
    "/login",
    validate(loginValidator),
    authController.login
);

router.post(
    "/refresh-token",
    authController.refreshToken
);

router.post(
    "/forgot-password",
    validate(forgotPasswordValidator),
    authController.forgotPassword
);

router.post(
    "/reset-password",
    validate(resetPasswordValidator),
    authController.resetPassword
);
/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

// Logout
router.post(
    "/logout",
    authenticate,
    authController.logout
);

// Current User
router.get(
    "/me",
    authenticate,
    authController.getCurrentUser
);

// Change Password
router.put(
    "/change-password",
    authenticate,
    validate(changePasswordValidator),
    authController.changePassword
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

// Get Active Sessions
router.get(
    "/sessions",
    authenticate,
    authorize("admin"),
    authController.getActiveSessions
);

// Revoke Session
router.delete(
    "/sessions/:sessionId",
    authenticate,
    authorize("admin"),
    authController.revokeSession
);

export default router;