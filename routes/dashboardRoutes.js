const router = require("express").Router();
const {
    isAthenticate
} = require("../middlewares/authenticationMiddleware");

const createProfileValidator = require("../validator/createProfileValidator");

const {
    createProfileGetController,
    createProfilePostController,
} = require("../controllers/dashBoardController");

router.get("/create-profile", isAthenticate, createProfileGetController);

router.post("/create-profile", isAthenticate, createProfileValidator, createProfilePostController);

module.exports = router;