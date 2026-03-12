const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const Chat = require("./models/chat.js");

main()
  .then(() => {
    console.log(`Connected to MongoDB successfully`);
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/whatsapp");
}
let allChats = [
  {
    from: "Alice",
    to: "Bob",
    msg: "Hello Bob! How are you?",
    created_at: new Date(),
  },
  {
    from: "Ashu",
    to: "Sarika",
    msg: "Hello Sarika! How are you?",
    created_at: new Date(),
  },
];
Chat.insertMany(allChats);