import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";

/*
|--------------------------------------------------------------------------
| Access Token
|--------------------------------------------------------------------------
*/

export function generateAccessToken(user) {

    return jwt.sign(

        {

            id: user._id,

            email: user.email,

            role: user.role

        },

        env.jwtSecret,

        {

            expiresIn: env.jwtExpiresIn

        }

    );

}

/*
|--------------------------------------------------------------------------
| Refresh Token
|--------------------------------------------------------------------------
*/

export function generateRefreshToken(user) {

    return jwt.sign(

        {

            id: user._id

        },

        env.jwtSecret,

        {

            expiresIn: "30d"

        }

    );

}

/*
|--------------------------------------------------------------------------
| Verify
|--------------------------------------------------------------------------
*/

export function verifyToken(token) {

    return jwt.verify(

        token,

        env.jwtSecret

    );

}

/*
|--------------------------------------------------------------------------
| Decode
|--------------------------------------------------------------------------
*/

export function decodeToken(token) {

    return jwt.decode(token);

}

export default {

    generateAccessToken,

    generateRefreshToken,

    verifyToken,

    decodeToken

};