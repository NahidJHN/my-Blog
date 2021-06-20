const router = require("express").Router();

const { allPostgetController } = require("../controllers/postController");
router.get("/", allPostgetController);

module.exports = router;
