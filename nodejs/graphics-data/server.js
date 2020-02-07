"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var mongo_access_1 = require("./data-access/mongo-access");
var app = express();
var mongo = new mongo_access_1.MongoAccess();
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
app.listen(3000, function () {
    console.log('Listening on port 3000...');
});
