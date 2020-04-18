import express = require('express');
import { MongoAccess } from '../data-access/mongo-access';
import { getQueryData } from '../lib/queryobject';
import { getSessionId, decryptUser, encryptUser } from '../lib/cryptodata';

export function configureLoginApi(app: express.Application, mongo: MongoAccess) {
    // Verify if authenticated user has sent the request for data
    app.use(function(req, res, next) {
        if (req.url.endsWith('/data/api/login') || req.url.endsWith('/data/api/owners')) {
            next();
        } else {
            const queryObj = getQueryData(req.url);
            console.log('queryStr: ', queryObj);
            const sessionId = <string>queryObj.session;
            const userToken = <string>queryObj.user;
            console.log('userToken: ' + userToken);
            const userName = decryptUser(userToken);
        
            mongo.FindUser(userName, false).then(user => {
                if (user) {
                    req.query.user = user;
                    next();
                } else {
                    res.send({
                        error: 'invalid user'
                    });
                }
            });
        }
    });

    app.use('/data/api/owners', function(req, res) {
        const owners = req.body.owners;

        if (owners && owners.length > 0) {
            mongo.SaveOwners(owners).then(result => {
                res.send({
                    saved: true,
                    message: 'Success'
                })
            })
        } else {
            res.send({
                saved: false,
                message: 'Error: Owner list is empty'
            })
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
