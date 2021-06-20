const moment = require("moment")

const setLocal = (req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.warningMsg = req.flash("warning");
    res.locals.user = req.user
    res.locals.moment = time => moment(time).fromNow()
    res.locals.truncate = text => {
        if (text.length <= 100) return text

        return text.substr(0, 200) + "..."
    }
    next();
};

module.exports = setLocal;