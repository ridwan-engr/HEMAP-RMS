import * as userService from "../services/users/userService.js";


/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/

export async function createUser(

    req,

    res

){


    try {


        const user =

            await userService.createUser(

                req.body

            );



        res.status(201)

        .json({


            success:true,


            message:

                "User created successfully",


            data:

                user


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}


/*
|--------------------------------------------------------------------------
| Get All Users
|--------------------------------------------------------------------------
*/

export async function getUsers(

    req,

    res

){


    try {


        const users =

            await userService.getUsers(

                req.query

            );



        res.json({


            success:true,


            data:

                users


        });


    }

    catch(error){


        res.status(500)

        .json({


            success:false,


            message:

                error.message


        });


    }

}


/*
|--------------------------------------------------------------------------
| Get User By ID
|--------------------------------------------------------------------------
*/

export async function getUserById(

    req,

    res

){


    try {


        const user =

            await userService.getUserById(

                req.params.id

            );



        if(!user){


            return res.status(404)

            .json({


                success:false,


                message:

                    "User not found"


            });


        }



        res.json({


            success:true,


            data:

                user


        });


    }

    catch(error){


        res.status(500)

        .json({


            success:false,


            message:

                error.message


        });


    }

}


/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/

export async function updateUser(

    req,

    res

){


    try {


        const user =

            await userService.updateUser(

                req.params.id,

                req.body

            );



        res.json({


            success:true,


            message:

                "User updated successfully",


            data:

                user


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}

/*
|--------------------------------------------------------------------------
| Update User Profile
|--------------------------------------------------------------------------
*/

export async function updateProfile(

    req,

    res

){


    try {


        const user =

            await userService.updateProfile(

                req.params.id,

                req.body

            );



        res.status(200)

        .json({


            success:true,


            message:

                "Profile updated successfully",


            data:

                user


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

export async function changePassword(

    req,

    res

){


    try {


        const {

            currentPassword,

            newPassword

        } = req.body;



        const result =

            await userService.changePassword(

                req.params.id,

                currentPassword,

                newPassword

            );



        res.status(200)

        .json({


            success:true,


            data:

                result


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Assign Sites To User
|--------------------------------------------------------------------------
*/

export async function assignSites(

    req,

    res

){


    try {


        const {

            siteIds

        } = req.body;



        const user =

            await userService.assignSitesToUser(

                req.params.id,

                siteIds

            );



        res.status(200)

        .json({


            success:true,


            message:

                "Sites assigned successfully",


            data:

                user


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Remove Site Assignment
|--------------------------------------------------------------------------
*/

export async function removeSite(

    req,

    res

){


    try {


        const user =

            await userService.removeSiteAssignment(

                req.params.id,

                req.params.siteId

            );



        res.status(200)

        .json({


            success:true,


            message:

                "Site removed successfully",


            data:

                user


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Activate User
|--------------------------------------------------------------------------
*/

export async function activateUser(

    req,

    res

){


    try {


        const user =

            await userService.activateUser(

                req.params.id

            );



        res.status(200)

        .json({


            success:true,


            message:

                "User activated successfully",


            data:

                user


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Deactivate User
|--------------------------------------------------------------------------
*/

export async function deactivateUser(

    req,

    res

){


    try {


        const user =

            await userService.deactivateUser(

                req.params.id

            );



        res.status(200)

        .json({


            success:true,


            message:

                "User deactivated successfully",


            data:

                user


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Delete User
|--------------------------------------------------------------------------
*/

export async function deleteUser(

    req,

    res

){


    try {


        const user =

            await userService.deleteUser(

                req.params.id

            );



        res.status(200)

        .json({


            success:true,


            message:

                "User deleted successfully",


            data:

                user


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}

/*
|--------------------------------------------------------------------------
| Restore User
|--------------------------------------------------------------------------
*/

export async function restoreUser(

    req,

    res

){


    try {


        const user =

            await userService.restoreUser(

                req.params.id

            );



        res.status(200)

        .json({


            success:true,


            message:

                "User restored successfully",


            data:

                user


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Permanently Delete User
|--------------------------------------------------------------------------
*/

export async function permanentlyDeleteUser(

    req,

    res

){


    try {


        await userService.permanentlyDeleteUser(

            req.params.id

        );



        res.status(200)

        .json({


            success:true,


            message:

                "User permanently deleted"


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Search Users
|--------------------------------------------------------------------------
*/

export async function searchUsers(

    req,

    res

){


    try {


        const users =

            await userService.searchUsers(

                req.query.keyword

            );



        res.status(200)

        .json({


            success:true,


            data:

                users


        });


    }

    catch(error){


        res.status(500)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| User Statistics
|--------------------------------------------------------------------------
*/

export async function userStatistics(

    req,

    res

){


    try {


        const statistics =

            await userService.getUserStatistics();



        res.status(200)

        .json({


            success:true,


            data:

                statistics


        });


    }

    catch(error){


        res.status(500)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Paginated Users
|--------------------------------------------------------------------------
*/

export async function paginatedUsers(

    req,

    res

){


    try {


        const result =

            await userService.getPaginatedUsers({

                page:

                    Number(

                        req.query.page || 1

                    ),


                limit:

                    Number(

                        req.query.limit || 20

                    ),


                sortBy:

                    req.query.sortBy || "createdAt",


                order:

                    req.query.order || "desc"

            });



        res.status(200)

        .json({


            success:true,


            data:

                result


        });


    }

    catch(error){


        res.status(500)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Bulk Activate Users
|--------------------------------------------------------------------------
*/

export async function bulkActivate(

    req,

    res

){


    try {


        const result =

            await userService.bulkActivateUsers(

                req.body.userIds

            );



        res.status(200)

        .json({


            success:true,


            message:

                "Users activated successfully",


            data:

                result


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Bulk Deactivate Users
|--------------------------------------------------------------------------
*/

export async function bulkDeactivate(

    req,

    res

){


    try {


        const result =

            await userService.bulkDeactivateUsers(

                req.body.userIds

            );



        res.status(200)

        .json({


            success:true,


            message:

                "Users deactivated successfully",


            data:

                result


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Export Users
|--------------------------------------------------------------------------
*/

export async function exportUsers(

    req,

    res

){


    try {


        const users =

            await userService.exportUsers(

                req.query

            );



        res.status(200)

        .json({


            success:true,


            data:

                users


        });


    }

    catch(error){


        res.status(500)

        .json({


            success:false,


            message:

                error.message


        });


    }

}

/*
|--------------------------------------------------------------------------
| Get User Permission Summary
|--------------------------------------------------------------------------
*/

export async function permissionSummary(

    req,

    res

){


    try {


        const permissions =

            await userService.getUserPermissionSummary(

                req.params.id

            );



        res.status(200)

        .json({


            success:true,


            data:

                permissions


        });


    }

    catch(error){


        res.status(404)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Get User Profile Summary
|--------------------------------------------------------------------------
*/

export async function profileSummary(

    req,

    res

){


    try {


        const profile =

            await userService.getProfileSummary(

                req.params.id

            );



        res.status(200)

        .json({


            success:true,


            data:

                profile


        });


    }

    catch(error){


        res.status(404)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Update Last Login
|--------------------------------------------------------------------------
*/

export async function updateLastLogin(

    req,

    res

){


    try {


        const user =

            await userService.updateLastLogin(

                req.params.id

            );



        res.status(200)

        .json({


            success:true,


            message:

                "Login activity updated",


            data:

                user


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}



/*
|--------------------------------------------------------------------------
| Validate Site Access
|--------------------------------------------------------------------------
*/

export async function validateSiteAccess(

    req,

    res

){


    try {


        const access =

            await userService.hasSiteAccess(

                req.params.id,

                req.params.siteId

            );



        res.status(200)

        .json({


            success:true,


            hasAccess:

                access


        });


    }

    catch(error){


        res.status(400)

        .json({


            success:false,


            message:

                error.message


        });


    }

}

export async function getProfile(req, res) {

    try {

        const profile = await userService.getUserById(req.user.id);

        res.json({

            success: true,

            data: profile

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

export async function assignRole(req, res) {

    try {

        const user = await userService.assignRole(

            req.params.userId,

            req.body.roleId

        );

        res.json({

            success: true,

            message: "Role assigned successfully.",

            data: user

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

}

export async function updateStatus(req, res) {

    try {

        const user = await userService.updateStatus(

            req.params.userId,

            req.body.status

        );

        res.json({

            success: true,

            message: "User status updated.",

            data: user

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

}



/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {

    createUser,
    getUsers,
    getUserById,
    updateUser,

    getProfile,
    updateProfile,

    assignRole,
    updateStatus,

    changePassword,

    assignSites,
    removeSite,

    activateUser,
    deactivateUser,

    deleteUser,
    restoreUser,
    permanentlyDeleteUser,

    searchUsers,
    userStatistics,
    paginatedUsers,

    bulkActivate,
    bulkDeactivate,

    exportUsers,

    permissionSummary,
    profileSummary,

    updateLastLogin,
    validateSiteAccess

};