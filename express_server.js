const express = require("express")
const app = express()
const PORT = 8080

const urlDatabase = {
  "Chess": "http://www.chess.com/home",
  "BBC": "http://www.bbc.com/"
}

app.get("/", (request, response) => {
  response.send("Welome to the page!")
})

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase)
})

app.listen(PORT, () => {
  console.log(`New app listening on port ${PORT}:`)
})