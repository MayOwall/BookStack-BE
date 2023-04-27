require("dotenv/config");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { compareHash } = require("../utils");
const { JWT_SECRET_KEY } = process.env;

// 로그인 POST 핸들러
router.post("/", async (req, res) => {
  try {
    const { _id, pw } = req.body;
    const { db } = req.app;
    const userData = await db
      .collection("login")
      .findOne({ _id })
      .catch(() => res.status(500).json({ result: "error" }));
    const isPwCorrect = await compareHash(pw, userData.pw);

    // 아이디가 존재하지 않을 때
    if (!userData) {
      res.status(200).json({ result: "no id" });
      return;
    }

    // pw가 일치하지 않을 때
    if (!isPwCorrect) {
      res.status(200).json({ result: "uncorrect pw" });
      return;
    }

    //jwt 발급
    const token = jwt.sign({ _id: userData._id }, JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    //성공여부 및 jwt 응답
    res.json({
      result: "success",
      token,
    });
  } catch (err) {
    // 에러 발생시
    console.log(err);
    res.status(500).json({ result: "error" });
  }
});

module.exports = router;
