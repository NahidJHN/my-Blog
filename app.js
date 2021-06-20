//import Dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const setRouters = require("./routes/routes");
const setMiddlewares = require("./middlewares/middlewares");

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_USER_PASSWORD}@cluster0.wdhdb.mongodb.net/myBlog`;

mongoose.set("useFindAndModify", false);
const app = express();
// set the view engine
app.set("view engine", "ejs");

//set middlewares from middlewares directory
setMiddlewares(app);

//set routes from router directory
setRouters(app);

//404 error handaller
app.use((req, res, next) => {
    let error = new Error("404 page not found");
    error.status = 404;
    next(error);
});

//error hendeler middleware
app.use((error, req, res, next) => {
    if (error.status === 404) {
        return res.render("error/404");
    }
    console.log(error);
});

const PORT = process.env.PORT || 8080;
mongoose.set("useCreateIndex", true);
mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database Connect Successful");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((e) => {
        console.log("Database connection failed");
        console.log(e);
    });
