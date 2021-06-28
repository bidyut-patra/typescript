import express = require('express');
import bodyParser = require('body-parser');

import { MongoAccess } from './data-access/mongo-access';
import { configureGraphicsApi } from './graphics-data/graphics';
import { configureAptApi } from './apt-data/apt';
import { configureLoginApi } from './login-data/login';
import { InitExcelData } from './apt-data/init-excel-data';
import { AppSettings } from './appsettings-reader';

const app: express.Application = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

AppSettings.initialize().then(() => {
    // Configure request & response messages
    app.use(function (req, res, next) {
        // Website you wish to allow to connect
        var allowedOrigins = AppSettings.Origins;
        var origin = <string>req.headers.origin;
        if(allowedOrigins.indexOf(origin) > -1) {
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
    
    const mongo = new MongoAccess();
    configureLoginApi(app, mongo);
    configureAptApi(app, mongo);
    configureGraphicsApi(app, mongo);

    app.listen(process.env.PORT, function() {
        if (AppSettings.PopulateData) {
            console.log("Populating data into the database.");
            const initData = new InitExcelData(mongo);
            initData.initialize().then(() => {
                console.log("Data populated into the database.");
            })
        } else {
            console.log("Database upto date");
        }
        console.log(`Listening on port ${process.env.PORT}.`);  
    });
});



