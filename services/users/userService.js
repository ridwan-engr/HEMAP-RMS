import User from "../../models/User.js";
import Role from "../../models/Role.js";

import {
    validatePassword
} from "../auth/passwordService.js";

/*
|--------------------------------------------------------------------------
| Get Users
|--------------------------------------------------------------------------
*/

export async function getUsers(filters = {}) {

    const query = {};

    if (filters.role) {

        const role = await Role.findOne({
            name: filters.role.toUpperCase()
        });

        if (role) {

            query.role = role._id;

        }

    }

    if (filters.isActive !== undefined) {

        query.isActive = filters.isActive;

    }

    return User.find(query)
        .populate("role")
        .populate("assignedSites")
        .select("-password")
        .sort({
            createdAt: -1
        });

}

/*
|--------------------------------------------------------------------------
| Get User
|--------------------------------------------------------------------------
*/

export async function getUser(id) {

    const user = await User.findById(id)
        .populate("role")
        .populate("assignedSites")
        .select("-password");

    if (!user) {

        throw new Error("User not found.");

    }

    return user;

}

/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/

export async function createUser(data) {

    const existing = await User.findOne({

        email: data.email.toLowerCase()

    });

    if (existing) {

        throw new Error("Email already exists.");

    }

    const role = await Role.findById(data.role);

    if (!role) {

        throw new Error("Invalid role.");

    }

    const validation = validatePassword(data.password);

    if (!validation.valid) {

        throw new Error(validation.errors.join(" "));

    }

    const user = await User.create({

        ...data,

        email: data.email.toLowerCase()

    });

    return User.findById(user._id)
        .populate("role")
        .populate("assignedSites")
        .select("-password");

}

/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/

export async function updateUser(id, data) {

    if (data.role) {

        const role = await Role.findById(data.role);

        if (!role) {

            throw new Error("Invalid role.");

        }

    }

    if (data.password) {

        const validation = validatePassword(data.password);

        if (!validation.valid) {

            throw new Error(validation.errors.join(" "));

        }

    }

    const user = await User.findByIdAndUpdate(

        id,

        data,

        {

            new: true,

            runValidators: true

        }

    )

        .populate("role")

        .populate("assignedSites")

        .select("-password");

    if (!user) {

        throw new Error("User not found.");

    }

    return user;

}

/*
|--------------------------------------------------------------------------
| Delete User
|--------------------------------------------------------------------------
*/

export async function deleteUser(id) {

    const user = await User.findById(id);

    if (!user) {

        throw new Error("User not found.");

    }

    await user.deleteOne();

    return true;

}

/*
|--------------------------------------------------------------------------
| Activate User
|--------------------------------------------------------------------------
*/

export async function activateUser(id) {

    const user = await User.findByIdAndUpdate(

        id,

        {

            isActive: true

        },

        {

            new: true

        }

    )

        .populate("role")

        .populate("assignedSites")

        .select("-password");

    if (!user) {

        throw new Error("User not found.");

    }

    return user;

}

/*
|--------------------------------------------------------------------------
| Deactivate User
|--------------------------------------------------------------------------
*/

export async function deactivateUser(id) {

    const user = await User.findByIdAndUpdate(

        id,

        {

            isActive: false

        },

        {

            new: true

        }

    )

        .populate("role")

        .populate("assignedSites")

        .select("-password");

    if (!user) {

        throw new Error("User not found.");

    }

    return user;

}

export default {

    getUsers,

    getUser,

    createUser,

    updateUser,

    deleteUser,

    activateUser,

    deactivateUser

};