const Profile = require("../model/Profile");
const Post = require("../model/Post");
const Comment = require("../model/Comment");
const errorFormatter = require("../utils/errorFormatter");
const { validationResult } = require("express-validator");
const readingTime = require("reading-time");
const moment = require("moment");
const fs = require("fs");

const createPostGetController = async (req, res) => {
    try {
        if (req.user) {
            let profile = await Profile.findOne({
                user: req.user._id,
            });
            if (profile) {
                return res.render("pages/post/createPost", {
                    error: {},
                    title: "create post",
                    successMsg: req.flash("success"),
                    pageName: "createPost",
                });
            } else {
                req.flash(
                    "warning",
                    "To create a post you must have a profile, Please provide these information for create a profile"
                );
                res.redirect("/dashboard/create-profile");
            }
        } else {
            req.flash("warning", "Please login first");
            res.redirect("/auth/login");
        }
    } catch (e) {
        console.log(e);
    }
};

const createpostPostController = async (req, res) => {
    const result = validationResult(req).formatWith(errorFormatter);
    if (!result.isEmpty()) {
        let errors = result.mapped();
        return res.render("pages/post/createPost", {
            error: errors,
            title: "Error creating post",
            pageName: "createPost",
        });
    }

    const { postTitle, postBody, postTags } = req.body;

    let tags = postTags.split(",");

    const postReadTime = readingTime(postBody);
    let createPost = new Post({
        title: postTitle,
        body: postBody,
        author: req.user._id,
        tags,
        thumbnail: "",
        readTime: postReadTime.text,
        likes: [],
        dislikes: [],
        comments: [],
    });

    if (req.file) {
        createPost.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        let post = await createPost.save();
        await Profile.findOneAndUpdate(
            {
                user: req.user._id,
            },
            {
                $push: {
                    posts: post._id,
                },
            }
        );
        req.flash("success", "Post created successfull");
        res.redirect("/post/all-post");
    } catch (e) {
        console.log(e);
    }
};

//filter functionalities
const generateDate = (days) => {
    return moment().subtract(days, "days").toDate();
};

const filterFunction = (filter) => {
    let filterObj = {};
    let order = 1;

    switch (filter) {
        case "week": {
            filterObj = {
                createdAt: {
                    $gt: generateDate(7),
                },
            };
            order = 1;
            break;
        }
        case "month": {
            filterObj = {
                createdAt: {
                    $gt: generateDate(30),
                },
            };
            order = 1;
            break;
        }
        case "all": {
            order = 1;
            break;
        }
        default: {
            order = 1;
        }
    }

    return {
        filterObj,
        order,
    };
};

const allPostgetController = async (req, res) => {
    const filter = req.query.filter || "latest";
    let currentPage = parseInt(req.query.page) || 1;

    const { filterObj, order } = filterFunction(filter);
    let itemPerPage = 10;

    try {
        let posts = await Post.find(filterObj)
            .sort(order === 1 ? "-createdAt" : "createdAt")
            .skip(itemPerPage * currentPage - itemPerPage)
            .limit(itemPerPage)
            .populate("author");

        let totalPost = await Post.countDocuments();
        let totalPage = totalPost / itemPerPage;
        return res.render("pages/post/allPost", {
            title: "My all post",
            pageName: "allPost",
            posts,
            filter,
            currentPage,
            totalPage,
        });
    } catch (error) {
        console.log(error);
    }
};

const deletePostController = async (req, res, next) => {
    const postId = req.params.id;
    try {
        const post = await Post.findOne({
            author: req.user._id,
            _id: postId,
        });

        if (!post) {
            let error = new Error("Page not found");
            error.status = 404;
            throw error;
        }

        await Post.findOneAndDelete({
            _id: postId,
        });
        await Comment.findOneAndDelete({ post: postId });

        await Profile.findOneAndUpdate(
            {
                user: req.user._id,
            },
            {
                $pull: {
                    posts: postId,
                },
            }
        );
        if (post.thumbnail) {
            await fs.promises.unlink(`public${post.thumbnail}`);
        }

        req.flash("success", "Post Deleted Successfully");

        res.redirect("/post/all-post");
    } catch (error) {
        next(error);
    }
};

const getSinglePostController = async (req, res, next) => {
    const id = req.params.id;

    try {
        const posts = await Post.findOne({
            _id: id,
        })
            .populate("author", "name profilePics")
            .populate({
                path: "comment",
                populate: {
                    path: "user",
                    select: "name profilePics",
                },
            })
            .populate({
                path: "comment",
                populate: {
                    path: "replies.user",
                    select: "name profilePics",
                },
            });

        res.render("pages/post/singlePost", {
            title: posts.body.substr(0, 100),
            posts,
            pageName: "",
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const editPostGetController = async (req, res, next) => {
    const id = req.params.id;
    try {
        const post = await Post.findOne({
            author: req.user._id,
            _id: id,
        });

        if (!post) {
            let error = new Error("You are not able to edit this post");
            error.status = 404;
            throw error;
        }

        res.render("pages/post/editPost", {
            title: "Edit your post " + post.body,
            pageName: "editProfile",
            post,
            error: "",
        });
    } catch (error) {
        next(error);
    }
};

const postEditPostController = async (req, res, next) => {
    const id = req.params.id;
    try {
        const post = await Post.findOne({
            _id: id,
        });
        const result = validationResult(req).formatWith(errorFormatter);

        if (!result.isEmpty()) {
            let errors = result.mapped();
            return res.render("pages/post/editPost", {
                error: errors,
                title: "Error updating post",
                pageName: "createPost",
                post,
            });
        }

        let { postTitle, postBody, postTags } = req.body;
        postTags = postTags.split(",");

        const postReadTime = readingTime(postBody);

        let thumbnail = post.thumbnail;
        let findPost;

        if (req.file) {
            await fs.promises.unlink(`public${thumbnail}`);
            thumbnail = `/uploads/${req.file.filename}`;
        }

        findPost = await Post.findOneAndUpdate(
            {
                _id: id,
            },
            {
                $set: {
                    title: postTitle,
                    tags: postTags,
                    body: postBody,
                    readTime: postReadTime.text,
                    author: req.user._id,
                    thumbnail,
                },
            }
        );
        req.flash("success", "Post Updated Successfull");
        res.redirect(`/post/${findPost._id}`);
    } catch (e) {
        console.log(e);
        next(e);
    }
};

module.exports = {
    createPostGetController,
    createpostPostController,
    allPostgetController,
    getSinglePostController,
    editPostGetController,
    deletePostController,
    postEditPostController,
};
