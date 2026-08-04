import { Router } from "express";

import * as authController from "../controllers/authController.js";

// Middleware
import authenticate from "../middlewares/auth.js";

import authorize from "../middlewares/authorize.js";

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
    validate({
        body: registerValidator
    }),
    authController.register
);

router.post(
    "/login",
    validate({
        body: loginValidator
    }),
    authController.login
);



router.post(
    "/forgot-password",
    validate({
        body: forgotPasswordValidator
    }),
    authController.forgotPassword
);

router.post(
    "/reset-password",
    validate({
        body: resetPasswordValidator
    }),
    authController.resetPassword
);

router.post(

    "/refresh-token",

    authController.refreshToken

);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/


router.post(

    "/logout",

    authenticate,

    authController.logout
);


router.get(
    "/me",
    authenticate,
    authController.getCurrentUser
);

router.put(
    "/change-password",
    authenticate,
    validate({
        body: changePasswordValidator
    }),
    authController.changePassword
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/


router.get(

    "/sessions",

    authenticate,

    authorize("ADMIN"),

    authController.getActiveSessions

);


router.delete(

    "/sessions/:sessionId",

    authenticate,

    authorize("ADMIN"),

    authController.revokeSession
    
);

export default router;