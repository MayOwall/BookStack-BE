require("dotenv/config");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { JWT_SECRET_KEY } = process.env;

router.get("/", async (req, res) => {
  try {
    const token = req.header("authorization");
    const { _id } = jwt.verify(token, JWT_SECRET_KEY);
    const { db } = req.app;
    const { nickname, profileImg, pageCount, bookCount, posts } = await db
      .collection("login")
      .findOne({ _id })
      .catch(() => res.status(200).json({ error: "no such id" }));

    const nextData = {
      nickname,
      profileImg,
      pageCount,
      bookCount,
      posts,
    };

    return res.json(nextData);
  } catch (err) {
    console.log(err);
    if (err.message === "jwt expired") {
      res.status(200).json({ error: "Token Expired" });
    } else if (err.message === "invalid token") {
      res.status(200).json({ error: "Invalid Token" });
    } else {
      res.status(500).json({ result: "server error" });
    }
  }
});

router.post("/create", async (req, res) => {
  try {
    const token = req.header("authorization");
    const { _id } = jwt.verify(token, JWT_SECRET_KEY);
    const { db } = req.app;

    const { title, author, publisher, date, detail } = req.body;
    const user = await db
      .collection("login")
      .findOne({ _id })
      .catch(() => res.status(200).json({ error: "no such id" }));
    const { posts, bookIdCount } = user;
    const nextData = {
      no: bookIdCount + 1,
      title,
      author,
      publisher,
      date,
      detail,
    };
    posts[posts.length - 1].stackList.push(nextData);
    user.bookCount += 1;
    user.bookIdCount += 1;

    await db.collection("login").updateOne({ _id }, { $set: user });
    res.json({ result: "success" });
  } catch (err) {
    console.log(err);
    if (err.message === "jwt expired") {
      res.status(200).json({ error: "Token Expired" });
    } else if (err.message === "invalid token") {
      res.status(200).json({ error: "Invalid Token" });
    } else {
      res.status(500).json({ result: "server error" });
    }
  }
});
module.exports = router;
