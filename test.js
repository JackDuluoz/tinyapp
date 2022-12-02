const bcrypt = require("bcryptjs");

const password = "toenails"
const hashedPassword = bcrypt.hashSync(password, 10)
console.log(hashedPassword)

const password1 = ""
const hashedPassword1 = bcrypt.hashSync(password1, 10)
console.log(hashedPassword1)