"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var mongo_access_1 = require("./data-access/mongo-access");
var graphics_1 = require("./graphics-data/graphics");
var apt_1 = require("./apt-data/apt");
var login_1 = require("./login-data/login");
var app = express();
var mongo = new mongo_access_1.MongoAccess();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Configure request & response messages
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    var allowedOrigins = ['http://localhost:4200', 'http://localhost:4300'];
    var origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
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
login_1.configureLoginApi(app, mongo);
apt_1.configureAptApi(app, mongo);
graphics_1.configureGraphicsApi(app, mongo);
app.listen(3000, function () {
    console.log('Listening on port 3000...');
});
function loadData() {
    var Fs = require('fs');
    var CsvReadableStream = require('csv-reader');
    var AutoDetectDecoderStream = require('autodetect-decoder-stream');
    var inputStream = Fs.createReadStream("Residents.csv")
        .pipe(new AutoDetectDecoderStream({ defaultEncoding: '1255' })); // If failed to guess encoding, default to 1255
    // The AutoDetectDecoderStream will know if the stream is UTF8, windows-1255, windows-1252 etc.
    // It will pass a properly decoded data to the CsvReader.
    var owners = [];
    inputStream
        .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
        .on('data', function (row) {
        var owner = {};
        owner.number = parseInt(row[0]);
        owner.name = row[1];
        owner.size = row[2];
        owner.roleId = 2;
        owner.email = '',
            owner.contact = '';
        owners.push(owner);
    }).on('end', function (data) {
        mongo.SaveOwners(owners)
            .then(function (r) {
            console.log('Saved owners');
        });
    });
}
