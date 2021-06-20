const Profile = require("../model/Profile");
const User = require("../model/User");
const { validationResult } = require("express-validator");
const errorFormatter = require("../utils/errorFormatter");

const profileGetController = async (req, res, next) => {
    let id=req.params.id
    try {
        const profile = await Profile.findOne({ user: id }).populate({
            path: "user",
            select: "name profilePics email",
        });
        if (profile) {
            res.render("pages/dashboard/userProfile", {
                profile,
                pageName: "profile",
                title: profile.user.name,
            });
        } else {
            req.flash("warning", "Please create a profile")
            res.redirect("/dashboard/create-profile")
        }
    } catch (e) {
        console.log(e);
        next(e);
    }
};

const editProfileGetController = async (req, res, next) => {
    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
        req.flash("You have no profile create one ");
        return res.redirect("/dashboard/create-profile");
    }

    res.render("pages/dashboard/editProfile", {
        error: "",
        title: "Edit your profile",
        pageName: "editProfile",
        profile,
    });
};

const editProfilePostController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id });
        const result = validationResult(req).formatWith(errorFormatter);
        if (!result.isEmpty()) {
            let errors = result.mapped();
            return res.render("pages/dashboard/editProfile", {
                error: errors,
                title: "Error edit profile",
                pageName: "editProfile",
                profile,
            });
        }

        const {
            profileTitle,
            profileBio,
            websiteLink,
            facebookLink,
            twitterLink,
            githubLink,
            username,
        } = req.body;

        await User.findOneAndUpdate(
            { _id: req.user._id },
            {
                $set: {
                    name: username,
                },
            }
        );
        await Profile.findOneAndUpdate(
            { user: req.user._id },
            {
                $set: {
                    title: profileTitle,
                    bio: profileBio,
                    links: {
                        website: websiteLink,
                        facebook: facebookLink,
                        twitter: twitterLink,
                        github: githubLink,
                    },
                },
            }
        );
        req.flash("success", "profile updated successfull");
        res.redirect("/profile/"+req.user._id);
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    editProfileGetController,
    editProfilePostController,
    profileGetController,
};
