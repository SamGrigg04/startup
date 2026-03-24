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

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ email: user.email }, { $set: user });
}

async function updateUserRemoveAuth(user) {
  await userCollection.updateOne({ email: user.email }, { $unset: { token: 1 } });
}

async function addLocalScore(score) {
  return localScoreCollection.insertOne(score);
}

function getLocalHighScores() {
  // gets scores greater than 0 and less than 900
  const query = { score: { $gt: 0, $lt: 900 } };

  // sorts largest to smallest with a limit of 10
  const options = {
    sort: { score: -1 },
    limit: 10,
  };

  // runs the query on scoresCollection and returns an iterator over the results
  const cursor = localScoreCollection.find(query, options);

  // turns the cursor into an array
  return cursor.toArray();
}

async function addGlobalScore(score) {
  return globalScoreCollection.insertOne(score);
}

function getGlobalHighScores() {
  // gets scores greater than 0 and less than 900
  const query = { score: { $gt: 0, $lt: 900 } };

  // sorts largest to smallest with a limit of 10
  const options = {
    sort: { score: -1 },
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
