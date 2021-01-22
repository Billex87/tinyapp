// HELPER FUNCTIONS
// Check If User Email Exists
const getUserByEmail = (email, database) => {
  for (let value in database) {
    if (database[value].email === email) {
      return database[value];
    }
  }
};

// Creates Random String
const generateRandomString = () => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  const length = 6;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// Stores URL Info Under Specific userID
const urlsForUser = (ID, database) => {
  const userDb = {};
  for (let key in database) {
    if (database[key].userID === ID) {
      userDb[key] = {
        longURL: database[key].longURL,
        userID: ID
      };
    }
  } 
  return userDb;
};

module.exports = { getUserByEmail, generateRandomString, urlsForUser };