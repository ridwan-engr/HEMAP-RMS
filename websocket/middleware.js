import jwt from "jsonwebtoken";

import env from "../config/env.js";

export default function socketAuthentication(

    socket,

    next

) {

    try {

        const token =

            socket.handshake.auth?.token ||

            socket.handshake.headers.authorization;

        if (!token) {

            return next(

                new Error(

                    "Authentication required."

                )

            );

        }

        const payload = jwt.verify(

            token.replace("Bearer ", ""),

            env.jwtSecret

        );

        socket.user = payload;

        next();

    }

    catch (error) {

        next(error);

    }

}