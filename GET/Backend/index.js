const express = require('express');

const app = express();
const port = 8080;


// middleware to read form data
app.use(express.urlencoded({ extended: true }));
//express willa automatically parse the url encoded form data and make it available in req.body

app.use(express.json());    
// middleware to read json data
// express will automatically parse the json data and make it available in req.body

app.get('/register', (req, res) => {
    let {user, password} = req.query;
  res.send(`GET request to /register with user: ${user}, password: ${password}`);
})

app.post('/register', (req, res) => {
    console.log(req.body); // this will give undefined unless you use a body parser middleware

  res.send('standard POST request to /register');
})


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
