const isAthenticate = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/auth/login");
    }
    next();
};

const isUnauthenticate = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect("/post/all-post");
    }
    next();
};

module.exports = {
    isUnauthenticate,
    isAthenticate,
};