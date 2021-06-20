const router = require("express").Router();
const { isAthenticate } = require("../middlewares/authenticationMiddleware");

const { body } = require("express-validator");

const {
    editProfileGetController,
    editProfilePostController,
    profileGetController,
} = require("../controllers/profileController");

const upload = require("../middlewares/uploadMiddleware");

const profileValidator = require("../validator/createProfileValidator");

const editProfileUploadController = require("../controllers/editProfileUploadController");

router.get("/edit-profile", isAthenticate, editProfileGetController);

router.post(
    "/edit-profile/uploadPics",
    isAthenticate,
    upload.single("uploadImage"),
    editProfileUploadController
);
router.post(
    "/edit-profile",
    isAthenticate,
    profileValidator,
    body("username")
        .not()
        .isEmpty()
        .withMessage("Please enter your name")
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters long "),

    editProfilePostController
);
router.get("/:id", profileGetController);

module.exports = router;
