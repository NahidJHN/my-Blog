const User = require("../model/User");
const fs = require("fs");
const profilePicsUploadController = async (req, res, next) => {
    let profilePics = req.user.profilePics;

    try {
        if (req.file) {
          if (req.user.profilePics !== "/uploads/default.png") {
                await fs.promises.unlink(`public${profilePics}`);
            }
            await User.findOneAndUpdate(
                {
                    _id: req.user._id,
                },
                {
                    $set: {
                        profilePics: `/uploads/${req.file.filename}`,
                    },
                },
                {
                    new: true,
                }
            );

            let newUser =await User.findOne({ _id: req.user._id });

            res.status(200).json({
                profilePics: newUser.profilePics,
            });
        } else {
            res.status(500).json({
                profilePics: req.user.profilePics,
            });
        }
    } catch (e) {
        res.status(500).json({
            profilePics,
        });
    }
};

module.exports = profilePicsUploadController;
