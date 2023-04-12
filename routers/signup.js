const express = require("express");
const router = express.Router();
const { makeHash } = require("../utils");

router.post("/", async (req, res) => {
  try {
    const { _id, pw, nickname } = req.body;
    const { db } = req.app;
    const isIdExist = await db
      .collection("login")
      .findOne({ _id })
      .catch(() => res.status(500).json({ result: "error" }));

    if (!!isIdExist) {
      // 이미 존재하는 아이디일 경우
      res.status(200).json({ result: "already exist" });
    } else {
      // DB에 없는 새로운 아이디일 경우
      const hashedPw = await makeHash(pw);
      const newAccount = {
        _id,
        pw: hashedPw,
        nickname,
        profileImg: "",
        bookCount: 0,
        posts: [],
      };
      db.collection("login").insertOne(newAccount);
      res.status(200).json({ result: "success" });
    }
  } catch (err) {
    res.status(500).json({ result: "error" });
  }
});

module.exports = router;
