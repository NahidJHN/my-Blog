const router = require("express").Router();

//import the router controller
const {
    registerGetController,
    registerPostController,
    loginGetController,
    loginPostController,
    logoutController,
} = require("../controllers/authController");

//import authentication middleware
const {
    isUnauthenticate
} = require("../middlewares/authenticationMiddleware");

//import auth validator
const {
    registrationvalidator,
    loginValidator
} = require("../validator/authRegistationValidation");



router.get("/register", isUnauthenticate, registerGetController);

router.post("/register", registrationvalidator, registerPostController);

router.get("/login", isUnauthenticate, loginGetController);

router.post("/login", loginValidator, loginPostController);

router.get("/logout", logoutController);

module.exports = router;