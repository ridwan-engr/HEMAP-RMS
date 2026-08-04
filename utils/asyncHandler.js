/*
|--------------------------------------------------------------------------
| Async Handler
|--------------------------------------------------------------------------
| Wraps async Express route handlers and forwards errors to the global
| error handler.
|--------------------------------------------------------------------------
*/

export default function asyncHandler(handler) {

    return (req, res, next) => {

        Promise.resolve(

            handler(req, res, next)

        ).catch(next);

    };

}