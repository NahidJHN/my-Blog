const Post = require("../../model/Post");
const Comment = require("../../model/Comment");

const commentPostController = async (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({
            error: "Your are not authenticated User",
        });
    }

    const postId = req.params.postId;
    const { body } = req.body;
    const comment = new Comment({
        post: postId,
        user: req.user._id,
        body,
        replies: [],
    });
    try {
        const createdComment = await comment.save();
        await Post.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $push: {
                    comment: createdComment._id,
                },
            }
        );

        const commentJSON = await Comment.findById(createdComment._id).populate("user");

        return res.status(201).json(commentJSON);
    } catch (e) {
        res.status(500).json({
            error: "Server error Occured",
        });
    }
};

module.exports = commentPostController;
