const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('Test1'); // creates a database called "Test1"
const userCollection = db.collection('user'); // creates a collection in the database to store users
const localScoreCollection = db.collection('localScore'); // creates a collection in the database to store local scores
const globalScoreCollection = db.collection('globalScore'); // creates a collection in the database to store global scores

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(username) {
  return userCollection.findOne({ username: username });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ username: user.username }, { $set: user });
}

async function updateUserRemoveAuth(user) {
  await userCollection.updateOne({ username: user.username }, { $unset: { token: 1 } });
}

async function addLocalScore(localScore) {
  return localScoreCollection.insertOne(localScore);
}

function getLocalHighScores() {
  const query = { time: { $gt: -1} };

  // sorts largest to smallest with a limit of 10
  const options = {
    sort: { time: 1 },
    limit: 10,
  };

  // runs the query on scoresCollection and returns an iterator over the results
  const cursor = localScoreCollection.find(query, options);

  // turns the cursor into an array
  return cursor.toArray();
}

async function addGlobalScore(globalScore) {
  return globalScoreCollection.insertOne(globalScore);
}

function getGlobalHighScores() {
  const query = { time: { $gt: -1} };

  // sorts smallest to largest with a limit of 10
  const options = {
    sort: { time: 1 },
    limit: 10,
  };

  // runs the query on scoresCollection and returns an iterator over the results
  const cursor = globalScoreCollection.find(query, options);

  // turns the cursor into an array
  return cursor.toArray();
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  updateUserRemoveAuth,
  addLocalScore,
  getLocalHighScores,
  addGlobalScore,
  getGlobalHighScores,
};
