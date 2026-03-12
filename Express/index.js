const express = require("express");
//we need to require expresse
const app = express();
//this express is a function that gives someting in  return and we can sore that value in a variable called app

// this app is an object
// console.dir(app);

// the most usefull one is app.listen() which lstens to a port and host and incoming request
// it uses two perameters one of which is port number and the other is a callback function that runs when the server starts
// so first we define the port number
// Ports are the logical endpoints of a network connection that is used to exchange information between a web server and a web client.
const port = 8080;

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
//() callback function is an anonymous function that runs when the server starts
//node index.js to run the server

// app.use((req, res) => {
//   console.log('Received a request');
//   res.send('this is a basic reponse from the server');
// });

//it listen all type of request be it get post or any aother on any url and it will run the callback function that we passed to it
// so when we run the server and send a request to it we will see the message 'Received a request' in the console and we will get the response 'this is a basic reponse from the server' in the browser

app.get("/", (req, res) => {
  res.send("you contacted base url");
});

app.get("/about", (req, res) => {
  res.send("you contacted about page");
});

app.get(/.*/, (req, res) => {
  res.send("Page not found");
});
// it will match any get request that does not match the above two routes
// so if we send a get request to any other url other than / and /about we will get the response 'this page does not exist'

app.get("/search", (req, res) => {
  console.log(req.query);
  res.send("no results");
});
// req.query is an object that contains the query parameters of the request
// so if we send a request to /search?term=javascript&sort=asc we will get the following object in the console
// { term: 'javascript', sort: 'asc' }
// we can use these query parameters to filter the results from a database or an array
