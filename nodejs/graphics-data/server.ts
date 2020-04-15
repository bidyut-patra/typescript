import express = require('express');
import bodyParser = require('body-parser');

import { MongoAccess } from './data-access/mongo-access';
import { configureGraphicsApi } from './graphics-data/graphics';
import { configureAptApi } from './apt-data/apt';
import { configureLoginApi } from './login-data/login';

const app: express.Application = express();
const mongo = new MongoAccess();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure request & response messages
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Pass to next layer of middleware
    next();
});

configureLoginApi(app, mongo);
configureAptApi(app, mongo);
configureGraphicsApi(app, mongo);

app.listen(3000, function() {
    console.log('Listening on port 3000...');
});