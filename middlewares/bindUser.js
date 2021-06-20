const User = require("../model/User");

const bindUser = async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return next();
    }
    try {
        const user = await User.findById(req.session.user._id);
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
    }
};
module.exports = bindUser;
