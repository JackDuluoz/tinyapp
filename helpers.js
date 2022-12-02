
// This function generates a random string of 6 alphanumeric characters.
const shortURLGenerator = function() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  while (randomString.length < 6) {
    randomString += characters[Math.floor(Math.random() * characters.length)];
  }
  return randomString;
};

// This function determines whether a form submitted e-mail already exists in the database.
const getUserByEmail = function(submittedEmail, existingDatabase) {
  let user = undefined;
  for (let account in existingDatabase) {
    if (existingDatabase[account].email === submittedEmail) {
      user = (existingDatabase[account].id);
    }
  }
  return user;
};

// This function returns only the URLs that belong to the user account.
const urlsForUser = function(accountID, database) {
  let userURLs = {};
  for (let url in database) {
    if (accountID === database[url].userID) {
      userURLs[url] = { longURL: database[url].longURL, userID: accountID };
    }
  }
  return userURLs;
};

module.exports = { shortURLGenerator, getUserByEmail, urlsForUser };