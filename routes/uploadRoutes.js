const router = require("express").Router();
const upload = require("../middlewares/uploadMiddleware");
const uploadController = require("../controllers/uploadController");
const { isAthenticate } = require("../middlewares/authenticationMiddleware");

router.post("/profile-pics", isAthenticate, upload.single("uploadImage"), uploadController);

module.exports = router;
