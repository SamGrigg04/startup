const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const DB = require('./database.js');
const { peerProxy } = require('./peerProxy.js');

const authCookieName = 'token';

// The service port. In production the front-end code is statically hosted by the service on the same port.
// Starter code
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the front-end static content hosting
// Starter code
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('username', req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.username, req.body.password);

    setAuthCookie(res, user.token);
    res.send({ username: user.username });
  }
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('username', req.body.username);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      await DB.updateUser(user);
      setAuthCookie(res, user.token);
      res.send({ username: user.username });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
    DB.updateUserRemoveAuth(user);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// GetLocalScores
apiRouter.get('/localScores', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  const scores = await DB.getLocalHighScores(user.username);
  res.send(scores);
});

// SubmitLocalScore
apiRouter.post('/localScore', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  const scores = await updateLocalScores({ ...req.body, name: user.username });
  res.send(scores);
});

// GetGlobalScores
apiRouter.get('/globalScores', verifyAuth, async (req, res) => {
  const scores = await DB.getGlobalHighScores();
  res.send(scores);
});

// SubmitGlobalScore
apiRouter.post('/globalScore', verifyAuth, async (req, res) => {
  const scores = await updateGlobalScores(req.body);
  res.send(scores);
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// updateScores considers a new score for inclusion in the high scores.
async function updateLocalScores(newScore) {
  // Stores scores as miliseconds for easier comparison
  newScore.time = timeToMs(newScore.time);

  // If they scored perfectly, don't update the leaderboard
  if (newScore.time === 0) {
    return DB.getLocalHighScores(newScore.name);
  }

  await DB.addLocalScore(newScore);
  return DB.getLocalHighScores(newScore.name);
}

async function updateGlobalScores(newScore) {
  newScore.time = timeToMs(newScore.time);

  // If they scored perfectly, don't update the leaderboard
  if (newScore.time === 0) {
    return DB.getGlobalHighScores();
  }

  await DB.addGlobalScore(newScore);
  return DB.getGlobalHighScores();
}

function timeToMs(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.split(':').map(Number);
  const [min, sec, mil] = parts;
  return min * 60000 + sec * 1000 + mil * 10;
}

async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);

    const user = {
    username: username,
    password: passwordHash,
    token: uuid.v4(),
  };
  await DB.addUser(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  if (field === 'token') {
    return await DB.getUserByToken(value);
  }
  return await DB.getUser(value);
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

peerProxy(httpService);
