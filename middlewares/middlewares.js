const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const setLocal = require("./localMiddleware");
const bindUser = require("./bindUser");
const mongoStore = require("connect-mongodb-session")(session);
const favicon = require("serve-favicon");
const path = require("path");

//Database URI
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_USER_PASSWORD}@cluster0.wdhdb.mongodb.net/myBlog`;

const store = new mongoStore({
    uri: MONGO_URI,
    collection: "session",
    expires: 1000 * 60 * 60 * 24 * 30,
});
const middleares = [
    express.static("public"),
    express.urlencoded({ extended: true }),
    express.json(),
    //session setup
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30,
        },
        store,
    }),
    flash(),
    bindUser,
    setLocal,
    favicon(path.join(__dirname, "../public", "/images/favicon.ico")),
];

module.exports = (app) => {
    app.use(middleares);
};
