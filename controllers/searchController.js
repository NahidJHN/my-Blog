const Post = require("../model/Post");

const searchController = async (req, res, next) => {
    const q = req.query.q;
    const currentPage = req.query.page || 1;
    const itemPerPage = 10;
    try {
        let posts = await Post.find({
            $text: {
                $search: q,
            },
        })
            .skip(itemPerPage * currentPage - itemPerPage)
            .limit(itemPerPage);

        let totalPost = await Post.countDocuments({
            $text: {
                $search: q,
            },
        });

        let totalPage = totalPost / itemPerPage;

        res.render("pages/post/searchPage", {
            title: "Search result for " + q,
            posts,
            itemPerPage,
            totalPage,
            currentPage,
            q,
            pageName:""
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
};

module.exports = searchController;
