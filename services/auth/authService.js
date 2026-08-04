import User from "../../models/User.js";
import Role from "../../models/Role.js";

import {
    generateAccessToken,
    generateRefreshToken
} from "./tokenService.js";

import {
    comparePassword,
    validatePassword
} from "./passwordService.js";

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/

export async function register(userData) {

    const {
        email,
        password
    } = userData;

    const existing = await User.findOne({ email });

    if (existing) {
        throw new Error("Email already exists.");
    }

    const validation = validatePassword(password);

    if (!validation.valid) {
        throw new Error(validation.errors.join(" "));
    }

    const role = await Role.findById(userData.role);

    if (!role) {
        throw new Error("Invalid role.");
    }

    const user = await User.create(userData);

    const result = user.toObject();

    delete result.password;

    return result;
}

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export async function login(email, password) {

    const user = await User.findOne({ email })
        .select("+password")
        .populate("role");

    if (!user) {
        throw new Error("Invalid email or password.");
    }

    if (!user.isActive) {
        throw new Error("User account is disabled.");
    }

    const isMatch = await comparePassword(
        password,
        user.password
    );

    if (!isMatch) {
        throw new Error("Invalid email or password.");
    }

    user.lastLogin = new Date();

    await user.save();

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    const result = user.toObject();

    delete result.password;

    return {
        user: result,
        accessToken,
        refreshToken
    };
}

/*
|--------------------------------------------------------------------------
| Refresh Token
|--------------------------------------------------------------------------
*/

export async function refresh(user) {

    return generateAccessToken(user);

}

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

export async function me(userId) {

    return User.findById(userId)
        .populate("role")
        .populate("assignedSites");

}

export default {
    register,
    login,
    refresh,
    me
};