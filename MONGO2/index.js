const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

app.set("views",path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const Chat = require("./models/chat.js");


main()
  .then(() => {
    console.log(`Connected to MongoDB successfully`);
  })
   .catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/whatsapp");
}

//Index Route
app.get("/chats", async (req, res) => {
  let chats = await Chat.find({});
  res.render("index", { chats });
});

//New Route
app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
});

//Create Route
app.post("/chats", async (req, res) => {
  let newchat = new Chat({
    from: req.body.from,
    to: req.body.to,
    msg: req.body.msg,
    created_at: new Date()
  });
  await newchat.save();
  res.redirect("/chats");
});

app.get("/", (req, res) => {
  res.send("Hello root!");
});
app.listen(8080, () => {
  console.log(` app listening on port 8080`);
});
