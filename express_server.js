const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { response } = require("express");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString() {
  let result = '';
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for ( var i = 1; i <= 6; i++ ) {
     result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


app.set("view engine", "ejs") ;

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
//redirect the shortened url to the long url
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);  
});

//new urls
app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
  };
  res.render("urls_new",templateVars);
});
//shortened url
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL, 
    longURL:urlDatabase[req.params.shortURL],
    username: req.cookies["username"],
  };
  res.render("urls_show", templateVars);
  
});

//show all the urls
app.get("/urls", (req, res) => {
  let templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"],
   };
  res.render("urls_index", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
  //send a more userfriendly message here when it's deleted
});



app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls');
 
});


app.post("/login", (req, res) => {
  //var value = res.body.username;
  //grab the vaalue in the input
  //assign it to a cookie
  const user = req.body.username;
  res.cookie('username',user);
  res.redirect('/urls');  
 
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');  
 
});

app.post("/urls", (req, res) => {
  //generate string;
  let shortURL = generateRandomString();
  //add to object
  //maybe do checks here later
  urlDatabase[shortURL] = req.body.longURL;
  //redirect
  //check if the url has value
  res.redirect('/urls/' + shortURL);  
 
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});