"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var mongo_access_1 = require("./data-access/mongo-access");
var graphics_1 = require("./graphics-data/graphics");
var apt_1 = require("./apt-data/apt");
var login_1 = require("./login-data/login");
var init_excel_data_1 = require("./apt-data/init-excel-data");
var appsettings_reader_1 = require("./appsettings-reader");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
appsettings_reader_1.AppSettings.initialize().then(function () {
    // Configure request & response messages
    app.use(function (req, res, next) {
        // Website you wish to allow to connect
        var allowedOrigins = appsettings_reader_1.AppSettings.Origins;
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
    var mongo = new mongo_access_1.MongoAccess();
    login_1.configureLoginApi(app, mongo);
    apt_1.configureAptApi(app, mongo);
    graphics_1.configureGraphicsApi(app, mongo);
    app.listen(process.env.PORT, function () {
        if (appsettings_reader_1.AppSettings.PopulateData) {
            console.log("Populating data into the database.");
            var initData = new init_excel_data_1.InitExcelData(mongo);
            initData.initialize().then(function () {
                console.log("Data populated into the database.");
            });
        }
        else {
            console.log("Database upto date");
        }
        console.log("Listening on port " + process.env.PORT + ".");
    });
});
