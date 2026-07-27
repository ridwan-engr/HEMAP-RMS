import * as roleService from "../services/users/roleService.js";

export async function initializeRoles(req, res) {

    try {

        const roles = await roleService.initializeRoles();

        if (!roles.length) {

            return res.status(200).json({

                success: true,

                message: "Roles already initialized."

            });

        }

        return res.status(201).json({

            success: true,

            message: "Default roles created successfully.",

            data: roles

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

/*
|--------------------------------------------------------------------------
| Create Role
|--------------------------------------------------------------------------
*/

export async function createRole(

    req,

    res

) {


    try {


        const role =

            await roleService.createRole(

                req.body

            );



        res.status(201)

            .json({


                success: true,


                message:

                    "Role created successfully",


                data:

                    role


            });


    }

    catch (error) {


        res.status(400)

            .json({


                success: false,


                message:

                    error.message


            });


    }

}



/*
|--------------------------------------------------------------------------
| Get All Roles
|--------------------------------------------------------------------------
*/

export async function getRoles(

    req,

    res

) {


    try {


        const roles =

            await roleService.getRoles();



        res.status(200)

            .json({


                success: true,


                data:

                    roles


            });


    }

    catch (error) {


        res.status(500)

            .json({


                success: false,


                message:

                    error.message


            });


    }

}



/*
|--------------------------------------------------------------------------
| Get Role By ID
|--------------------------------------------------------------------------
*/

export async function getRoleById(

    req,

    res

) {


    try {


        const role =

            await roleService.getRoleById(

                req.params.id
            );


        if (!role) {


            return res.status(404)

                .json({


                    success: false,


                    message:

                        "Role not found"


                });


        }



        res.status(200)

            .json({


                success: true,


                data:

                    role


            });


    }

    catch (error) {


        res.status(500)

            .json({


                success: false,


                message:

                    error.message


            });


    }

}



/*
|--------------------------------------------------------------------------
| Get Role By Name
|--------------------------------------------------------------------------
*/

export async function getRoleByName(

    req,

    res

) {


    try {


        const role =

            await roleService.getRoleByName(

                req.body.name

            );



        res.status(200)

            .json({


                success: true,


                data:

                    role


            });


    }

    catch (error) {


        res.status(500)

            .json({


                success: false,


                message:

                    error.message


            });


    }

}



/*
|--------------------------------------------------------------------------
| Update Role
|--------------------------------------------------------------------------
*/

export async function updateRole(

    req,

    res

) {


    try {


        const role =

            await roleService.updateRole(

                req.params.id,

                req.body

            );



        res.status(200)

            .json({


                success: true,


                message:

                    "Role updated successfully",


                data:

                    role


            });


    }

    catch (error) {


        res.status(400)

            .json({


                success: false,


                message:

                    error.message


            });


    }

}

/*
|--------------------------------------------------------------------------
| Delete Role
|--------------------------------------------------------------------------
*/

export async function deleteRole(

    req,

    res

) {

    try {

        
        await roleService.deleteRole(

            req.params.id

        );

        res.status(200)

            .json({


                success: true,


                message:

                    "Role deleted successfully"


            });


    }

    catch (error) {


        res.status(400)

            .json({


                success: false,


                message:

                    error.message


            });


    }

}

/*
|--------------------------------------------------------------------------
| Add Permission To Role
|--------------------------------------------------------------------------
*/

export async function addPermissionToRole(

    req,

    res

) {


    try {


        const role =

            await roleService.addPermissionToRole(
                
                req.params.id,

                req.body.permission

            );



        res.status(200)

            .json({


                success: true,


                message:

                    "Permission added successfully",


                data:

                    role


            });


    }

    catch (error) {


        res.status(400)

            .json({


                success: false,


                message:

                    error.message


            });


    }

}



/*
|--------------------------------------------------------------------------
| Remove Permission From Role
|--------------------------------------------------------------------------
*/

export async function removePermissionFromRole(

    req,

    res

) {


    try {


        const role =

            await roleService.removePermissionFromRole(

                req.params.id,

                req.params.permissionId

            );



        res.status(200)

            .json({


                success: true,


                message:

                    "Permission removed successfully",


                data:

                    role


            });


    }

    catch (error) {


        res.status(400)

            .json({


                success: false,


                message:

                    error.message


            });


    }

}



/*
|--------------------------------------------------------------------------
| Replace Role Permissions
|--------------------------------------------------------------------------
*/

export async function replacePermissions(

    req,

    res

) {


    try {


        const role =

            await roleService.replaceRolePermissions(

                req.params.id,

                req.params.permissions

            );



        res.status(200)

            .json({


                success: true,


                message:

                    "Role permissions updated successfully",


                data:

                    role


            });


    }

    catch (error) {


        res.status(400)

            .json({


                success: false,


                message:

                    error.message


            });


    }

}



/*
|--------------------------------------------------------------------------
| Check Role Permission
|--------------------------------------------------------------------------
*/

export async function checkRolePermission(

    req,

    res

) {


    try {


        const result =

            await roleService.roleHasPermission(

                req.params.roleId,

                req.params.permission

            );



        res.status(200)

            .json({


                success: true,


                hasPermission:

                    result


            });


    }

    catch (error) {


        res.status(400)

            .json({


                success: false,


                message:

                    error.message


            });


    }

}



/*
|--------------------------------------------------------------------------
| Check User Permission
|--------------------------------------------------------------------------
*/

export async function checkUserPermission(

    req,

    res

) {


    try {


        const result =

            await roleService.userHasPermission(

                req.params.userId,

                req.params.permission

            );



        res.status(200)

            .json({


                success: true,


                hasPermission:

                    result


            });


    }

    catch (error) {


        res.status(400)

            .json({


                success: false,


                message:

                    error.message


            });


    }

}

/*
|--------------------------------------------------------------------------
| Get Users By Role
|--------------------------------------------------------------------------
*/

export async function getUsersByRole(

    req,

    res

) {


    try {


        const users =

            await roleService.getUsersByRole(

                req.params.roleId

            );



        res.status(200)

            .json({


                success: true,


                data:

                    users


            });


    }

    catch (error) {


        res.status(400)

            .json({


                success: false,


                message:

                    error.message


            });


    }

}



/*
|--------------------------------------------------------------------------
| Count Users By Role
|--------------------------------------------------------------------------
*/

export async function countUsersByRole(

    req,

    res

) {


    try {


        const count =

            await roleService.countUsersByRole(

                req.params.roleId

            );



        res.status(200)

            .json({


                success: true,


                count


            });


    }

    catch (error) {


        res.status(400)

            .json({


                success: false,


                message:

                    error.message


            });


    }

}



/*
|--------------------------------------------------------------------------
| Check Administrator
|--------------------------------------------------------------------------
*/

export async function checkAdministrator(

    req,

    res

) {


    try {


        const result =

            await roleService.isAdministrator(

                req.params.userId

            );



        res.status(200)

            .json({


                success: true,


                isAdministrator:

                    result


            });


    }

    catch (error) {


        res.status(400)

            .json({


                success: false,


                message:

                    error.message


            });


    }

}



/*
|--------------------------------------------------------------------------
| Role Statistics
|--------------------------------------------------------------------------
*/

export async function roleStatistics(

    req,

    res

) {


    try {


        const statistics =

            await roleService.getRoleStatistics();



        res.status(200)

            .json({


                success: true,


                data:

                    statistics


            });


    }

    catch (error) {


        res.status(500)

            .json({


                success: false,


                message:

                    error.message


            });


    }

}



/*
|--------------------------------------------------------------------------
| Permission Statistics
|--------------------------------------------------------------------------
*/

export async function permissionStatistics(

    req,

    res

) {


    try {


        const statistics =

            await roleService.getPermissionStatistics();



        res.status(200)

            .json({


                success: true,


                data:

                    statistics


            });


    }

    catch (error) {


        res.status(500)

            .json({


                success: false,


                message:

                    error.message


            });


    }

}



/*
|--------------------------------------------------------------------------
| RBAC Health Status
|--------------------------------------------------------------------------
*/

export async function rbacStatus(

    req,

    res

) {


    try {


        const status =

            await roleService.getRBACStatus();



        res.status(200)

            .json({


                success: true,


                data:

                    status


            });


    }

    catch (error) {


        res.status(500)

            .json({


                success: false,


                message:

                    error.message


            });


    }
}

/*
|--------------------------------------------------------------------------
| Assign Default Permissions
|--------------------------------------------------------------------------
*/

export async function assignDefaultPermissions(

    req,

    res

) {


    try {


        const result =

            await roleService.assignDefaultPermissions();



        res.status(200)

            .json({


                success: true,


                message:

                    "Default permissions assigned successfully",


                data:

                    result


            });


    }

    catch (error) {


        res.status(500)

            .json({


                success: false,


                message:

                    error.message


            });


    }

}



/*
|--------------------------------------------------------------------------
| Check Role Existence
|--------------------------------------------------------------------------
*/

export async function roleExists(

    req,

    res

) {


    try {


        const exists =

            await roleService.roleExists(

                req.params.name

            );



        res.status(200)

            .json({


                success: true,


                exists


            });


    }

    catch (error) {


        res.status(400)

            .json({


                success: false,


                message:

                    error.message


            });


    }

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


    replacePermissions,


    checkRolePermission,


    checkUserPermission,


    getUsersByRole,


    countUsersByRole,


    checkAdministrator,


    roleStatistics,


    permissionStatistics,


    rbacStatus,


    initializeRoles,


    assignDefaultPermissions,


    roleExists

};