const express = require('express');
const app = express();
const PORT = 8080; //this is a default port
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//tells express app to use EJS as its templating engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


function generateRandomString() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

//Object to keep track of URLs and their shortened forms. Want to show this data on URLs page
const users = {
  "user1": {
    id: "user1",
    email: "jeff@example.com",
    password: "nutella"
  },
 "user2": {
    id: "user2",
    email: "mandy@example.com",
    password: "ginger"
  },
  "user3": {
    id: "user3",
    email: "angela@example.com",
    password: "congee"
  },
  "user4": {
    id: "user4",
    email: "frank@example.com",
    password: "1234"
  }
};


let urlDatabaseNew = {
  'b2xVn2': {
    shortURL: 'b2xVn2',
    longURL: 'http://www.lighthouselabs.ca',
    id: 'user1'
  },
  '9sm5xK': {
    shortURL: '9sm5xK',
    longURL: 'http://www.google.com',
    id: 'user2'
  }
};

app.get('/', (req, res) => {
  res.render('urls_home');
});

app.get('/', (req, res) => {
  res.redirect('/register');
});

// app.get('/urls.json', (req, res) => {
//   res.json(urlDatabase);
// });

app.get('/urls', (req, res) => {
  let templateVars = { //when sending vars to an ejs template, need to send them in object, even if only one variable
    urls: urlDatabaseNew,
    userId: users[req.cookies['user_id']]
  };
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  let randomString = generateRandomString();
  urlDatabaseNew[randomString] = req.body.longURL
  console.log(req.body.longURL);
  res.redirect('/urls');
});

app.get('/urls/new', (req, res) => {
  let templateVars = {
    userId: users[req.cookies['user_id']]
  }
  res.render('urls_new', templateVars);
});

app.post('/urls/new', (req, res) => {
  if (userId) {
    return res.redirect('/urls');
  } else {
    return res.redirect('/login');
  }
});

app.get("/u/:shortURL", (req, res) => {
  let shortURLKey = req.params['shortURL'];
  let longURL = urlDatabaseNew[shortURLKey];
  res.redirect(longURL);
});

app.get('/urls/:id', (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    userId: users[req.cookies['user_id']]
  };
  res.render('urls_show', templateVars)
});

app.post('/urls/:id', (req, res) => {
  urlDatabaseNew[req.params.id] = req.body.longURL;
  res.redirect('/urls');
});

app.post('/urls/:id/delete', (req, res) => {
  for (let key in users) {
    if (users[key].id === req.cookies['user_id']) {
      delete urlDatabaseNew[req.params.id];
      res.redirect('/urls');
    } else {
      res.redirect('/login');
    }
  }
});

app.get('/login', (req, res) => {
  res.render('login', users);
});


app.post('/login', (req, res) => {
  let {email, password} = req.body;
  if (!email || !password)
    return res.status(400).send('YOU SHALL NOT PASS!');
  for (let key in users) {
    if (users && users[key].password === password) {
      res.cookie('user_id', users[key].id);
      return res.redirect('/urls');
    } else {
      return res.status(403).send('YOU SHALL NOT PASS!');
    }
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/');
});

app.get('/register', (req, res) => {
  res.render('urls_register', users);
});

app.post('/register', (req, res) => {
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(400).send('YOU SHALL NOT PASS!!!');
  for (let key in users) {
    if (email === email)
      return res.status(400).send('YOU SHALL NOT PASS!');
  }
}
  let userId = generateRandomString();
    users[userId] = {
      id: [userId],
      email: email,
      password: password
    }
  res.cookie('user_id', userId);
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Tinyapp listening on port ${PORT}!`);
});