//User,profilePics, bio,title,links{fb,twirter},Posts[],bookmarks[]
const { Schema, model } = require("mongoose");

const profileSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            trim: true,
            maxLength: 100,
        },
        bio: {
            type: String,
            trim: true,
            maxLength: 500,
        },
        links: {
            website: String,
            facebook: String,
            twitter: String,
            github: String,
        },
        posts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        bookmarks: [
            {
                type: Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
    },
    { timestamps: true }
);

let profile = model("Profile", profileSchema);
module.exports = profile;
