"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queryString = require("querystring");
var crypto = require("crypto");
function configureLoginApi(app, mongo) {
    // Verify if authenticated user has sent the request for data
    app.use(function (req, res, next) {
        if (req.url.endsWith('/data/api/login')) {
            next();
        }
        else {
            var qStr = req.url.substr(req.url.indexOf('?') + 1);
            var queryStrObj = queryString.parse(qStr);
            console.log('queryStr: ', queryStrObj);
            var sessionId = queryStrObj.session;
            var userToken = queryStrObj.user;
            console.log('userToken: ' + userToken);
            var userName = decryptUser(userToken);
            mongo.FindUser(userName, false).then(function (user) {
                if (user) {
                    req.body.user = user;
                    next();
                }
                else {
                    res.send({
                        error: 'invalid user'
                    });
                }
            });
        }
    });
    app.use('/data/api/login', function (req, res) {
        var loginData = req.body;
        console.log(loginData);
        mongo.FindUser(loginData.user, true).then(function (user) {
            if (user && user.roles) {
                console.log(user.roles);
                var sessionId_1 = getSessionId();
                console.log(sessionId_1);
                mongo.CreateSession(loginData.user, sessionId_1).then(function (sessionCreated) {
                    if (sessionCreated) {
                        console.log('session created');
                        var encryptedUserToken = encryptUser(user.email);
                        console.log(encryptedUserToken);
                        res.send({
                            userToken: encryptedUserToken,
                            sessionId: sessionId_1,
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
}
exports.configureLoginApi = configureLoginApi;
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
