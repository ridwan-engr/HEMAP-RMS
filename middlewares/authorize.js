/*
|--------------------------------------------------------------------------
| Authorization Middleware
|--------------------------------------------------------------------------
*/

export function authorize(...roles) {

    // Normalize allowed roles once
    const allowedRoles = roles.map(role => role.toUpperCase());

    return (req, res, next) => {

        if (!req.user) {

            return res.status(401).json({

                success: false,
                message: "Authentication required."

            });

        }

        const roleName = (
            typeof req.user.role === "object"
                ? req.user.role?.name
                : req.user.role
        )?.toUpperCase();

        if (!roleName || !allowedRoles.includes(roleName)) {

            return res.status(403).json({

                success: false,
                message: "Access denied."

            });

        }

        return next();

    };

}

export default authorize;