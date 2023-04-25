require("dotenv/config");
const cors = require("cors");
const bodyParser = require("body-parser");
const { PORT, MONGODB_ID, MONGODB_PASSWORD } = process.env;

// MongoDB
const mongoClient = require("mongodb").MongoClient;
const express = require("express");
const app = express();

// routers

app.use(cors());
app.use(bodyParser.json());

mongoClient.connect(
  `mongodb+srv://${MONGODB_ID}:${MONGODB_PASSWORD}@cluster0.sjgsexl.mongodb.net/bookstack?retryWrites=true&w=majority`,
  (err, client) => {
    if (err) throw err;
    app.db = client.db("bookstack");

    app.listen(PORT, () => {
      console.log("📡 BookStack BE is working");
    });
  }
);

// signup (회원가입)
const signupRouter = require("./routers/signup");
app.use("/signup", signupRouter);

// signin (로그인)
const signinRouter = require("./routers/signin");
app.use("/signin", signinRouter);

// stack (스택 및 디테일)
const stackRouter = require("./routers/stack");
app.use("/stack", stackRouter);

// image (이미지 업로드)
const imageRouter = require("./routers/image");
app.use("/image", imageRouter);

app.route("/").get((req, res) => res.send("Hello, Bookstack 📚"));
