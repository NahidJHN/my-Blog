const Profile = require("../model/Profile");
const User = require("../model/User");
const { validationResult } = require("express-validator");
const errorFormatter = require("../utils/errorFormatter");

exports.createProfileGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({
            user: req.user._id,
        });
        if (!profile) {
            return res.render("pages/dashboard/createProfile", {
                error: {},
            });
        } else {
            res.redirect("/post/all-post");
        }
    } catch (e) {
        console.log(e);
        next(e);
    }
};

exports.createProfilePostController = async (req, res) => {
    const result = validationResult(req).formatWith(errorFormatter);
    if (!result.isEmpty()) {
        let errors = result.mapped();
        return res.render("pages/dashboard/createProfile", {
            error: errors,
        });
    }

    const { profileTitle, profileBio, websiteLink, facebookLink, twitterLink, githubLink } =
        req.body;

    try {
        const profile = new Profile({
            user: req.user._id,
            title: profileTitle,
            bio: profileBio,
            links: {
                website: websiteLink,
                facebook: facebookLink,
                twitter: twitterLink,
                github: githubLink,
            },
        });

        const createProfile = await profile.save();
        await User.findOneAndUpdate(
            {
                _id: req.user._id,
            },
            {
                $set: {
                    profile: createProfile._id,
                },
            }
        );
        req.flash("success", "profile created successfull");
        res.redirect("/post/all-post");
    } catch (error) {
        console.log(error);
    }
};
