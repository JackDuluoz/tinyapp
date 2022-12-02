
const express = require("express");
const cookieParser = require('cookie-parser')
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080;

//

// This function generates a random string of 6 alphanumeric characters.
function shortURLGenerator() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let randomString = ""
  while (randomString.length < 6) {
    randomString += characters[Math.floor(Math.random() * characters.length)]
  }
  return randomString
}

const userDatabase = {
  admin1: {
    id: "admin1",
    email: "greenmr1995@gmail.com",
    password: bcrypt.hashSync("123", 10)
  },
  user1a: {
    id: "user1a",
    email: "user1a@gmail.com",
    password: bcrypt.hashSync("qwe", 10)
  }
};

const urlDatabase = {
  'b2xVn2': {
    longURL: "http://www.lighthouselabs.ca",
    userID: "admin1"
  },
  '9sm5xK': {
    longURL: "http://www.google.com",
    userID: "user1a"
  }
}

const urlsForUser = function (id) {
  let userURLs = {}
  for (let url in urlDatabase) {
    if (id === urlDatabase[url].userID) {
      userURLs[url] = { longURL: urlDatabase[url].longURL, userID: id }
    }
  }
  return userURLs
}

// MiddleWare

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// Routes

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  let currentUser = req.cookies["user_id"]
  const templateVars = { urls: urlsForUser(currentUser), currentUser: userDatabase[currentUser] };
  console.log("------------------------------------------")
  console.log("USERS", userDatabase)
  console.log("------------------------------------------")
  console.log("URLs", urlDatabase)
  console.log("------------------------------------------")
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let currentUser = req.cookies["user_id"]
  const templateVars = { urls: urlDatabase, currentUser: userDatabase[currentUser] };
  if (currentUser === undefined) {
    res.redirect('/login')
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let currentUser = req.cookies["user_id"] 
  const templateVars = { id: req.params.id, longURL: urlsForUser(currentUser)[req.params.id], urls: urlsForUser(currentUser), currentUser: userDatabase[currentUser] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  let currentUser = req.cookies["user_id"]
  if (currentUser === undefined) {
    console.log("You must be logged in to do that.")
    res.send("You must be logged in to do that.")
    return
  }
  const longURL = req.body.longURL
  const shortURL = shortURLGenerator()
  urlDatabase[shortURL] = { longURL: longURL, userID: currentUser }
  console.log(urlDatabase)
  res.redirect(`/urls/${shortURL}`)
});

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id
  for (let url in urlDatabase) {
    console.log(url)
    if (url === shortURL) {
      console.log("Match")
      res.redirect(urlDatabase[shortURL].longURL)
      return
    }
  }
  console.log("URL Not in Database")
  res.statusCode = 400
  res.sendStatus(400)
});

app.post("/urls/:id/delete", (req, res) => {
  const inspect = require('util').inspect;
  const shortURL = req.params.id
  let currentUser = req.cookies["user_id"] 
  if (inspect(urlDatabase[shortURL]) === inspect(urlsForUser(currentUser)[shortURL])) {
    delete urlDatabase[shortURL]
  }
  res.redirect('/urls')
})

app.post("/urls/:id", (req, res) => {
  const inspect = require('util').inspect;
  const shortURL = req.params.id
  let currentUser = req.cookies["user_id"] 
  if (inspect(urlDatabase[shortURL]) === inspect(urlsForUser(currentUser)[shortURL])) {
    delete urlDatabase[shortURL]
    urlDatabase[shortURL] = { longURL: req.body.longURL, userID: currentUser }
  }
  res.redirect('/urls')
})

app.get('/login', (req, res) => {
  let currentUser = req.cookies["user_id"]  
  const templateVars = { urls: urlDatabase, currentUser: userDatabase[currentUser] };
  if (currentUser !== undefined) {
    res.redirect('/urls')
  }
  res.render("urls_login", templateVars)
})

app.post('/login', (req, res) => {
  let email = req.body.email
  let password = req.body.password
    for (let user in userDatabase) {
      if (email === userDatabase[user].email && (bcrypt.compareSync(password, userDatabase[user].password) === true)) {
      console.log("Credentials Match")
      res.cookie("user_id", userDatabase[user].id)
      res.redirect('/urls');
    }
  }      
  console.log("User Not Found")
  res.statusCode = 403
  res.sendStatus(403)
})

app.post('/logout', (req, res) => {
  let currentUser = req.cookies["user_id"]
  res.clearCookie("user_id", currentUser)
  console.log(`Deleted Cookie: ${currentUser}`)
  res.redirect('/login');
})

app.get("/register", (req, res) => {
  let currentUser = req.cookies["user_id"]
  const templateVars = { urls: urlDatabase, currentUser: userDatabase[currentUser] };
  if (currentUser !== undefined) {
    res.redirect('/urls')
  }
  res.render("urls_register", templateVars)
});

app.post('/register', (req, res) => {
  const id = shortURLGenerator()
  const newEmail = req.body.email
  const newPassword = req.body.password
  const hashedNewPassword = bcrypt.hashSync(newPassword, 10)
  if (newEmail === "" || newPassword === "") {
    res.statusCode = 400
    res.sendStatus(400)
  }
  for (let user in userDatabase) {
    if (newEmail === userDatabase[user].email) {
      console.log(user)
      res.statusCode = 400  
      res.sendStatus(400)
      return
    }  
  }  
  userDatabase[id] = { id: id, email: newEmail, password: hashedNewPassword }
  res.cookie("user_id", id)
  console.log(`Added Cookie: ${id}`)
  res.redirect('/urls');
})

app.listen(PORT, () => {
  console.log(`New app listening on port ${PORT}:`);
});