import express = require('express');
import { MongoAccess } from '../data-access/mongo-access';
import { getQueryData } from '../lib/queryobject';
import { IdentifyOwner } from './identifyowner';
import { IdentifyNewTransactions } from './identifynewtransactions';
import { UpdateExcel } from './update-excel';
import { SeparateTransactions } from './separatetransactions';

export function configureAptApi(app: express.Application, mongo: MongoAccess) {

    app.use('/data/api/owners', function(req, res) {
        if (req.method === 'GET') {
            mongo.GetOwners().then(owners => {
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
            if (paymentTypes) {
                res.send(paymentTypes);
            }
        });
    });

    app.use('/data/api/transactiontypes', function(req, res) {
        mongo.GetTransactionTypes().then(transactionTypes => {
            if (transactionTypes) {
                res.send(transactionTypes);
            }
        });
    });

    app.use('/data/api/transaction', function(req, res) {
        const transactionData = req.body;
        mongo.SaveCredit(transactionData).then(transaction => {
            if (transaction) {
                res.send(transaction);
            }
        });
    });

    app.use('/data/api/transactions', function(req, res) {
        const transactions =  req.body ? req.body.transactions : [];
        if (transactions && transactions.length > 0) {
            // save the transaction details into the master excel sheet
            const updateExcel = new UpdateExcel();
            updateExcel.saveTransactions(transactions).then(() => {
                const processedTransactions = SeparateTransactions.process(transactions);
                // save the transaction details into the mongo database
                const creditsPromise = mongo.SaveCredits(processedTransactions.credits);                
                const debitsPromise = mongo.SaveDebits(processedTransactions.debits);
                Promise.all([creditsPromise, debitsPromise]).then(results => {
                    res.send(results);
                });
            });            
        } else {
            res.send(transactions);
        }        
    });

    app.use('/data/api/identifyowner', function(req, res) {
        const transactions =  req.body ? req.body.transactions : [];
        if (transactions && transactions.length > 0) {
            const processedTransactions = SeparateTransactions.process(transactions);
            const credits = processedTransactions.credits;
            const debits = processedTransactions.debits;
            const newTransactionsObj = new IdentifyNewTransactions(mongo);
            newTransactionsObj.process(credits, debits).then(newTransactions => {
                const identifyOwners = new IdentifyOwner(mongo);
                identifyOwners.identifyTransactions(newTransactions).then(transactions => {
                    if (transactions && transactions.length > 0) {
                        res.send(transactions);
                    } else {
                        res.send([]);
                    }
                });
            });
        } else {
            res.send(transactions);
        }
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
        //const user = req.query.user;
        const queryObj = getQueryData(req.url);
        let aptNumber = parseInt(queryObj.aptNumber);        
        mongo.GetPayments(aptNumber).then(payments => {
            if (payments) {
                res.send(payments);
            }
        });
    });

    app.use('/data/api/maintenance', function(req, res) {
        if (req.method === 'GET') {
            mongo.GetCurrentMaintenance().then(currentMaintenance => {
                if (currentMaintenance) {
                    res.send(currentMaintenance);
                } else {
                    res.send({});
                }
            });
        } else if (req.method === 'POST') {
            const user = req.query.user;
            const maintenance = req.body.maintenance;
            mongo.ApplyMaintenance(maintenance, user).then(result => {
                if (result) {
                    res.send(true);
                } else {
                    res.send(false);
                }
            });
        } else {
            res.send({});
        }
    });
}