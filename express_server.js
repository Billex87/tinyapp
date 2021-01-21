const { getUserByEmail, generateRandomString, urlsForUser } = require('./helpers');
const express = require("express");
const PORT = 8080;
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['secret key'],maxAge: 24 * 60 * 60 * 1000}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
  "theHair": {
    id: "theHair",
    email: "donald@trump.com",
    password: "dtrump"
  }
};

// Read Routes
app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_register", templateVars);
});
app.get("/login", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_login", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});
app.get("/urls", (req, res) => {
  const id = req.session["user_id"];
  const user = users[req.session["user_id"]];
  console.log(urlDatabase);
  console.log(id);
  const templateVars = {
    urls: urlsForUser(id, urlDatabase),
    user
  };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  const user = users[req.session["user_id"]]
  const templateVars = {
    user
  };
  if (!user) {
    res.redirect('/login')
  };
  res.render("urls_new", templateVars);
});
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.session["user_id"]]
  };
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
    id: newUserRandomID,
    email: req.body.email,
    password: hashedPassword
  };
  console
  req.session.user_id = newUserRandomID;
  res.redirect('/urls');
});
app.post("/login", (req, res) => {
  const user = getUserByEmail(req.body.email, users);
  if (!user) {
    res.status(403).send('Email Not Found');
    return;
  } console.log(req.body.email);
    console.log(user.password);
    const passwordGood = bcrypt.compareSync(req.body.password, user.password);
    console.log(passwordGood);
  if (!passwordGood) { 
    res.status(403).send('Incorrect Password');
    return;
  }
  req.session.user_id = user.id;
  return res.redirect('/urls');
});
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});
app.post("/urls", (req, res) => {
  const id = req.session.user_id;
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL, userID: id };
  res.redirect(`/urls/${shortURL}`);
});
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id]['longURL'] = req.body.longURL;
  res.redirect("/urls");
});
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

//Listen DO NOT TOUCH
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userDb = urlsForUser(req.session.user_id, urlDatabase);
  if (req.params.shortURL in userDb) {
    delete urlDatabase[req.params.shortURL];
  } else {
    res.status(403).send("You Must Login To Delete\n");
  }
  res.redirect("/urls");
});
