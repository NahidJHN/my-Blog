const authRoutes = require("./authRoute");
const dashboardRoutes = require("./dashboardRoutes");
const homePageRoute = require("./homepageRoutes");
const uploadRoutes = require("./uploadRoutes");
const postRouter = require("./postRoutes");
const apiRoutes = require("../api/routers/apiRouters");
const profileRoutes = require("./profileRoutes");
const routers = [
    {
        path: "/auth",
        handler: authRoutes,
    },
    {
        path: "/profile",
        handler: profileRoutes,
    },
    {
        path: "/post",
        handler: postRouter,
    },
    {
        path: "/api",
        handler: apiRoutes,
    },

    {
        path: "/dashboard",
        handler: dashboardRoutes,
    },
    {
        path: "/upload",
        handler: uploadRoutes,
    },
    {
        path: "/",
        handler: homePageRoute,
    },
];

module.exports = (app) => {
    routers.forEach((r) => {
        app.use(r.path, r.handler);
    });
};
