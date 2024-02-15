require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const app = express();
app.use(cors());

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

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err.message);
})

// Public endpoint
app.get('/', (req, res) => {
    try {
        res.send('Hola, este es un endpoint público!');
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// Protected endpoint
app.get('/protected', checkJwt, (req, res) => {
    try {
        res.send('Hola, este es un endpoint protegido!');
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});


app.listen(4000, () => console.log(`API listening on port ${4000}`));
