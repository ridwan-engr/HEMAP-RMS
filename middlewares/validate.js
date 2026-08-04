export default function validate(schemas = {}) {

    return (req, res, next) => {

        try {

            /*
            |--------------------------------------------------------------------------
            | Body Validation
            |--------------------------------------------------------------------------
            */

            if (schemas.query) {

                const { error, value } = schemas.query.validate(req.query, {

                    abortEarly: false,
                    stripUnknown: true,
                    convert: true

                });

                if (error) {

                    return next(error);

                }

            }

            /*
            |--------------------------------------------------------------------------
            | Query Validation
            |--------------------------------------------------------------------------
            */

            if (schemas.query) {

                const { error, value } = schemas.query.validate(req.query, {

                    abortEarly: false,
                    stripUnknown: true,
                    convert: true

                });

                if (error) {

                    return next(error);

                }

                // DO NOT assign req.query directly
                Object.assign(req.query, value);

            }

            /*
            |--------------------------------------------------------------------------
            | Params Validation
            |--------------------------------------------------------------------------
            */

            if (schemas.params) {

                const { error, value } = schemas.params.validate(req.params, {

                    abortEarly: false,
                    stripUnknown: true,
                    convert: true

                });

                if (error) {

                    return next(error);

                }

                req.params = value;

            }

            return next();

        }

        catch (error) {

            return next(error);

        }

    };

}