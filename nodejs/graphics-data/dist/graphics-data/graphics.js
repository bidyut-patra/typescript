"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function configureGraphicsApi(app, mongo) {
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
}
exports.configureGraphicsApi = configureGraphicsApi;
