const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const Path = require("path");
const methodOverride = require("method-override");

// Middleware

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", Path.join(__dirname, "/views"));

// DB connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "alldatas",
  password: "Sarthak@2011", // learning only
});

// Generate random user
const getRandomUser = () => [
  faker.string.uuid(),
  faker.internet.username(),
  faker.internet.email(),
  faker.internet.password(),
];

// Home route
app.get("/", (req, res) => {
  let q = "SELECT COUNT(*) FROM project;";
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      let count = results[0]["COUNT(*)"];
      res.render("home.ejs", { count: count });
    });
  } catch (err) {
    console.log(err);
    res.send("Error fetching data");
  }
});

// Route to display all users
app.get("/user", (req, res) => {
  let q = "SELECT * FROM project;";
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      res.render("showUsers.ejs", { results });
    });
  } catch (err) {
    console.log(err);
    res.send("Error fetching data");
  }
});

//Edit user route
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM project WHERE id = "${id}";`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      let actualuser = results[0];
      res.render("edit.ejs", { actualuser });
      console.log(actualuser);
    });
  } catch (err) {
    console.log(err);
    res.send("Error fetching data");
  }
});

// Update user(DB) route
app.patch("/user/:id/", (req, res) => {
  let { id } = req.params;
  //search in the user with the id
  let { password: formPassword, username: newUser } = req.body;

  let q = `SELECT * FROM project WHERE id = "${id}";`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      let user = results[0];

      //check if the password is correct or not
      if (formPassword !== user.password) {
        return res.send("Incorrect password");
      }
      else {
        //update the username in the database
        let updateQuery = `UPDATE project SET username = "${newUser}" WHERE id = "${id}";`;

        connection.query(updateQuery, (err, results) => {
          if (err) throw err;
            res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Error updating user");
  }
});

// Start server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

// Inserting new 10 users data into the database but creating it randomly using faker library
// let q = "INSERT INTO Project (id, username, email, password) VALUES ?";
// let data = [];
// for (let i = 0; i < 10; i++) {
//   data.push(getRandomUser());
// }

// try {
//   connection.query(q, [data], (err, results) => {
//     if (err) throw err;
//     console.log(results);
//   });
// } catch (err) {
//   console.log(err);
// }
// connection.end();
