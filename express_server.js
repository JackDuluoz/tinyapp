const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs")

const urlDatabase = {
  "Chess": "http://www.chess.com/home",
  "BBC": "http://www.bbc.com/"
};

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