import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

export default function errorHandler(

    err,

    req,

    res,

    next

) {

    logger.error({

        message: err.message,

        name: err.name,

        stack: err.stack

    });

    /*
    ----------------------------------------------------
    Mongoose Validation
    ----------------------------------------------------
    */

    if (

        err.name ===

        "ValidationError"

    ) {

        return res.status(400).json({

            success: false,

            message: "Validation failed.",

            errors: Object.values(

                err.errors

            ).map(

                e => e.message

            )

        });

    }

    /*
    ----------------------------------------------------
    Duplicate Key
    ----------------------------------------------------
    */

    if (

        err.code === 11000

    ) {

        return res.status(409).json({

            success: false,

            message: "Duplicate record.",

            field:

                Object.keys(

                    err.keyPattern

                )[0]

        });

    }

    /*
    ----------------------------------------------------
    Cast Error
    ----------------------------------------------------
    */

    if (

        err.name ===

        "CastError"

    ) {

        return res.status(400).json({

            success: false,

            message: "Invalid resource identifier."

        });

    }

    /*
    ----------------------------------------------------
    JWT Errors
    ----------------------------------------------------
    */

    if (

        err.name ===

        "JsonWebTokenError"

    ) {

        return res.status(401).json({

            success: false,

            message: "Invalid authentication token."

        });

    }

    if (

        err.name ===

        "TokenExpiredError"

    ) {

        return res.status(401).json({

            success: false,

            message: "Authentication token expired."

        });

    }

    /*
    ----------------------------------------------------
    Axios Errors
    ----------------------------------------------------
    */

    if (

        err.response

    ) {

        return res.status(

            err.response.status ||

            500

        ).json({

            success: false,

            message:

                err.response.data ||

                err.message

        });

    }

    /*
    ----------------------------------------------------
    Default
    ----------------------------------------------------
    */

    return res.status(

        err.status ||

        500

    ).json({

        success: false,

        message:

            err.message ||

            "Internal Server Error."

    });

}