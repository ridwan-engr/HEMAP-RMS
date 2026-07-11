import User from "../../models/User.js";
import Role from "../../models/Role.js";
import Site from "../../models/Site.js";

import bcrypt from "bcryptjs";


/*
|--------------------------------------------------------------------------
| Create New User
|--------------------------------------------------------------------------
*/

export async function createUser(data) {


    const {

        firstName,

        lastName,

        email,

        password,

        phone,

        role,

        assignedSites=[]

    } = data;



    const existingUser =

        await User.findOne({

            email

        });



    if(existingUser){


        throw new Error(

            "User already exists"

        );

    }



    const roleExists =

        await Role.findById(

            role

        );



    if(!roleExists){


        throw new Error(

            "Invalid role"

        );

    }



    const user =

        await User.create({

            firstName,

            lastName,

            email,

            password,

            phone,

            role,

            assignedSites

        });



    return User.findById(

        user._id

    )

    .populate(

        "role"

    )

    .populate(

        "assignedSites"

    );

}


/*
|--------------------------------------------------------------------------
| Get User By Email
|--------------------------------------------------------------------------
*/

export async function getUserByEmail(

    email

){


    return User.findOne({

        email

    })

    .populate(

        "role"

    )

    .populate(

        "assignedSites"

    );

}


/*
|--------------------------------------------------------------------------
| Get User By ID
|--------------------------------------------------------------------------
*/

export async function getUserById(

    userId

){


    return User.findById(

        userId

    )

    .populate(

        "role"

    )

    .populate(

        "assignedSites"

    );

}


/*
|--------------------------------------------------------------------------
| Get All Users
|--------------------------------------------------------------------------
*/

export async function getUsers(

    filters={}

){


    return User.find(

        filters

    )

    .populate(

        "role"

    )

    .populate(

        "assignedSites"

    )

    .sort({

        createdAt:-1

    });

}

/*
|--------------------------------------------------------------------------
| Update User Information
|--------------------------------------------------------------------------
*/

export async function updateUser(

    userId,

    updates

){


    const allowedFields = [


        "firstName",

        "lastName",

        "email",

        "phone",

        "role",

        "assignedSites",

        "avatar"


    ];



    const filteredUpdates = {};



    allowedFields.forEach(field=>{


        if(

            updates[field] !== undefined

        ){


            filteredUpdates[field] =

                updates[field];

        }


    });



    return User.findByIdAndUpdate(

        userId,


        filteredUpdates,


        {

            new:true,

            runValidators:true

        }

    )

    .populate(

        "role"

    )

    .populate(

        "assignedSites"

    );

}


/*
|--------------------------------------------------------------------------
| Update User Profile
|--------------------------------------------------------------------------
*/

export async function updateProfile(

    userId,

    profileData

){


    const {

        firstName,

        lastName,

        phone,

        avatar

    } = profileData;



    return User.findByIdAndUpdate(

        userId,


        {

            firstName,

            lastName,

            phone,

            avatar

        },


        {

            new:true,

            runValidators:true

        }

    );

}


/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

export async function changePassword(

    userId,

    currentPassword,

    newPassword

){


    const user =

        await User.findById(

            userId

        );



    if(!user){


        throw new Error(

            "User not found"

        );

    }



    const valid =

        await user.comparePassword(

            currentPassword

        );



    if(!valid){


        throw new Error(

            "Current password incorrect"

        );

    }



    user.password =

        newPassword;



    await user.save();



    return {

        success:true,


        message:

            "Password updated successfully"

    };

}


/*
|--------------------------------------------------------------------------
| Assign Sites To User
|--------------------------------------------------------------------------
*/

export async function assignSitesToUser(

    userId,

    siteIds=[]

){


    const sites =

        await Site.find({

            _id:

                {

                    $in:siteIds

                }

        });



    if(

        sites.length !== siteIds.length

    ){


        throw new Error(

            "One or more sites are invalid"

        );

    }



    return User.findByIdAndUpdate(

        userId,


        {

            assignedSites:

                siteIds

        },


        {

            new:true

        }

    )

    .populate(

        "assignedSites"

    );

}


/*
|--------------------------------------------------------------------------
| Remove Site Assignment
|--------------------------------------------------------------------------
*/

