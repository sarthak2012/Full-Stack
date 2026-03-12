const express = require("express"); // to use express framework for building our server and handling routes
const app = express(); // to create an instance of express and assign it to app variable
const port = 8080;
const path = require("path");// to use path module for joining paths
const { v4: uuidv4 } = require("uuid");// to generate unique ids for our posts
const methodOverride = require('method-override')// to use method override for patch and delete requests
 

app.use(express.urlencoded({ extended: true })); // to parse the body of the request and make it available in req.body
app.use(express.json()); // to parse the body of the request and make it available in req.body
app.set("view engine", "ejs"); // to set the view engine to ejs and render ejs files from views folder
app.set("views", path.join(__dirname, "views"));// to set the views folder as the location for our ejs files
app.use(express.static(path.join(__dirname, "public"))); // to serve static files from the public folder
app.use(methodOverride("_method"));// to use method override for patch and delete requests


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



let posts=[
  {
    id:uuidv4(), // this will generate unique ids for our posts
    username:"John",
    title:"My First Post",
    content:"This is the content of my first post."
  },
  {
    id:uuidv4(), // this will generate unique ids for our posts
    username:"Jane",
    title:"My Second Post",
    content:"This is the content of my second post."
  },
  {
    id:uuidv4(), // this will generate unique ids for our posts
    username:"Doe",
    title:"My Third Post",
    content:"This is the content of my third post."
  }
]
// since we do not use a database, we will use an array to store our posts
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/posts", (req, res) => {
  res.render("index.ejs", { posts });
});
//to get post from index.ejs
app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});
//to get new post from new.ejs and add it to posts array
app.post("/posts", (req, res) => {
  let id = uuidv4(); // generate a unique id for the new post
  let { username, title, content } = req.body;
  posts.push({ id, username, title, content });
  res.redirect("/posts");
});
//to get a single post by id and render it in show.ejs(show individual post)


app.get("/posts/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => p.id === id);
  res.render("show.ejs", { post });
});
//to update a post by id and redirect to posts page

app.patch("/posts/:id", (req, res) => {
  let { id } = req.params;
  let newContent = req.body.content;
  let post = posts.find((p) => p.id === id);
  post.content = newContent;
  res.redirect("/posts");
});
//to get a single post by id and update new content in edit.ejs and redirect to posts page

app.get("/posts/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => p.id === id);
  res.render("edit.ejs" , { post });
  res.redirect("/posts");
});
// to edit a post by id


app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  posts = posts.filter((p) => p.id !== id);
  res.redirect("/posts");
}); 
// to delete a post by id and redirect to posts page by filterimg allt he posts except the one with the id that we want to delete and then reassigning the posts array to the new array without the deleted post
//

