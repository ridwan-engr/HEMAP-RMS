/**
 * ============================================================================
 * Generic Request Validation Middleware
 * ----------------------------------------------------------------------------
 * Validates req.body, req.query, req.params or req.headers using Joi schemas.
 *
 * Usage:
 * router.post(
 *     "/login",
 *     validate({ body: loginSchema }),
 *     authController.login
 * );
 * ============================================================================
 */

export function validate(schemas = {}) {

    return async (req, res, next) => {

        try {

            if (schemas.body) {

                const { error, value } = schemas.body.validate(req.body, {

                    abortEarly: false,

                    allowUnknown: false,

                    stripUnknown: true,

                    convert: true

                });

                if (error) {

                    return res.status(400).json({

                        success: false,

                        message: "Request body validation failed.",

                        errors: error.details.map(detail => ({

                            field: detail.path.join("."),

                            message: detail.message

                        }))

                    });

                }

                req.body = value;

            }

            if (schemas.query) {

                const { error, value } = schemas.query.validate(req.query, {

                    abortEarly: false,

                    allowUnknown: false,

                    stripUnknown: true,

                    convert: true

                });

                if (error) {

                    return res.status(400).json({

                        success: false,

                        message: "Query validation failed.",

                        errors: error.details.map(detail => ({

                            field: detail.path.join("."),

                            message: detail.message

                        }))

                    });

                }

                req.query = value;

            }

            if (schemas.params) {

                const { error, value } = schemas.params.validate(req.params, {

                    abortEarly: false,

                    allowUnknown: false,

                    stripUnknown: true,

                    convert: true

                });

                if (error) {

                    return res.status(400).json({

                        success: false,

                        message: "Route parameter validation failed.",

                        errors: error.details.map(detail => ({

                            field: detail.path.join("."),

                            message: detail.message

                        }))

                    });

                }

                req.params = value;

            }

            if (schemas.headers) {

                const { error, value } = schemas.headers.validate(req.headers, {

                    abortEarly: false,

                    allowUnknown: true,

                    stripUnknown: false,

                    convert: true

                });

                if (error) {

                    return res.status(400).json({

                        success: false,

                        message: "Header validation failed.",

                        errors: error.details.map(detail => ({

                            field: detail.path.join("."),

                            message: detail.message

                        }))

                    });

                }

                req.headers = value;

            }

            return next();

        } catch (error) {

            return res.status(500).json({

                success: false,

                message: error.message

            });

        }

    };

}

export default validate;