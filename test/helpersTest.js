const { assert } = require('chai');

const { shortURLGenerator, getUserByEmail, urlsForUser } = require('../helpers');

// 1. Testing shortURLGenerator

describe('shortURLGenerator', function() {
  it('should return a string of length 6', function() {
    const randomString = shortURLGenerator();
    const randomStringLength = randomString.length;
    const expectedLength = 6;
    assert.strictEqual(randomStringLength, expectedLength);
  });
});

// 2. Testing getUserByEmail

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.strictEqual(user, expectedUserID);
  });
});

describe('getUserByEmail', function() {
  it('should return undefined for a non-existent e-mail', function() {
    const user = getUserByEmail("userrrrrr@example.com", testUsers);
    const expectedUserID = undefined;
    assert.strictEqual(user, expectedUserID);
  });
});

// 3. Testing urlsForUser

const urlDatabase = {
  'b2xVn2': {
    longURL: "http://www.lighthouselabs.ca",
    userID: "admin1"
  },
  '9sm5xK': {
    longURL: "http://www.google.com",
    userID: "user1a"
  },
  'hnf7HT': {
    longURL: "http://www.bbc.com",
    userID: "user1a"
  }
};

describe('urlsForUser', function() {
  it('should return from the url database only those urls that belong to the user id as an object', function() {
    const userURLs = urlsForUser("user1a", urlDatabase);
    const expectedURLObject = {
      '9sm5xK': { longURL: 'http://www.google.com', userID: 'user1a' },
      'hnf7HT': { longURL: 'http://www.bbc.com', userID: 'user1a' }
    };
    assert.deepEqual(userURLs, expectedURLObject);
  });
});

describe('urlsForUser', function() {
  it('should return an empty object when no matches are found', function() {
    const userURLs = urlsForUser("user1aaaaaaaaaa", urlDatabase);
    const expectedURLObject = {};
    assert.deepEqual(userURLs, expectedURLObject);
  });
});