const express = require('express');
const app = express();
const PORT = 8080; //this is a default port
const bodyParser = require('body-parser');

//tells express app to use EJS as its templating engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


//Object to keep track of URLs and their shortened forms. Want to show this data on URLs page
let urlDatabase = {
  'b2xVn2' : 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

//registers a handler on the root path '/'
app.get('/', (req, res) => {
  res.send('Hello!');
});

// app.get('/urls.json', (req, res) => {
//   res.json(urlDatabase);
// });

//render: look up file & .send built in
app.get('/urls', (req, res) => {
  let templateVars = { //when sending vars to an ejs template, need to send them in object, even if only one variable
    urls: urlDatabase
  }
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  console.log(req.body);
  res.send('Ok');
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
})

app.get('/urls/:id', (req, res) => {
  let templateVars = {
    shortURL: urlDatabase
  };
  res.render('urls_show', templateVars)
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});