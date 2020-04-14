"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var crypto = require("crypto");
var bodyParser = require("body-parser");
var queryString = require("querystring");
var mongo_access_1 = require("./data-access/mongo-access");
var app = express();
var mongo = new mongo_access_1.MongoAccess();
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
app.use('/node', function (req, res) {
    res.send("NodeJS API");
});
app.use('/blocks', function (req, res) {
    mongo.GetBlocks().then(function (value) {
        res.send(value);
    });
});
app.use('/connections', function (req, res) {
    mongo.GetConnections().then(function (value) {
        res.send(value);
    });
});
app.use('/data/api/login', function (req, res) {
    var loginData = req.body;
    console.log(loginData);
    var sessionId = getSessionId();
    console.log(sessionId);
    mongo.FindUser(loginData.user, true).then(function (user) {
        if (user && user.roles) {
            console.log(user.roles);
            mongo.CreateSession(loginData.user, sessionId).then(function (sessionCreated) {
                if (sessionCreated) {
                    console.log('session created');
                    var encryptedUserToken = encryptUser(user.email);
                    console.log(encryptedUserToken);
                    res.send({
                        userToken: encryptedUserToken,
                        sessionId: sessionId,
                        roles: user.roles
                    });
                }
                else {
                    res.send({
                        userToken: undefined,
                        sessionId: undefined,
                        roles: []
                    });
                }
            });
        }
        else {
            res.send({
                userToken: undefined,
                sessionId: undefined,
                roles: []
            });
        }
    });
});
app.use('/data/api/owners', function (req, res) {
    mongo.GetOwners().then(function (owners) {
        console.log(owners);
        if (owners) {
            res.send(owners);
        }
    });
});
app.use('/data/api/paymenttypes', function (req, res) {
    mongo.GetPaymentTypes().then(function (paymentTypes) {
        console.log(paymentTypes);
        if (paymentTypes) {
            res.send(paymentTypes);
        }
    });
});
app.use('/data/api/transactiontypes', function (req, res) {
    mongo.GetTransactionTypes().then(function (transactionTypes) {
        console.log(transactionTypes);
        if (transactionTypes) {
            res.send(transactionTypes);
        }
    });
});
app.use('/data/api/transaction', function (req, res) {
    var transactionData = req.body;
    mongo.SaveTransaction(transactionData).then(function (transaction) {
        console.log(transaction);
        if (transaction) {
            res.send(transaction);
        }
    });
});
app.use('/data/api/payment', function (req, res) {
    var qStr = req.url.substr(req.url.indexOf('?') + 1);
    var queryStrObj = queryString.parse(qStr);
    console.log('queryStr: ', queryStrObj);
    var sessionId = queryStrObj.session;
    var userToken = queryStrObj.user;
    console.log('userToken: ' + userToken);
    var userName = decryptUser(userToken);
    mongo.FindUser(userName, false).then(function (user) {
        if (req.method === 'GET') {
            var paymentId = req.params['paymentId'];
            if (paymentId) {
            }
            else {
                res.send({
                    number: user.numer,
                    name: user.name,
                    email: user.email,
                    contact: user.contact
                });
            }
        }
        else {
            var paymentData = req.body;
            mongo.SavePayment(paymentData).then(function (payment) {
                console.log(payment);
                if (payment) {
                    res.send(payment);
                }
            });
        }
    });
});
app.use('/data/api/payments', function (req, res) {
    mongo.GetPayments().then(function (payments) {
        console.log(payments);
        if (payments) {
            res.send(payments);
        }
    });
});
function getSessionId() {
    return crypto.randomBytes(16).toString('base64');
}
function encryptUser(user) {
    var cipher = crypto.createCipher('aes-128-cbc', 'd#ffd@gh!');
    var encryptedUserToken = cipher.update(user, 'utf8', 'hex');
    encryptedUserToken += cipher.final('hex');
    return encryptedUserToken;
}
function decryptUser(userToken) {
    var cipher = crypto.createDecipher('aes-128-cbc', 'd#ffd@gh!');
    var decryptedUserToken = cipher.update(userToken, 'hex', 'utf8');
    decryptedUserToken += cipher.final('utf8');
    return decryptedUserToken;
}
app.listen(3000, function () {
    console.log('Listening on port 3000...');
});
