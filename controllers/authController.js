const User = require("../model/User");
const Post = require("../model/Post");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const errorFormatter = require("../utils/errorFormatter");

exports.registerGetController = (req, res) => {
    res.render("pages/authPages/register", {
        title: "Register account",
        error: {},
    });
};

exports.registerPostController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const result = validationResult(req).formatWith(errorFormatter);
        if (!result.isEmpty()) {
            let errors = result.mapped();
            return res.render("pages/authPages/register", {
                title: "Register account",
                error: errors,
                message: "",
            });
        }

        const findUser = await User.findOne({
            email,
        });
        if (findUser) {
            req.flash("warning", "This Email has already Used");
            return res.redirect("/auth/register");
        }
        const hash = await bcrypt.hash(password, 10);

        let user = new User({
            name,
            email,
            password: hash,
        });

        await user.save();
        req.flash("success", "Registration Successful you can log in now");
        res.redirect("/auth/login");
    } catch (error) {
        console.log(error);
    }
};

exports.loginGetController = (req, res) => {
    res.render("pages/authPages/login", {
        title: "Account login",
        error: {},
    });
};

exports.loginPostController = async (req, res) => {
    const { email, password } = req.body;
    const result = validationResult(req).formatWith(errorFormatter);
    if (!result.isEmpty()) {
        let errors = result.mapped();
        return res.render("pages/authPages/login", {
            title: "Account login",
            error: errors,
            message: "",
        });
    }

    const findUser = await User.findOne({
        email,
    });
    if (!findUser) {
        req.flash("warning", "Email and password did not match");
        return res.redirect("/auth/login");
    }
    const matchPass = await bcrypt.compare(password, findUser.password);

    if (matchPass) {
        req.session.isLoggedIn = true;
        req.session.user = findUser;

        return res.redirect("/dashboard/create-profile");
    }
    req.flash("warning", "Email and password did not match");
    res.redirect("/auth/login");
};

exports.logoutController = (req, res) => {
    req.session.destroy();
    res.redirect("/auth/login");
};

