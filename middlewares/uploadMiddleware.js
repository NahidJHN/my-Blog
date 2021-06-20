const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
    fileFilter: function (req, file, cb) {
        const type = /.jpg|.jpeg|.png|.gif/;
        const fileName = type.test(path.extname(file.originalname).toLowerCase());
        const mimeType = type.test(file.mimetype);

        if (fileName && mimeType) {
            cb(null, true);
        } else {
            new Error("Invalid file format");
        }
    },
});

module.exports = upload;