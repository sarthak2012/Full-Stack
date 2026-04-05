const mongose = require("mongoose");
const { Schema } = mongose;
main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
async function main() {
  await mongose.connect("mongodb://localhost:27017/relationDemo");
}

// Creating a schema of  users
const userSchema = new Schema({
  username: String,
  email: String,
});

// Creating a schema of posts of users where one customer can have many(like 1million OR very large) list of POSTS
const postSchema = new Schema({
  content: String,
  Likes: Number,

  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const User = mongose.model("User", userSchema);
const Post = mongose.model("Post", postSchema);

//adding Data
const addData = async () => {
  let user1 = new User({
    username: "John Carter",
    email: "xyz@gmail.com"
  });

  await user1.save();

  let post1 = new Post({
    content: "This is my first post",
    Likes: 10,
    user: user1._id   
  });

  let post2 = new Post({
    content: "This is my second post",
    Likes: 20,
    user: user1._id   
  });

  await post1.save();
  await post2.save();

  console.log("User with multiple posts created");
}
  
addData();
