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
    const { posts } = await db
      .collection("login")
      .findOne({ _id })
      .catch(() => res.status(200).json({ error: "no such id" }));

    res.json(posts);
  } catch (err) {
    console.log(err);
    if (err.message === "jwt expired") {
      res.status(419).json({ error: "Token Expired" });
    }
    if (err.message === "invalid token") {
      res.status(401).json({ error: "Invalid Token" });
    }
    res.status(500).json({ result: "server error" });
  }
});

module.exports = router;
