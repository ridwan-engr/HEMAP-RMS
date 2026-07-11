import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 8
        },

        phone: {
            type: String,
            trim: true
        },

        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            required: true
        },

        assignedSites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Site"
            }
        ],

        refreshTokens: [{
            token: String,
            createdAt: Date,
            expiresAt: Date
        }],
        
        avatar: String,

        isActive: {
            type: Boolean,
            default: true
        },

        lastLogin: Date
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {

        return next();

    }

    this.password = await bcrypt.hash(this.password, 12);

    next();

});

userSchema.methods.comparePassword = async function (password) {

    return bcrypt.compare(password, this.password);

};

export default mongoose.model(
    "User",
    userSchema
);