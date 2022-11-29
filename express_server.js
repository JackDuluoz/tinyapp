const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs")

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls", (request, response) => {
  const templateVars = { urls: urlDatabase };
  response.render("urls_index", templateVars);
});

app.get("/urls/:id", (request, response) => {
  const templateVars = { id: request.params.id, longURL: urlDatabase[request.params.id] };
  response.render("urls_show", templateVars);
});

app.get("/", (request, response) => {
  response.send("Welome to the page!");
});

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase);
});

app.get("/hello", (request, response) => {
  response.send("<html><body>No More Hello <b>World, K?</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`New app listening on port ${PORT}:`);
});