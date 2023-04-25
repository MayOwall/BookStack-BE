const express = require("express");
const router = express.Router();
const upload = require("../modules/multer");
const { uploadImage } = require("../controller/image");

router.post("/upload", upload.single("image"), uploadImage);

module.exports = router;
