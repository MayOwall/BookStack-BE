require("dotenv/config");
const cors = require("cors");
const bodyParser = require("body-parser");
const { PORT, MONGODB_ID, MONGODB_PASSWORD } = process.env;

// MongoDB
const mongoClient = require("mongodb").MongoClient;
const express = require("express");
const app = express();

app.use(cors());
app.use(bodyParser.json());

let db;

mongoClient.connect(
  `mongodb+srv://${MONGODB_ID}:${MONGODB_PASSWORD}@cluster0.sjgsexl.mongodb.net/bookstack?retryWrites=true&w=majority`,
  (err, client) => {
    if (err) throw err;
    db = client.db("bookstack");

    app.listen(PORT, () => {
      console.log("📡 BookStack BE is working");
    });
  }
);

app.route("/").get((req, res) => res.send("Hello, Bookstack 📚"));

app.route("/signup").get((req, res) => {
  res.send("signup");
});

app.route("/signup").post((req, res) => {
  const { id, pw, pwConfirm, nickname } = req.body;
  res.send("signup");
});
