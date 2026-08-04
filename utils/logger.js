import os from "os";

const timestamp = () => new Date().toISOString();

const hostname = os.hostname();

const pid = process.pid;

/*
|--------------------------------------------------------------------------
| Safe Serializer
|--------------------------------------------------------------------------
*/

function safeStringify(value) {

    const seen = new WeakSet();

    return JSON.stringify(

        value,

        (key, val) => {

            if (

                typeof val === "bigint"

            ) {

                return val.toString();

            }

            if (

                val instanceof Error

            ) {

                return {

                    name: val.name,

                    message: val.message,

                    stack: val.stack,

                    cause: val.cause

                };

            }

            if (

                typeof val === "object" &&

                val !== null

            ) {

                if (

                    seen.has(val)

                ) {

                    return "[Circular]";

                }

                seen.add(val);

            }

            return val;

        },

        2

    );

}

/*
|--------------------------------------------------------------------------
| Serialize
|--------------------------------------------------------------------------
*/

function serialize(value) {

    if (

        typeof value === "object" &&

        value !== null

    ) {

        return safeStringify(value);

    }

    return value;

}

/*
|--------------------------------------------------------------------------
| Writer
|--------------------------------------------------------------------------
*/

function write(

    level,

    method,

    ...messages

) {

    const output = messages.map(

        message => serialize(message)

    );

    method(

        `[${level}]`,

        timestamp(),

        `[PID:${pid}]`,

        `[${hostname}]`,

        ...output

    );

}

const logger = Object.freeze({

    info(...messages) {

        write(

            "INFO",

            console.info,

            ...messages

        );

    },

    warn(...messages) {

        write(

            "WARN",

            console.warn,

            ...messages

        );

    },

    error(...messages) {

        write(

            "ERROR",

            console.error,

            ...messages

        );

    },

    success(...messages) {

        write(

            "SUCCESS",

            console.log,

            ...messages

        );

    },

    debug(...messages) {

        if (

            process.env.NODE_ENV !== "production"

        ) {

            write(

                "DEBUG",

                console.debug,

                ...messages

            );

        }

    }

});

export default logger;