const { body } = require("express-validator");
const registrationvalidator = [
    body("name")
        .not()
        .isEmpty()
        .withMessage("Please enter your name")
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters long "),

    body("email").isEmail().withMessage("Please provide a vaild email address").normalizeEmail(),

    body("password")
        .not()
        .isEmpty()
        .withMessage("Password cannot be empty")
        .isLength({ min: 6 })
        .withMessage("Password must be 6 character long")
        .matches(/\d/)
        .withMessage("Password must contain a number"),

    body("confirmPassword")
        .not()
        .isEmpty()
        .withMessage("Password confirmation does not match password")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Password confirmation does not match password");
            }
            return true;
        }),
];

const loginValidator = [
    body("email")
        .not()
        .isEmpty()
        .withMessage("Email cannot be empty")
        .isEmail()
        .withMessage("Email is not valid")
        .normalizeEmail(),
    body("password").not().isEmpty().withMessage("Password cannot be empty"),
];

module.exports = { registrationvalidator, loginValidator };
