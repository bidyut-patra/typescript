import express = require('express');
import { MongoAccess } from '../data-access/mongo-access';
import { getQueryData } from '../lib/queryobject';

export function configureAptApi(app: express.Application, mongo: MongoAccess) {

    app.use('/data/api/owners', function(req, res) {
        if (req.method === 'GET') {
            mongo.GetOwners().then(owners => {
                console.log(owners);
                if (owners) {
                    res.send(owners);
                }
            });
        } else if (req.method === 'POST') {
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
        } else {
            res.send({
                error: 'Unsupported request type'
            })
        }
    });

    app.use('/data/api/paymenttypes', function(req, res) {
        mongo.GetPaymentTypes().then(paymentTypes => {
            console.log(paymentTypes);
            if (paymentTypes) {
                res.send(paymentTypes);
            }
        });
    });

    app.use('/data/api/transactiontypes', function(req, res) {
        mongo.GetTransactionTypes().then(transactionTypes => {
            console.log(transactionTypes);
            if (transactionTypes) {
                res.send(transactionTypes);
            }
        });
    });

    app.use('/data/api/transaction', function(req, res) {
        const transactionData = req.body;
        mongo.SaveTransaction(transactionData).then(transaction => {
            console.log(transaction);
            if (transaction) {
                res.send(transaction);
            }
        });
    });

    app.use('/data/api/balance', function(req, res) {
        const user = req.query.user;
        const queryObj = getQueryData(req.url);
        let aptNumber = queryObj.aptNumber;
        if (aptNumber === undefined) {
            aptNumber = user.number;
        }
        aptNumber = parseInt(aptNumber);
        mongo.FindBalance(aptNumber).then(balance => {          
            const totalPaymentDue = balance.maintenance + balance.corpus + balance.water;
            const totalDue = totalPaymentDue + balance.penalty - balance.advance;
            const maintenanceMsg = 'Maintenance: ' + balance.maintenance + ', Corpus: ' + balance.corpus + ', Water: ' + balance.water;
            res.send({
                maintenance: totalPaymentDue,
                maintenanceMsg: maintenanceMsg,
                penalty: balance.penalty,
                advance: balance.advance,
                totalDue: totalDue
            });
        });
    })    

    app.use('/data/api/owner', function(req, res) {
        const user = req.query.user;
        if (user) {
            res.send({
                number: user.number,
                name: user.name,
                email: user.email,
                size: user.size,
                contact: user.contact
            });
        } else {
            res.send({});
        }
    })    

    app.use('/data/api/payment', function(req, res) {
        const user = req.query.user;
        if (req.method === 'GET') {
            const queryObj = getQueryData(req.url);
            const paymentId = queryObj.paymentId;
            if (paymentId) { // existing payment

            }
        } else { // Save a payment
            const paymentData = req.body;
            mongo.SavePayment(paymentData).then(payment => {
                if (payment) {
                    const aptNumber = parseInt(paymentData.aptNumber);
                    const paidAmount = parseFloat(paymentData.paidAmount);
                    mongo.SaveBalance(aptNumber, paidAmount).then(result => {
                        if (result) {
                            res.send(payment);
                        }
                    })
                }
            });
        }
    });

    app.use('/data/api/payments', function(req, res) {
        const user = req.query.user;
        const queryObj = getQueryData(req.url);
        let aptNumber = queryObj.aptNumber;
        if (aptNumber === undefined) {
            aptNumber = user.number;
        }        
        mongo.GetPayments(aptNumber).then(payments => {
            console.log(payments);
            if (payments) {
                res.send(payments);
            }
        });
    });

    app.use('/data/api/maintenance', function(req, res) {     
        mongo.GetCurrentMaintenance().then(currentMaintenance => {
            console.log(currentMaintenance);
            if (currentMaintenance) {
                res.send(currentMaintenance);
            } else {
                res.send({});
            }
        });
    });
}