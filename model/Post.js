//title,body,author,tags,thumbnail,readtime,like,dislike,comments

const { Schema, model } = require("mongoose");

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxLength: 100,
        },
        body: {
            type: String,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        tags: {
            type: [String],
            required: true,
        },
        thumbnail: String,
        readTime: String,
        likes: [Schema.Types.ObjectId],
        dislikes: [Schema.Types.ObjectId],
        comment: [
            {
                type: Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
    },
    { timestamps: true }
);

postSchema.index(
    {
        title: "text",
        tags: "text",
        body: "text",
    },
    {
        weight: {
            title: 10,
            tags: 10,
            body: 10,
        },
    }
);
let Post = model("Post", postSchema);

module.exports = Post;
