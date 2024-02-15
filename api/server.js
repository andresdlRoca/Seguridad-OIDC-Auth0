require('dotenv').config();
const express = require('express');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const app = express();

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-spdnexpuf8hzfcfu.us.auth0.com/.well-known/jwks.json`,
  }),
  audience: `unique identifier`,
  issuer: `https://dev-spdnexpuf8hzfcfu.us.auth0.com/`,
  algorithms: ['RS256'],
});

// Public endpoint
app.get('/', (req, res) => {
  res.send('Hello, this is a public endpoint!');
});

// Protected endpoint
app.get('/protected', checkJwt, (req, res) => {
  res.send('Hello, this is a protected endpoint!');
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on port ${port}`));
