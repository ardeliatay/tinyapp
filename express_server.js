const express = require('express');
const app = express();
const PORT = 8080; //this is a default port
const bodyParser = require('body-parser');

//tells express app to use EJS as its templating engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


function generateRandomString() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

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
  let randomString = generateRandomString();
  urlDatabase[randomString] = req.body.longURL
  console.log(req.body.longURL);
  //.post usually uses .body
  // res.send('Ok');
  res.send(`http://localhost:${PORT}/urls/${[randomString]}`);
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.get("/u/:shortURL", (req, res) => {
  //:shortURL is the key to req.params
  //req.params accesses database of {'shortURL': ___}
  //.get usually uses .params
  let shortURLKey = req.params['shortURL'];
  let longURL = urlDatabase[shortURLKey];
  res.redirect(longURL);
});

app.get('/urls/:id', (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    urls: urlDatabase
  };

  res.render('urls_show', templateVars)
});

app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
})

// app.get('/hello', (req, res) => {
//   res.send('<html><body>Hello <b>World</b></body></html>\n');
// });


app.listen(PORT, () => {
  console.log(`Tinyapp listening on port ${PORT}!`);
});