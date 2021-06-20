const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profilePics: {
            type: String,
            default:"/uploads/default.png"
        },
        profile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },
    },
    { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
