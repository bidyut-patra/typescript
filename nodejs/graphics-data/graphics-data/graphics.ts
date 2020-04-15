import express = require('express');
import { MongoAccess } from '../data-access/mongo-access';

export function configureGraphicsApi(app: express.Application, mongo: MongoAccess) {
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
}