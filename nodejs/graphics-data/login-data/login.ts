import express = require('express');
import { MongoAccess } from '../data-access/mongo-access';
import { getQueryData } from '../lib/queryobject';
import { getSessionId, decryptUser, encryptUser } from '../lib/cryptodata';

export function configureLoginApi(app: express.Application, mongo: MongoAccess) {
    // Verify if authenticated user has sent the request for data
    app.use(function(req, res, next) {
        if (req.url.endsWith('/data/api/login')) {
            next();
        } else {
            const queryObj = getQueryData(req.url);
            const sessionId = <string>queryObj.session;
            const userToken = <string>queryObj.user;
            const userName = decryptUser(userToken);
        
            mongo.FindUser(userName, false).then(user => {
                if (user) {
                    req.query.user = user;
                    next();
                } else {
                    res.send({
                        error: 'invalid user',
                        errorCode: 1000
                    });
                }
            });
        }
    });

    app.use('/data/api/login', function(req, res) {
        const loginData = req.body;
        mongo.FindUser(loginData.user, true).then(user => {
            if (user && user.role) {
                const sessionId = getSessionId();      
                mongo.CreateSession(loginData.user, sessionId).then(sessionCreated => {
                    if (sessionCreated) {
                        const encryptedUserToken = encryptUser(user.email);
                        res.send({
                            userToken: encryptedUserToken,
                            sessionId: sessionId,
                            role: user.role
                        });
                    } else {
                        res.send({
                            userToken: undefined,
                            sessionId: undefined,
                            role: undefined
                        });
                    }        
                });
            } else {
                res.send({
                    userToken: undefined,
                    sessionId: undefined,
                    roles: undefined
                });
            }
        });
    });    
}
