const express = require("express");
const PORT = 8080;
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

function generateRandomString() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  const length = 6;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "1234"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "theHair": {
    id: "theHair",
    email: "donald@trump.com",
    password: "dtrump"
  }
};
app.set("view engine", "ejs");

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
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});
app.get("/urls", (req, res) => {
  
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_new", templateVars);
});
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_show", templateVars);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


//Post Routes
app.post("/register",(req,res)=>{
  let email = req.body.email;
  let password = req.body.password;
  if(email === "" || password === "") {
    res.status(403).send("Field Is Empty");
  } 
  else {
    for (let user in users) {
      if  (email === users[user].email) {
        res.status(400).send("Email Exists");
      }
    }; 
  let id = generateRandomString();
  users[id] = {
    id: id,
    email: email,
    password: password
  }
  res.cookie("user_id",id);
  res.redirect("/urls");
}
});
app.post("/login", (req, res) => {
let email = req.body.email;
  let password = req.body.password;
  let userObject = null;
  for (let value in users) {
    if(email === users[value].email){
      if(password === users[value].password) {
        userObject = users[value];
        res.cookie('user_id', userObject.id);
        res.redirect("/urls");
      } else {
        return res.status(403).send("Incorrect Password");
      } 
    } else {
    return res.status(403).send("Email Not Found");
  }
};
});
app.post("/logout",(req,res)=>{
  res.clearCookie("user_id");
  res.redirect("/urls");
});
app.post("/urls", (req, res) => {
  const longBodyURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longBodyURL;
  console.log(longBodyURL);
  console.log(req.body);
  res.redirect(`/urls/${shortURL}`);
});
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.newLongUrl;
  res.redirect("/urls");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
