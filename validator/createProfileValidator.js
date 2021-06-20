const { body } = require("express-validator");
const validator = require("validator");
// Link validator
function linkValidator(value) {
    if (value) {
        if (!validator.isURL(value)) {
            throw new Error("Please enter a valid URL");
        }
    }
    return true;
}

module.exports = [
    body("profileTitle").not().isEmpty().withMessage("Title can't be empty"),

    body("profileBio").not().isEmpty().withMessage("Please enter something about yourself"),

    body("websiteLink").custom(linkValidator),
    body("facebookLink").custom(linkValidator),
    body("twitterLink").custom(linkValidator),
    body("githubLink").custom(linkValidator),
];
