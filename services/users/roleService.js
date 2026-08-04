import Role from "../../models/Role.js";
import User from "../../models/User.js";

/*
|--------------------------------------------------------------------------
| Get All Roles
|--------------------------------------------------------------------------
*/

export async function getRoles(filters = {}) {

    const query = {};

    if (filters.name) {

        query.name = {
            $regex: filters.name,
            $options: "i"
        };

    }

    return Role.find(query).sort({
        createdAt: -1
    });

}

/*
|--------------------------------------------------------------------------
| Get Single Role
|--------------------------------------------------------------------------
*/

export async function getRole(id) {

    const role = await Role.findById(id);

    if (!role) {

        throw new Error("Role not found.");

    }

    return role;

}

/*
|--------------------------------------------------------------------------
| Create Role
|--------------------------------------------------------------------------
*/

export async function createRole(data) {

    const exists = await Role.findOne({

        name: data.name.toUpperCase()

    });

    if (exists) {

        throw new Error("Role already exists.");

    }

    return Role.create({

        ...data,

        name: data.name.toUpperCase()

    });

}

/*
|--------------------------------------------------------------------------
| Update Role
|--------------------------------------------------------------------------
*/

export async function updateRole(id, data) {

    const role = await Role.findById(id);

    if (!role) {

        throw new Error("Role not found.");

    }

    if (data.name) {

        const duplicate = await Role.findOne({

            name: data.name.toUpperCase(),

            _id: {
                $ne: id
            }

        });

        if (duplicate) {

            throw new Error("Role already exists.");

        }

        data.name = data.name.toUpperCase();

    }

    Object.assign(role, data);

    await role.save();

    return role;

}

/*
|--------------------------------------------------------------------------
| Delete Role
|--------------------------------------------------------------------------
*/

export async function deleteRole(id) {

    const assignedUsers = await User.countDocuments({

        role: id

    });

    if (assignedUsers > 0) {

        throw new Error(

            "Cannot delete a role assigned to one or more users."

        );

    }

    const role = await Role.findByIdAndDelete(id);

    if (!role) {

        throw new Error("Role not found.");

    }

    return true;

}

export default {

    getRoles,

    getRole,

    createRole,

    updateRole,

    deleteRole

};