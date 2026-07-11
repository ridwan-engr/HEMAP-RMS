import jwt from "jsonwebtoken";

import User from "../models/User.js";

import logger from "../utils/logger.js";

import { env } from "../config/env.js";

/*
|--------------------------------------------------------------------------
| JWT Authentication Middleware
|--------------------------------------------------------------------------
*/

export async function authenticate(req, res, next) {

    try {

        const authHeader = req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({

                success: false,

                message: "Authentication required."

            });

        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(

            token,

            env.jwtSecret

        );

        const user = await User.findById(decoded.id)

            .populate("role")

            .select("-password");

        if (!user) {

            return res.status(401).json({

                success: false,

                message: "Invalid user."

            });

        }

        if (!user.isActive) {

            return res.status(403).json({

                success: false,

                message: "User account has been disabled."

            });

        }

        req.user = user;

        next();

    }

    catch (error) {

        logger.error(error);

        return res.status(401).json({

            success: false,

            message: "Invalid or expired token."

        });

    }

}

export default authenticate;