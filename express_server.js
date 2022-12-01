const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080;

//

// This function generates a random string (length 6) of alphanumeric characters
// to use as a short URL.
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
    password: "123"
  },
  user1a: {
    id: "user1a",
    email: "user1a@gmail.com",
    password: "qwe"
  }
};

const urlDatabase = {
  'b2xVn2': "http://www.lighthouselabs.ca",
  '9sm5xK': "http://www.google.com"
};

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
  const templateVars = { urls: urlDatabase, currentUser: userDatabase[currentUser] };
  // console.log(userDatabase)
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let currentUser = req.cookies["user_id"]
  const templateVars = { urls: urlDatabase, currentUser: userDatabase[currentUser] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let currentUser = req.cookies["user_id"] 
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], currentUser: userDatabase[currentUser] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL
  const shortURL = shortURLGenerator()
  urlDatabase[shortURL] = longURL
  res.redirect(`/urls/${shortURL}`)
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.id
  delete urlDatabase[shortURL]
  res.redirect('/urls')
})

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id
  delete urlDatabase[shortURL]
  urlDatabase[shortURL] = req.body.longURL
  res.redirect('/urls')
})

app.get('/login', (req, res) => {
  let currentUser = req.cookies["user_id"]
  const templateVars = { urls: urlDatabase, currentUser: userDatabase[currentUser] };
  res.render("urls_login", templateVars)
})

app.post('/login', (req, res) => {
  let email = req.body.email
  let password = req.body.password
  for (let user in userDatabase) {
    if (email === userDatabase[user].email && password === userDatabase[user].password) {
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
  res.render("urls_register", templateVars)
});

app.post('/register', (req, res) => {
  const id = shortURLGenerator()
  const newEmail = req.body.email
  const newPassword = req.body.password
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
  userDatabase[id] = { id: id, email: newEmail, password: newPassword }
  res.cookie("user_id", id)
  console.log(`Added Cookie: ${id}`)
  res.redirect('/urls');
})

app.listen(PORT, () => {
  console.log(`New app listening on port ${PORT}:`);
});