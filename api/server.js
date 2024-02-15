const express = require('express');
const cors = require('cors');
const { expressjwt } = require('express-jwt');
const jwks = require('jwks-rsa');
const axios = require('axios');

const app = express();
app.use(cors());

//Middleware to validate the token
const verifyJwt = expressjwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-spdnexpuf8hzfcfu.us.auth0.com/.well-known/jwks.json'
    }),
    audience: 'unique identifier',
    issuer: 'https://dev-spdnexpuf8hzfcfu.us.auth0.com/',
    algorithms: ['RS256'],
}).unless({path: ['/']});

app.use(verifyJwt);


app.get('/', (req,res) => {
    res.send("Hola desde la ruta principal / index");
});

app.get('/protected', async(req,res) => {
    try{
        const accessToken = req.headers.authorization.split(' ')[1];
        const response = await axios.get('https://dev-spdnexpuf8hzfcfu.us.auth0.com/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const userInfo = response.data;
        // console.log(userInfo);
        res.send(userInfo);
    }
    catch(error){
        res.status(500).send(error.message);
    }
});

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || 'Internal Server Error';
    res.status(status).send(message);
});

app.listen(4000, () => console.log("Server on port 4000"))