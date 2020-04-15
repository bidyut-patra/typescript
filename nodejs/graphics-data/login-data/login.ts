import express = require('express');
import queryString = require('querystring');
import crypto = require('crypto');
import { MongoAccess } from '../data-access/mongo-access';

export function configureLoginApi(app: express.Application, mongo: MongoAccess) {
    // Verify if authenticated user has sent the request for data
    app.use(function(req, res, next) {
        if (req.url.endsWith('/data/api/login')) {
            next();
        } else {
            const qStr = req.url.substr(req.url.indexOf('?') + 1);
            const queryStrObj = queryString.parse(qStr);
            console.log('queryStr: ', queryStrObj);
            const sessionId = <string>queryStrObj.session;
            const userToken = <string>queryStrObj.user;
            console.log('userToken: ' + userToken);
            const userName = decryptUser(userToken);
        
            mongo.FindUser(userName, false).then(user => {
                if (user) {
                    req.body.user = user;
                    next();
                } else {
                    res.send({
                        error: 'invalid user'
                    });
                }
            });
        }
    });

    app.use('/data/api/login', function(req, res) {
        const loginData = req.body;
        console.log(loginData);
        mongo.FindUser(loginData.user, true).then(user => {
            if (user && user.roles) {
                console.log(user.roles);
                const sessionId = getSessionId();
                console.log(sessionId);            
                mongo.CreateSession(loginData.user, sessionId).then(sessionCreated => {
                    if (sessionCreated) {
                        console.log('session created');
                        const encryptedUserToken = encryptUser(user.email);
                        console.log(encryptedUserToken);
                        res.send({
                            userToken: encryptedUserToken,
                            sessionId: sessionId,
                            roles: user.roles
                        });
                    } else {
                        res.send({
                            userToken: undefined,
                            sessionId: undefined,
                            roles: []
                        });
                    }        
                });
            } else {
                res.send({
                    userToken: undefined,
                    sessionId: undefined,
                    roles: []
                });
            }
        });
    });    
}

function getSessionId(): string {
    return crypto.randomBytes(16).toString('base64');
}

function encryptUser(user: string): string {
    const cipher = crypto.createCipher('aes-128-cbc', 'd#ffd@gh!');
    let encryptedUserToken = cipher.update(user, 'utf8', 'hex')
    encryptedUserToken += cipher.final('hex');
    return encryptedUserToken;
}

function decryptUser(userToken: string) {
    const cipher = crypto.createDecipher('aes-128-cbc', 'd#ffd@gh!');
    let decryptedUserToken = cipher.update(userToken, 'hex', 'utf8')
    decryptedUserToken += cipher.final('utf8');
    return decryptedUserToken;    
}