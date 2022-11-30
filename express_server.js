const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs")

function generateRandomString() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let randomString = ""
  while (randomString.length < 6) {
    randomString += characters[Math.floor(Math.random() * characters.length)]
  }
  return randomString
}

const urlDatabase = {
  'b2xVn2': "http://www.lighthouselabs.ca",
  '9sm5xK': "http://www.google.com"
};

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL
  const shortURL = generateRandomString()
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

app.listen(PORT, () => {
  console.log(`New app listening on port ${PORT}:`);
});