export async function removeSiteAssignment(

    userId,

    siteId

){


    return User.findByIdAndUpdate(

        userId,


        {

            $pull:{

                assignedSites:

                    siteId

            }

        },


        {

            new:true

        }

    )

    .populate(

        "assignedSites"

    );

}


/*
|--------------------------------------------------------------------------
| Activate User Account
|--------------------------------------------------------------------------
*/

export async function activateUser(

    userId

){


    return User.findByIdAndUpdate(

        userId,


        {

            isActive:true

        },


        {

            new:true

        }

    );

}


/*
|--------------------------------------------------------------------------
| Deactivate User Account
|--------------------------------------------------------------------------
*/

export async function deactivateUser(

    userId

){


    return User.findByIdAndUpdate(

        userId,


        {

            isActive:false

        },


        {

            new:true

        }

    );

}

/*
|--------------------------------------------------------------------------
| Soft Delete User
|--------------------------------------------------------------------------
*/

export async function deleteUser(

    userId

){


    return User.findByIdAndUpdate(

        userId,


        {

            isActive:false

        },


        {

            new:true

        }

    );

}


/*
|--------------------------------------------------------------------------
| Restore User Account
|--------------------------------------------------------------------------
*/

export async function restoreUser(

    userId

){


    return User.findByIdAndUpdate(

        userId,


        {

            isActive:true

        },


        {

            new:true

        }

    );

}


/*
|--------------------------------------------------------------------------
| Permanently Delete User
|--------------------------------------------------------------------------
*/

export async function permanentlyDeleteUser(

    userId

){


    return User.findByIdAndDelete(

        userId

    );

}


/*
|--------------------------------------------------------------------------
| Search Users
|--------------------------------------------------------------------------
*/

export async function searchUsers(

    keyword

){


    return User.find({

        $or:[


            {

                firstName:

                {

                    $regex:

                        keyword,

                    $options:

                        "i"

                }

            },


            {

                lastName:

                {

                    $regex:

                        keyword,

                    $options:

                        "i"

                }

            },


            {

                email:

                {

                    $regex:

                        keyword,

                    $options:

                        "i"

                }

            }


        ]

    })

    .populate(

        "role"

    )

    .populate(

        "assignedSites"

    );

}


/*
|--------------------------------------------------------------------------
| Get Users By Role
|--------------------------------------------------------------------------
*/

export async function getUsersByRole(

    roleId

){


    return User.find({

        role:

            roleId

    })

    .populate(

        "role"

    )

    .populate(

        "assignedSites"

    );

}


/*
|--------------------------------------------------------------------------
| Get Users Assigned To Site
|--------------------------------------------------------------------------
*/

export async function getUsersBySite(

    siteId

){


    return User.find({

        assignedSites:

            siteId

    })

    .populate(

        "role"

    );

}


/*
|--------------------------------------------------------------------------
| Update Last Login
|--------------------------------------------------------------------------
*/

export async function updateLastLogin(

    userId

){


    return User.findByIdAndUpdate(

        userId,


        {

            lastLogin:

                new Date()

        },


        {

            new:true

        }

    );

}


/*
|--------------------------------------------------------------------------
| User Statistics
|--------------------------------------------------------------------------
*/

export async function getUserStatistics(){


    const total =

        await User.countDocuments();



    const active =

        await User.countDocuments({

            isActive:true

        });



    const inactive =

        await User.countDocuments({

            isActive:false

        });



    return {


        totalUsers:

            total,


        activeUsers:

            active,


        inactiveUsers:

            inactive

    };

}


/*
|--------------------------------------------------------------------------
| Check User Existence
|--------------------------------------------------------------------------
*/

export async function userExists(

    email

){


    const user =

        await User.exists({

            email

        });



    return Boolean(

        user

    );

}


/*
|--------------------------------------------------------------------------
| Validate User Access To Site
|--------------------------------------------------------------------------
*/

export async function hasSiteAccess(

    userId,

    siteId

){


    const user =

        await User.findOne({

            _id:

                userId,


            assignedSites:

                siteId,


            isActive:true

        });



    return Boolean(

        user

    );

}

/*
|--------------------------------------------------------------------------
| Paginated Users
|--------------------------------------------------------------------------
*/

