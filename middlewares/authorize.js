/*
|--------------------------------------------------------------------------
| Role Authorization Middleware
|--------------------------------------------------------------------------
*/

export function authorize(...roles) {

    return (req, res, next) => {

        if (!req.user) {

            return res.status(401).json({

                success: false,

                message: "Authentication required."

            });

        }

        const roleName =

            req.user.role?.name ||

            req.user.role;

        if (

            !roles.includes(roleName)

        ) {

            return res.status(403).json({

                success: false,

                message: "Access denied."

            });

        }

        next();

    };

}

export default authorize;