const { assert } = require('chai');

const { getUserByEmail, generateRandomString, urlsForUser } = require('../helpers.js');

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
  },
  "theHair": {
    id: "theHair",
    email: "donald@trump.com",
    password: "dtrump"
  }
};
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" },
  Gb023R: { longURL: "https://www.amazon.ca", userID: "theHair" },
  
};

describe('getUserByEmail', function () {
  it('Returns A Registered Users Email', function () {
    const user = getUserByEmail("user@example.com", testUsers);
    assert.isObject(testUsers, "returns a user that exists in database");
  });
  it('Returns Undefined If The Email Is Not Registered', function () {
    const user = getUserByEmail("userTest@example.com", testUsers);
    const expectedOutput = "Undefined";
    assert.isUndefined(user, "Returns Undefined");
  });
});
describe('generateRandomString', function() {
  it('Should Return A 6 Letter String', function() {
    const urlId = generateRandomString()
    assert.equal(urlId.length,6);
  });

});
describe('urlsForUser', function() {
  it('Returns An Empty Array When User Has No Created Short URLs', function() {
    const urls = urlsForUser('user2RandomID', urlDatabase);
    const result = {};
    assert.deepEqual(urls,result);
  });

  it('Returns An Empty Object When Given A Non Registered User', function() {
    const urls = urlsForUser('user3RandomID', urlDatabase);
    const result = {};
    assert.deepEqual(urls,result);
  });
});