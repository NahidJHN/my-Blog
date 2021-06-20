const router = require("express").Router();
const { isAthenticate } = require("../middlewares/authenticationMiddleware");

const upload = require("../middlewares/uploadMiddleware");
const {
    createPostGetController,
    createpostPostController,
    allPostgetController,
    getSinglePostController,
    editPostGetController,
    postEditPostController,
    deletePostController,
} = require("../controllers/postController");

const postValidation = require("../validator/postValidator");

const searchController = require("../controllers/searchController");

router.get("/search", searchController);


router.get("/create-post", isAthenticate, createPostGetController);

router.get("/all-post", allPostgetController);

router.post(
    "/create-post",
    isAthenticate,
    upload.single("postPhoto"),
    postValidation,
    createpostPostController
);

router.get("/:id", getSinglePostController);
router.get("/delete/:id", isAthenticate, deletePostController);

router.get("/edit-post/:id", isAthenticate, editPostGetController);
editPostGetController,
    
    router.post(
        "/edit-post/:id",
        isAthenticate,
        upload.single("postPhoto"),
        postValidation,
        postEditPostController
    );


module.exports = router;
