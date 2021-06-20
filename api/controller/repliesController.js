const Comment = require("../../model/Comment");

const repliesController = async (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({
            error: "Your are not authenticated User",
        });
    }

    const { body } = req.body;

    const { commentId } = req.params;

    let reply = {
        user: req.user._id,
        body,
    };

    try {
        let comment = await Comment.findOneAndUpdate(
            {
                _id: commentId,
            },
            {
                $push: {
                    replies: reply,
                },
            }
        );

        return res.status(201).json({
            ...reply,
            profilePics: req.user.profilePics,
            username: req.user.name,
        });
        
    } catch (e) {
        res.status(500).json({
            error: "Server error Occured",
        });
    }
};

module.exports = repliesController;
