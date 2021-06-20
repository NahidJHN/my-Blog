const router = require("express").Router();

const { isAthenticate } = require("../../middlewares/authenticationMiddleware");

const commentPostController = require("../controller/commentPostController");

const repliesController = require("../controller/repliesController");
const { likesController, disLikesController } = require("../controller/likeDislikeController");

router.post("/comments/:postId", isAthenticate, commentPostController);
router.post("/replies/:commentId", isAthenticate, repliesController);
router.get("/likes/:postId", isAthenticate, likesController);
router.get("/dislikes/:postId", isAthenticate, disLikesController);

module.exports = router;
