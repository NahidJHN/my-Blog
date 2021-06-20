const Post = require("../../model/Post");

const likesController = async (req, res, next) => {
    if (!req.user) {
        req.flash("error", "You must login for like, dislike and comment");
        return res.redirect("/auth/login");
    }

    const postId = req.params.postId;
    const userID = req.user._id;

    let liked = null;
    const post = await Post.findById(postId);
    if (post.dislikes.includes(req.user._id)) {
        await Post.findOneAndUpdate({
            _id: postId,
        }, {
            $pull: {
                dislikes: userID,
            },
        });
    }

    if (post.likes.includes(req.user._id)) {
        await Post.findOneAndUpdate({
            _id: postId
        }, {
            $pull: {
                likes: userID,
            },
        });
        liked = false;
    } else {
        await Post.findOneAndUpdate({
            _id: postId,
        }, {
            $push: {
                likes: userID,
            },
        });
        liked = true;
    }

    let updatedPost = await Post.findById(postId);

    res.status(200).json({
        liked,
        totalLiked: updatedPost.likes.length,
        totalDisLiked: updatedPost.dislikes.length,
    });
};

const disLikesController = async (req, res, next) => {
    if (!req.user) {
        req.flash("error", "You must login for like, dislike and comment");
        return res.redirect("/auth/login");
    }

    const postId = req.params.postId;
    const userID = req.user._id;

    let disLiked = null;
    const post = await Post.findById(postId);

    if (post.likes.includes(req.user._id)) {
        await Post.findOneAndUpdate({
            _id: postId,
        }, {
            $pull: {
                likes: userID,
            },
        });
    }

    if (post.dislikes.includes(req.user._id)) {
        await Post.findOneAndUpdate({
            _id: postId,
        }, {
            $pull: {
                dislikes: userID,
            },
        });
        disLiked = false;
    } else {
        await Post.findOneAndUpdate({
            _id: postId,
        }, {
            $push: {
                dislikes: userID,
            },
        });
        disLiked = true;
    }

    let updatedPost = await Post.findById(postId);

    res.status(200).json({
        disLiked,
        totalLiked: updatedPost.likes.length,
        totalDisLiked: updatedPost.dislikes.length,
    });
};

module.exports = {
    likesController,
    disLikesController,
};
