const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys:["testkey"]
}));


function generateRandomString() {
  let randomString = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++)
    randomString += possible.charAt(Math.floor(Math.random() * possible.length));
  return randomString;
};


function urlsForUser(id) {
  let smallDatabase = {};
  for (var key in urlDatabaseNew) {
    if (urlDatabaseNew[key].userId === id) {
      smallDatabase[key] = urlDatabaseNew[key];
    }
  }
  return smallDatabase;
};


const users = {
  'user1': {
    id: 'user1',
    email: 'jeff@example.com',
    password: bcrypt.hashSync('nutella', 10)
  },
  'user2': {
    id: 'user2',
    email: 'mandy@example.com',
    password: bcrypt.hashSync('ginger', 10)
  },
  'user3': {
    id: 'user3',
    email: 'angela@example.com',
    password: bcrypt.hashSync('congee', 10)
  },
  'user4': {
    id: 'user4',
    email: 'frank@example.com',
    password: bcrypt.hashSync('1234', 10)
  }
};


let urlDatabaseNew = {
  'b2xVn2': {
    shortURL: 'b2xVn2',
    longURL: 'http://www.lighthouselabs.ca',
    userId: 'user1'
  },
  '9sm5xK': {
    shortURL: '9sm5xK',
    longURL: 'http://www.google.com',
    userId: 'user2'
  }
};

app.get('/', (req, res) => {
  res.render('urls_home');
});

app.get('/', (req, res) => {
  res.redirect('/register');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
    if (req.session['user_id']) {
      let smallDatabase = urlsForUser(req.session['user_id']);
      let templateVars = { //when sending vars to an ejs template, need to send them in object, even if only one variable
        smallDatabase: smallDatabase,
        userId: users[req.session['user_id']]
        };
      res.render('urls_index', templateVars);
    } else {
      res.status(403).send('YOU SHALL NOT PASS! Please log in first.');
  }
});

app.get('/urls/new', (req, res) => {
  let userId = req.session['user_id']
  let templateVars = {
    userId: users[req.session['user_id']]
  };
  if (!req.session['user_id']) {
    res.redirect('/login');
  } else {
  res.render('urls_new', templateVars);
  }
});

app.get('/urls/:id', (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    userId: users[req.session['user_id']]
  };
  res.render('urls_show', templateVars)
});

app.get("/u/:shortURL", (req, res) => {
  let shortURLKey = req.params['shortURL'];
  let longURL = urlDatabaseNew[shortURLKey].longURL;
  res.redirect(longURL);
});

app.post('/urls', (req, res) => {
  let randomString = generateRandomString();
    urlDatabaseNew[randomString] = [randomString];
    urlDatabaseNew[randomString].userId = req.session['user_id'];
    urlDatabaseNew[randomString].longURL= req.body.longURL;
    urlDatabaseNew[randomString].shortURL = [randomString];
  res.redirect('/urls');
});

app.post('/urls/:id', (req, res) => {
  urlDatabaseNew[req.params.id].longURL = req.body.longURL;
  res.redirect('/urls');
});

app.post('/urls/:id/delete', (req, res) => {
  let userId = req.session['user_id']
  let shortURL = req.params.id
  if (urlDatabaseNew[shortURL].userId === userId) {
    delete urlDatabaseNew[shortURL];
      return res.redirect('/urls');
  } else {
    return res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  res.render('login', users);
});

app.get('/register', (req, res) => {
  res.render('urls_register', users);
});

app.post('/login', (req, res) => {
  let {email, password} = req.body;
  if (!email || !password)
    return res.status(400).send('YOU SHALL NOT PASS! Enter in text field.');
  for (let key in users) {
    bcrypt.compareSync(password, users[key].password);
      req.session['user_id'] = key;
      return res.redirect('/urls');
  }
  res.status(403).send('YOU SHALL NOT PASS! Wrong password/email.');
});

app.post('/register', (req, res) => {
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(400).send('YOU SHALL NOT PASS! Enter in text field.');
  } else{ //in the else block when the Email and Password are not blank

    //check for the User email if it already exists
    var flag = false;
    for(var key in users){
      if(users[key].email===email){
        flag = true;
      }
    }
    if(flag) { //means the email already exists
       res.status(400).send('Email already exists. Please try using another email.');
    } else{ //email does not exist
      //Create a new user

      let userId = generateRandomString();
          users[userId] = {
            id: [userId],
            email: email,
            password: hashedPassword
      };
      req.session['user_id'] = userId;
      res.redirect('/urls');

    }
  }
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Tinyapp listening on port ${PORT}!`);
});