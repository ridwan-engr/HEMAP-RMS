import jwt from "jsonwebtoken";

import User from "../models/User.js";

import { env } from "../config/env.js";

/*
|--------------------------------------------------------------------------
| Authentication Middleware
|--------------------------------------------------------------------------
*/

export async function authenticate(req, res, next) {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message: "Authentication token is required."

            });

        }

        if (!authHeader.startsWith("Bearer ")) {

            return res.status(401).json({

                success: false,

                message: "Invalid authorization header."

            });

        }

        const token = authHeader.substring(7);

        const decoded = jwt.verify(
            token,
            env.jwtSecret
        );

        const user = await User.findById(decoded.id)
            .populate("role")
            .populate("assignedSites")
            .select("-password");

        if (!user) {

            return res.status(401).json({

                success: false,

                message: "User not found."

            });

        }

        if (!user.isActive) {

            return res.status(403).json({

                success: false,

                message: "User account is disabled."

            });

        }

        req.user = user;

        return next();

    }

    catch (error) {

        if (error.name === "TokenExpiredError") {

            return res.status(401).json({

                success: false,

                message: "Access token expired."

            });

        }

        if (error.name === "JsonWebTokenError") {

            return res.status(401).json({

                success: false,

                message: "Invalid access token."

            });

        }

        return next(error);

    }

}

export default authenticate;