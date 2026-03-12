const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");

// Create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "alldatas",
  password: "Sarthak@2011",
});

//Inserting new user data into the database but creating it manually using an array of values
// let q="INSERT INTO  user (id,username,email,password) values (?,?,?,?)";
// let users = [1,"username1","email1@example.com","password1"];
// try {
//   connection.query(q, users, (err, results) => {
//     if (err) throw err;
//     console.log(results);
//   });
// } catch (err) {
//   console.log(err);
// }

//connection.end();

// generating random user data using faker
let getRandomUser = function () {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

//Inserting new 10 users data into the database but creating it randomly using faker library
let q = "INSERT INTO user (id, username, email, password) VALUES ?";
let data = [];
for (let i = 0; i < 10; i++) {
  data.push(getRandomUser());
}

try {
  connection.query(q, [data], (err, results) => {
    if (err) throw err;
    console.log(results);
  });
} catch (err) {
  console.log(err);
}

connection.end();
