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
    var allowedOrigins = ['http://localhost:4200', 'http://localhost:4300'];
    var origin = <string>req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
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

configureLoginApi(app, mongo);
configureAptApi(app, mongo);
configureGraphicsApi(app, mongo);

app.listen(3000, function() {
    console.log('Listening on port 3000...');
});

function loadData() {
    const Fs = require('fs');
    const CsvReadableStream = require('csv-reader');
    const AutoDetectDecoderStream = require('autodetect-decoder-stream');
     
    let inputStream = Fs.createReadStream("Residents.csv")
        .pipe(new AutoDetectDecoderStream({ defaultEncoding: '1255' })); // If failed to guess encoding, default to 1255
     
    // The AutoDetectDecoderStream will know if the stream is UTF8, windows-1255, windows-1252 etc.
    // It will pass a properly decoded data to the CsvReader.
    const owners: any[] = []; 
    inputStream
    .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
    .on('data', function (row: any) {
        const owner: any = {};
        owner.number = parseInt(row[0]);
        owner.name = row[1];
        owner.size = row[2];
        owner.roleId = 2;
        owner.email = '',
        owner.contact = '';
        owners.push(owner);        
    }).on('end', function (data: any) {
        mongo.SaveOwners(owners)
        .then(r => {
            console.log('Saved owners');
        })
    });
}