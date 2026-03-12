const expres = require('express');
const path = require('path');
const app = expres();
const port = 8080;

app.set('view engine', 'ejs');

//set view engine to ejs so that we can use ejs templates to render html pages
// now we can create a folder called views in the root directory of our project and inside that folder we can create a file called index.ejs
// in that file we can write html code and we can use ejs syntax to embed javascript code in it 
app.set('views', path.join(__dirname, '/views'));
// set the views directory to the path of the views folder that we created
// __dirname is a global variable that gives the absolute path of the current directory
// path.join() is a method that joins two or more path segments and returns a normalized path
// so we are joining the current directory with the views folder to get the absolute path of the views folder
app.get('/', (req, res) => {
  res.render("home.ejs");
});

app.get('/rollDice', (req, res) => {
  res.render("rolldice.ejs");
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
