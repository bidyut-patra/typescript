"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queryobject_1 = require("../lib/queryobject");
var cryptodata_1 = require("../lib/cryptodata");
function configureLoginApi(app, mongo) {
    // Verify if authenticated user has sent the request for data
    app.use(function (req, res, next) {
        if (req.url.endsWith('/data/api/login')) {
            next();
        }
        else {
            var queryObj = queryobject_1.getQueryData(req.url);
            var sessionId = queryObj.session;
            var userToken = queryObj.user;
            var userName = cryptodata_1.decryptUser(userToken);
            mongo.FindUser(userName, false).then(function (user) {
                if (user) {
                    req.query.user = user;
                    next();
                }
                else {
                    res.send({
                        error: 'invalid user',
                        errorCode: 1000
                    });
                }
            });
        }
    });
    app.use('/data/api/login', function (req, res) {
        var loginData = req.body;
        mongo.FindUser(loginData.user, true).then(function (user) {
            if (user && user.role) {
                var sessionId_1 = cryptodata_1.getSessionId();
                mongo.CreateSession(loginData.user, sessionId_1).then(function (sessionCreated) {
                    if (sessionCreated) {
                        var encryptedUserToken = cryptodata_1.encryptUser(user.email);
                        res.send({
                            userToken: encryptedUserToken,
                            sessionId: sessionId_1,
                            role: user.role
                        });
                    }
                    else {
                        res.send({
                            userToken: undefined,
                            sessionId: undefined,
                            role: undefined
                        });
                    }
                });
            }
            else {
                res.send({
                    userToken: undefined,
                    sessionId: undefined,
                    roles: undefined
                });
            }
        });
    });
}
exports.configureLoginApi = configureLoginApi;
