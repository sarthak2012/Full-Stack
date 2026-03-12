const express = require("express");
const mongoose = require("mongoose");

// Connect to MongoDB
main()
  .then((res) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/test");

  const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    age: Number,
  });

  // Create a model based on the schema
  const User = mongoose.model("User", userSchema);

  // Create a new user instance
  const user1 = new User({
    username: "sarthak",
    email: "sarthakkr470@gmail.com",
    age: 23,
  });

  //this user is crrreated but not saved in the database, to save it we need to call the save method
  user1
    .save()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.log(err));
}

//  Create a model based on the schema
// const User = mongoose.model("User", userSchema);
//  Insert multiple users
// Users.insertMany([
//   {
//     username: "sarika",
//     email: "sarika@gmail.com",
//     age: 23,
//   },
//   {
//     username: "sakshi",
//     email: "sakshi@gmail.com",
//     age: 22,
//   },
// ])
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => console.log(err));
