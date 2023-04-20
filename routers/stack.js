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

    // post에도 새로운 데이터 추가

    const newPost = {
      _id:
        new Date().toString().replace(/[(대한민국표준시)| ]/g, "") +
        (bookIdCount + 1).toString(),
      no: bookIdCount + 1,
      title,
      author,
      publisher,
      date,
      detail,
      quoteList: [],
    };

    await db.collection("post").insertOne(newPost);

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

router.get("/detail/:no", async (req, res) => {
  try {
    const token = req.header("authorization");
    const { _id } = jwt.verify(token, JWT_SECRET_KEY);
    const { db } = req.app;
    const { no } = req.params;
    const post = await db.collection("post").findOne({ no: Number(no) });

    return res.json(post);
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

router.delete("/detail/:no", async (req, res) => {
  try {
    const token = req.header("authorization");
    const { _id } = jwt.verify(token, JWT_SECRET_KEY);
    const { db } = req.app;
    const { no } = req.params;

    const { posts, bookCount } = await db.collection("login").findOne({ _id });
    let { stackList } = posts[posts.length - 1];
    stackList = stackList.filter((book) => book.no !== Number(no));
    posts[posts.length - 1].stackList = stackList;
    await db
      .collection("login")
      .updateOne({ _id }, { $set: { posts, bookCount: bookCount - 1 } });
    await db.collection("post").deleteOne({ no: Number(no) });

    return res.json({ result: "success" });
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

router.post("/detail/quote/create", async (req, res) => {
  try {
    const token = req.header("authorization");
    const tokenId = jwt.verify(token, JWT_SECRET_KEY)._id;
    const { db } = req.app;
    const { no, body } = req.body;

    const { _id, quoteList } = await db.collection("post").findOne({ no });

    body._id =
      new Date().toString().replace(/[(대한민국표준시)| ]/g, "") +
      quoteList.length;
    quoteList.push(body);

    await db.collection("post").updateOne({ _id }, { $set: { quoteList } });

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

router.post("/detail/quote/delete", async (req, res) => {
  try {
    const token = req.header("authorization");
    const tokenId = jwt.verify(token, JWT_SECRET_KEY)._id;
    const { db } = req.app;
    const { no, _id } = req.body;
    const post = await db.collection("post").findOne({ no: Number(no) });
    const nextQuoteList = post.quoteList.filter((v) => v._id !== _id);
    await db
      .collection("post")
      .updateOne({ _id: post._id }, { $set: { quoteList: nextQuoteList } });

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
