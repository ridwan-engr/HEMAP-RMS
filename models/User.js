import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const refreshTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        _id: false
    }
);

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
            minlength: 8,
            select: false
        },

        phone: {
            type: String,
            default: ""
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

        refreshTokens: [refreshTokenSchema],

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

userSchema.pre("save", async function () {

    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 12);

});

userSchema.methods.comparePassword = function (password) {

    return bcrypt.compare(password, this.password);

};

export default mongoose.model("User", userSchema);