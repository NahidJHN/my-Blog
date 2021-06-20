const { body } = require("express-validator");

module.exports = [
    body("postTitle")
        .not()
        .notEmpty()
        .withMessage("Post title cannot be empty")
        .isLength({ max: 50 })
        .withMessage("post title must be less then 50 character"),

    body("postBody").not().notEmpty().withMessage("Please write your post"),

    body("postTags")
        .not()
        .notEmpty()
        .withMessage("Please provide tags")
        .isLength({ max: 50 })
        .withMessage("tags must be less than 50 character"),
];
