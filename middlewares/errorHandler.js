import logger from "../utils/logger.js";

export default function errorHandler(err, req, res, next) {

    logger.error({

        message: err.message,

        stack: err.stack,

        name: err.name

    });

    /*
    |--------------------------------------------------------------------------
    | Joi Validation
    |--------------------------------------------------------------------------
    */

    if (err.isJoi) {

        return res.status(400).json({

            success: false,

            message: "Validation failed.",

            errors: err.details.map(item => ({

                field: item.path.join("."),

                message: item.message

            }))

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Mongoose Validation
    |--------------------------------------------------------------------------
    */

    if (err.name === "ValidationError") {

        return res.status(400).json({

            success: false,

            message: "Validation failed.",

            errors: Object.values(err.errors).map(e => ({

                field: e.path,

                message: e.message

            }))

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Duplicate Key
    |--------------------------------------------------------------------------
    */

    if (err.code === 11000) {

        return res.status(409).json({

            success: false,

            message: "Duplicate record.",

            field: Object.keys(err.keyPattern)[0]

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Invalid ObjectId
    |--------------------------------------------------------------------------
    */

    if (err.name === "CastError") {

        return res.status(400).json({

            success: false,

            message: "Invalid resource identifier."

        });

    }

    /*
    |--------------------------------------------------------------------------
    | JWT
    |--------------------------------------------------------------------------
    */

    if (

        err.name === "JsonWebTokenError" ||

        err.name === "TokenExpiredError"

    ) {

        return res.status(401).json({

            success: false,

            message: err.message

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Default
    |--------------------------------------------------------------------------
    */

    /*return res.status(

        err.status || 500

    ).json({

        success: false,

        message: err.message || "Internal Server Error."

    });*/

    return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error.",
    stack: err.stack
});

}