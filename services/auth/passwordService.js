import bcrypt from "bcryptjs";

/*
|--------------------------------------------------------------------------
| Hash Password
|--------------------------------------------------------------------------
*/

export async function hashPassword(password) {

    return bcrypt.hash(password, 12);

}

/*
|--------------------------------------------------------------------------
| Compare Password
|--------------------------------------------------------------------------
*/

export async function comparePassword(password, hash) {

    return bcrypt.compare(password, hash);

}

/*
|--------------------------------------------------------------------------
| Validate Password
|--------------------------------------------------------------------------
*/

export function validatePassword(password) {

    const errors = [];

    if (!password || password.length < 8) {

        errors.push("Password must contain at least 8 characters.");

    }

    if (!/[A-Z]/.test(password)) {

        errors.push("Password must contain an uppercase letter.");

    }

    if (!/[a-z]/.test(password)) {

        errors.push("Password must contain a lowercase letter.");

    }

    if (!/[0-9]/.test(password)) {

        errors.push("Password must contain a number.");

    }

    if (!/[^A-Za-z0-9]/.test(password)) {

        errors.push("Password must contain a special character.");

    }

    return {

        valid: errors.length === 0,

        errors

    };

}

export default {

    hashPassword,

    comparePassword,

    validatePassword

};