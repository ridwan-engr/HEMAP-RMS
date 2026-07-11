import { Admin } from "mongodb";
import Role from "../../models/Role.js";

/*
|--------------------------------------------------------------------------
| Get Role By ID
|--------------------------------------------------------------------------
*/

export async function getRoleById(id) {

    return Role.findById(id);

}

/*
|--------------------------------------------------------------------------
| Get Role By Name
|--------------------------------------------------------------------------
*/

export async function getRoleByName(name) {

    return Role.findOne({

        name: name.toUpperCase()

    });

}

/*
|--------------------------------------------------------------------------
| Check Permission
|--------------------------------------------------------------------------
*/

export function hasPermission(user, permission) {

    if (!user || !user.role) {

        return false;

    }

    const permissions =

        user.role.permissions || [];

    return permissions.includes(permission);

}

/*
|--------------------------------------------------------------------------
| Assign Permissions
|--------------------------------------------------------------------------
*/

export async function updatePermissions(roleId, permissions) {

    return Role.findByIdAndUpdate(

        roleId,

        {

            permissions

        },

        {

            new: true

        }

    );

}

export default {

    getRoleById,

    getRoleByName,

    hasPermission,

    updatePermissions

};