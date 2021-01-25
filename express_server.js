const { getUserByEmail, generateRandomString, urlsForUser } = require('./helpers');
const express = require("express");
const PORT = 8080;
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['secret key'],maxAge: 24 * 60 * 60 * 1000}));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
  "theHair": {
    ID: "theHair",
    email: "donald@trump.com",
    password: "dtrump"
  }
};

// Read Routes
app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.sessionOptions.user_ID]
  };
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.sessionOptions.user_ID]
  };
  res.render("urls_login", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.get("/urls", (req, res) => {
  const ID = req.session["user_ID"];
  const user = users[req.session["user_ID"]];
  const templateVars = {
    urls: urlsForUser(ID, urlDatabase),
    user
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.session["user_ID"]];
  const templateVars = {
    user
  };
  if (!user) {
    res.redirect('/login');
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  if (!req.session['user_ID']) {
    res.redirect('/login');
    return;
  };
  const key = req.params.shortURL
  if (urlDatabase[key].userID !== req.session['user_ID']) {
    res.redirect('/login');
    return;
  }
  const templateVars = {
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.session["user_ID"]]
    
  } 
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//Post Routes
app.post("/register", (req, res) => {
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Field Is Empty');
    return;
  }
  const user = getUserByEmail(req.body.email, users);
  if (user) {
    res.status(400).send('Email Exists');
    return;
  }
  const newUserRandomID = generateRandomString();
  users[newUserRandomID] = {
    ID: newUserRandomID,
    email: req.body.email,
    password: hashedPassword
  };
  req.session.user_ID = newUserRandomID;
  res.redirect('/urls');
});

app.post("/login", (req, res) => {
  const user = getUserByEmail(req.body.email, users);
  if (!user) {
    res.status(403).send('Email Not Found');
    return;
  }
  const passwordGood = bcrypt.compareSync(req.body.password, user.password);
  if (!passwordGood) {
    res.status(403).send('Incorrect Password');
    return;
  }
  req.session.user_ID = user.ID;
  return res.redirect('/urls');
});

app.post("/urls", (req, res) => {
  const ID = req.session.user_ID;
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL, userID: ID };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:ID", (req, res) => {
  urlDatabase[req.params.ID].longURL = req.body.longURL;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// Delete
app.post("/urls/:shortURL/delete", (req, res) => {
  const userDb = urlsForUser(req.session.user_ID, urlDatabase);
  if (req.params.shortURL in userDb) {
    delete urlDatabase[req.params.shortURL];
  } else {
    res.status(403).send("You Must Login To Delete\n");
  }
  res.redirect("/urls");
});

//Listen DO NOT TOUCH
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
