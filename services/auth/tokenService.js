import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";

/*
|--------------------------------------------------------------------------
| Generate Access Token
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
| Generate Refresh Token
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
| Verify Token
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
| Decode Token
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