const User = require("../model/User");
const Profile = require("../model/Profile");
const fs = require("fs");
const profilePicsUploadController = async (req, res, next) => {
    try {
        if (req.file) {
            let profilePics = `/uploads/${req.file.filename}`;
            if (req.user.profilePics && req.user.profilePics !== "/uploads/default.png") {
                await fs.promises.unlink(`public${req.user.profilePics}`);
            }

            await Profile.findOneAndUpdate(
                {
                    user: req.user._id,
                },
                {
                    $set: {
                        profilePics,
                    },
                }
            );

            await User.findOneAndUpdate(
                {
                    _id: req.user._id,
                },
                {
                    $set: {
                        profilePics,
                    },
                }
            );

            res.status(200).json({
                profilePics,
            });
        } else {
            res.status(500).json({
                profilePics: req.user.profilePics,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            profilePics: req.user.profilePics,
        });
    }
};

module.exports = profilePicsUploadController;
