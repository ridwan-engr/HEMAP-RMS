import Role from "../../models/Role.js";
import User from "../../models/User.js";

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
        name: data.name.toUpperCase(),
        description: data.description,
        permissions: data.permissions || []
    });
}

/*
|--------------------------------------------------------------------------
| Get All Roles
|--------------------------------------------------------------------------
*/

export async function getRoles() {
    return Role.find().sort({ name: 1 });
}

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
| Update Role
|--------------------------------------------------------------------------
*/

export async function updateRole(id, data) {

    const role = await Role.findById(id);

    if (!role) {

        throw new Error("Role not found.");

    }

    if (role.name === "ADMIN" && data.name) {

        throw new Error(
            "Administrator role name cannot be changed."
        );

    }

    return Role.findByIdAndUpdate(
        id,
        {
            ...data,
            name: data.name
                ? data.name.toUpperCase()
                : undefined
        },
        {
            new: true,
            runValidators: true
        }
    );

}

/*
|--------------------------------------------------------------------------
| Delete Role
|--------------------------------------------------------------------------
*/

export async function deleteRole(id) {

    const role = await Role.findById(id);

    if (!role) {

        throw new Error("Role not found.");

    }

    if (role.name === "ADMIN") {

        throw new Error(
            "Administrator role cannot be deleted."
        );

    }
    return Role.findByIdAndDelete(id);

}

/*
|--------------------------------------------------------------------------
| Add Permission
|--------------------------------------------------------------------------
*/

export async function addPermissionToRole(roleId, permission) {
    return Role.findByIdAndUpdate(
        roleId,
        {
            $addToSet: {
                permissions: permission
            }
        },
        {
            new: true
        }
    );
}

/*
|--------------------------------------------------------------------------
| Remove Permission
|--------------------------------------------------------------------------
*/

export async function removePermissionFromRole(roleId, permission) {
    return Role.findByIdAndUpdate(
        roleId,
        {
            $pull: {
                permissions: permission
            }
        },
        {
            new: true
        }
    );
}

/*
|--------------------------------------------------------------------------
| Replace Permissions
|--------------------------------------------------------------------------
*/

export async function replaceRolePermissions(roleId, permissions) {
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

/*
|--------------------------------------------------------------------------
| Role Has Permission
|--------------------------------------------------------------------------
*/

export async function roleHasPermission(roleId, permission) {
    const role = await Role.findById(roleId);

    if (!role) return false;

    return role.permissions.includes(permission);
}

/*
|--------------------------------------------------------------------------
| User Has Permission
|--------------------------------------------------------------------------
*/

export async function userHasPermission(userId, permission) {

    const user = await User.findById(userId).populate("role");

    if (!user || !user.role) {
        return false;
    }

    return user.role.permissions.includes(permission);
}

/*
|--------------------------------------------------------------------------
| Get Users By Role
|--------------------------------------------------------------------------
*/

export async function getUsersByRole(roleId) {

    return User.find({
        role: roleId
    })
        .select("-password")
        .populate("role");
}

/*
|--------------------------------------------------------------------------
| Count Users By Role
|--------------------------------------------------------------------------
*/

export async function countUsersByRole(roleId) {

    return User.countDocuments({
        role: roleId
    });
}

/*
|--------------------------------------------------------------------------
| Check Administrator
|--------------------------------------------------------------------------
*/

export async function isAdministrator(userId) {

    const user = await User.findById(userId).populate("role");

    if (!user || !user.role) {
        return false;
    }

    return user.role.name === "ADMIN";
}

/*
|--------------------------------------------------------------------------
| Role Statistics
|--------------------------------------------------------------------------
*/

export async function getRoleStatistics() {

    const roles = await Role.find();

    const stats = [];

    for (const role of roles) {

        const users = await User.countDocuments({
            role: role._id
        });

        stats.push({
            id: role._id,
            name: role.name,
            users,
            permissions: role.permissions.length
        });
    }

    return stats;
}

/*
|--------------------------------------------------------------------------
| Permission Statistics
|--------------------------------------------------------------------------
*/

export async function getPermissionStatistics() {

    const roles = await Role.find();

    return roles.map(role => ({
        role: role.name,
        permissions: role.permissions.length
    }));
}

/*
|--------------------------------------------------------------------------
| RBAC Status
|--------------------------------------------------------------------------
*/

export async function getRBACStatus() {

    const adminRole = await Role.findOne({
        name: "ADMIN"
    });

    const administratorCount = adminRole
        ? await User.countDocuments({
            role: adminRole._id
        })
        : 0;

    return {

        roles: await Role.countDocuments(),

        users: await User.countDocuments(),

        administrators: administratorCount,

        timestamp: new Date()

    };

}

/*
|--------------------------------------------------------------------------
| Initialize Roles
|--------------------------------------------------------------------------
*/

export async function initializeRoles() {

    const count = await Role.countDocuments();

    if (count > 0) {
        return [];
    }

    const roles = [
        {
            name: "ADMIN",
            description: "System Administrator",
            permissions: [

                "users.create",

                "users.read",

                "users.update",

                "users.delete",

                "roles.create",

                "roles.read",

                "roles.update",

                "roles.delete",

                "sites.create",

                "sites.read",

                "sites.update",

                "sites.delete",

                "telemetry.read",

                "telemetry.write",

                "optimization.run",

                "optimization.read",

                "forecast.read",

                "reports.read",

                "dashboard.read",

                "settings.update"
            ]
        },
        {
            name: "ENGINEER",
            description: "Field Engineer",
            permissions: [
                "telemetry.read",
                "telemetry.write",
                "optimization.run",
                "optimization.read"
            ]
        },
        {
            name: "SUPERVISOR",
            description: "Supervisor",
            permissions: [
                "telemetry.read",
                "optimization.read"
            ]
        },
        {
            name: "VIEWER",
            description: "Read Only",
            permissions: [
                "telemetry.read"
            ]
        }
    ];

    return Role.insertMany(roles);
}

/*
|--------------------------------------------------------------------------
| Assign Default Permissions
|--------------------------------------------------------------------------
*/

export async function assignDefaultPermissions() {

    const roles = await Role.find();

    return roles;
}

/*
|--------------------------------------------------------------------------
| Role Exists
|--------------------------------------------------------------------------
*/

export async function roleExists(name) {

    const role = await Role.findOne({
        name: name.toUpperCase()
    });

    return !!role;
}

/*
|--------------------------------------------------------------------------
| Legacy Helper
|--------------------------------------------------------------------------
*/

export function hasPermission(user, permission) {

    if (!user || !user.role) {
        return false;
    }

    return (
        user.role.permissions || []
    ).includes(permission);
}

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    createRole,

    getRoles,

    getRoleById,

    getRoleByName,

    updateRole,

    deleteRole,

    addPermissionToRole,

    removePermissionFromRole,

    replaceRolePermissions,

    roleHasPermission,

    userHasPermission,

    getUsersByRole,

    countUsersByRole,

    isAdministrator,

    getRoleStatistics,

    getPermissionStatistics,

    getRBACStatus,

    initializeRoles,

    assignDefaultPermissions,

    roleExists,

    hasPermission

};