/*
|--------------------------------------------------------------------------
| 404 Middleware
|--------------------------------------------------------------------------
*/

export default function notFound(req, res) {

    return res.status(404).json({

        success: false,

        message: `Route not found: ${req.originalUrl}`

    });

}