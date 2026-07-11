const timestamp = () => new Date().toISOString();

function serialize(value) {

    if (value instanceof Error) {

        return {

            name: value.name,

            message: value.message,

            stack: value.stack,

            cause: value.cause

        };

    }

    return value;

}

function write(

    level,

    method,

    ...messages

) {

    const output = messages.map(

        message => {

            const value = serialize(message);

            return typeof value === "object"

                ? JSON.stringify(value, null, 2)

                : value;

        }

    );

    method(

        `[${level}] ${timestamp()}`,

        ...output

    );

}

const logger = {

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

};

export default logger;