export async function getPaginatedUsers({

    page = 1,

    limit = 20,

    sortBy = "createdAt",

    order = "desc",

    filters = {}

}) {


    const skip =

        (

            page - 1

        )

        *

        limit;



    const sortOrder =

        order === "asc"

        ? 1

        : -1;



    const [

        users,

        total

    ] = await Promise.all([


        User.find(filters)

        .populate(

            "role"

        )

        .populate(

            "assignedSites"

        )

        .sort({

            [sortBy]:

                sortOrder

        })

        .skip(skip)

        .limit(limit),



        User.countDocuments(

            filters

        )


    ]);



    return {


        users,


        pagination:{


            total,


            page,


            limit,


            totalPages:

                Math.ceil(

                    total / limit

                )

        }

    };

}


/*
|--------------------------------------------------------------------------
| Bulk Activate Users
|--------------------------------------------------------------------------
*/

export async function bulkActivateUsers(

    userIds=[]

){


    return User.updateMany(

        {

            _id:

            {

                $in:

                    userIds

            }

        },


        {

            isActive:true

        }

    );

}


/*
|--------------------------------------------------------------------------
| Bulk Deactivate Users
|--------------------------------------------------------------------------
*/

export async function bulkDeactivateUsers(

    userIds=[]

){


    return User.updateMany(

        {

            _id:

            {

                $in:

                    userIds

            }

        },


        {

            isActive:false

        }

    );

}


/*
|--------------------------------------------------------------------------
| Bulk Delete Users
|--------------------------------------------------------------------------
*/

export async function bulkDeleteUsers(

    userIds=[]

){


    return User.updateMany(

        {

            _id:

            {

                $in:

                    userIds

            }

        },


        {

            isActive:false

        }

    );

}


/*
|--------------------------------------------------------------------------
| Export User Data
|--------------------------------------------------------------------------
*/

export async function exportUsers(

    filters={}

){


    const users =

        await User.find(

            filters

        )

        .select(

            "-password"

        )

        .populate(

            "role"

        )

        .populate(

            "assignedSites"

        );



    return users.map(

        user => ({


            id:

                user._id,


            name:

                `${user.firstName} ${user.lastName}`,


            email:

                user.email,


            phone:

                user.phone,


            role:

                user.role?.name,


            active:

                user.isActive,


            lastLogin:

                user.lastLogin,


            created:

                user.createdAt


        })

    );

}


/*
|--------------------------------------------------------------------------
| Get User Permission Summary
|--------------------------------------------------------------------------
*/

export async function getUserPermissionSummary(

    userId

){


    const user =

        await User.findById(

            userId

        )

        .populate({

            path:

                "role",

            populate:{

                path:

                    "permissions"

            }

        });



    if(!user){


        throw new Error(

            "User not found"

        );

    }



    return {


        user:

            user._id,


        role:

            user.role?.name,


        permissions:

            user.role?.permissions ?? []

    };

}


/*
|--------------------------------------------------------------------------
| User Profile Summary
|--------------------------------------------------------------------------
*/

export async function getProfileSummary(

    userId

){


    const user =

        await User.findById(

            userId

        )

        .populate(

            "role"

        )

        .populate(

            "assignedSites"

        )

        .select(

            "-password"

        );



    if(!user){


        throw new Error(

            "User not found"

        );

    }



    return {


        personal:{


            firstName:

                user.firstName,


            lastName:

                user.lastName,


            email:

                user.email,


            phone:

                user.phone,


            avatar:

                user.avatar


        },


        role:

            user.role,


        sites:

            user.assignedSites,


        activity:{


            lastLogin:

                user.lastLogin,


            created:

                user.createdAt


        }


    };

}


/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {


    createUser,


    getUserByEmail,


    getUserById,


    getUsers,


    updateUser,


    updateProfile,


    changePassword,


    assignSitesToUser,


    removeSiteAssignment,


    activateUser,


    deactivateUser,


    deleteUser,


    restoreUser,


    permanentlyDeleteUser,


    searchUsers,


    getUsersByRole,


    getUsersBySite,


    updateLastLogin,


    getUserStatistics,


    userExists,


    hasSiteAccess,


    getPaginatedUsers,


    bulkActivateUsers,


    bulkDeactivateUsers,


    bulkDeleteUsers,


    exportUsers,


    getUserPermissionSummary,


    getProfileSummary

};