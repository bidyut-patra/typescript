import express = require('express');
import crypto = require('crypto');
import bodyParser = require('body-parser');
import queryString = require('querystring');

import { MongoAccess } from './data-access/mongo-access';

const app: express.Application = express();
const mongo = new MongoAccess();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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

app.use('/node', function(req, res) {
    res.send("NodeJS API");
});

app.use('/blocks', function(req, res) {
    mongo.GetBlocks().then(value => {
        res.send(value);
    });
});

app.use('/connections', function(req, res) {
    mongo.GetConnections().then(value => {
        res.send(value);
    });
});

app.use('/data/api/login', function(req, res) {
    const loginData = req.body;
    console.log(loginData);
    const sessionId = getSessionId();
    console.log(sessionId);
    mongo.FindUser(loginData.user, true).then(user => {
        if (user && user.roles) {
            console.log(user.roles);
            mongo.CreateSession(loginData.user, sessionId).then(sessionCreated => {
                if (sessionCreated) {
                    console.log('session created');
                    const encryptedUserToken = encryptUser(user.email);
                    console.log(encryptedUserToken);
                    res.send({
                        userToken: encryptedUserToken,
                        sessionId: sessionId,
                        roles: user.roles
                    });
                } else {
                    res.send({
                        userToken: undefined,
                        sessionId: undefined,
                        roles: []
                    });
                }        
            });
        } else {
            res.send({
                userToken: undefined,
                sessionId: undefined,
                roles: []
            });
        }
    });
});

app.use('/data/api/owners', function(req, res) {
    mongo.GetOwners().then(owners => {
        console.log(owners);
        if (owners) {
            res.send(owners);
        }
    });
});

app.use('/data/api/paymenttypes', function(req, res) {
    mongo.GetPaymentTypes().then(paymentTypes => {
        console.log(paymentTypes);
        if (paymentTypes) {
            res.send(paymentTypes);
        }
    });
});

app.use('/data/api/transactiontypes', function(req, res) {
    mongo.GetTransactionTypes().then(transactionTypes => {
        console.log(transactionTypes);
        if (transactionTypes) {
            res.send(transactionTypes);
        }
    });
});

app.use('/data/api/transaction', function(req, res) {
    const transactionData = req.body;
    mongo.SaveTransaction(transactionData).then(transaction => {
        console.log(transaction);
        if (transaction) {
            res.send(transaction);
        }
    });
});

app.use('/data/api/payment', function(req, res) {
    const qStr = req.url.substr(req.url.indexOf('?') + 1);
    const queryStrObj = queryString.parse(qStr);
    console.log('queryStr: ', queryStrObj);
    const sessionId = <string>queryStrObj.session;
    const userToken = <string>queryStrObj.user;
    console.log('userToken: ' + userToken);
    const userName = decryptUser(userToken);

    mongo.FindUser(userName, false).then(user => {
        if (req.method === 'GET') {
            const paymentId = req.params['paymentId'];
            if (paymentId) {

            } else {
                res.send({
                    number: user.numer,
                    name: user.name,
                    email: user.email,
                    contact: user.contact                    
                })
            }
        } else {
            const paymentData = req.body;
            mongo.SavePayment(paymentData).then(payment => {
                console.log(payment);
                if (payment) {
                    res.send(payment);
                }
            });
        }
    })    
});

app.use('/data/api/payments', function(req, res) {
    mongo.GetPayments().then(payments => {
        console.log(payments);
        if (payments) {
            res.send(payments);
        }
    });
});

function getSessionId(): string {
    return crypto.randomBytes(16).toString('base64');
}

function encryptUser(user: string): string {
    const cipher = crypto.createCipher('aes-128-cbc', 'd#ffd@gh!');
    let encryptedUserToken = cipher.update(user, 'utf8', 'hex')
    encryptedUserToken += cipher.final('hex');
    return encryptedUserToken;
}

function decryptUser(userToken: string) {
    const cipher = crypto.createDecipher('aes-128-cbc', 'd#ffd@gh!');
    let decryptedUserToken = cipher.update(userToken, 'hex', 'utf8')
    decryptedUserToken += cipher.final('utf8');
    return decryptedUserToken;    
}

app.listen(3000, function() {
    console.log('Listening on port 3000...');
});