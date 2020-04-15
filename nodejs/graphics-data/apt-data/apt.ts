import express = require('express');
import { MongoAccess } from '../data-access/mongo-access';

export function configureAptApi(app: express.Application, mongo: MongoAccess) {

    app.use('/data/api/owners', function(req, res) {
        mongo.GetOwners().then(owners => {
            console.log(owners);
            if (owners) {
                res.send(owners);
            }
        });
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

    app.use('/data/api/payment', function(req, res) {
        const user = req.body.user;
        console.log('user:' + user);
        if (req.method === 'GET') {
            const paymentId = req.params['paymentId'];
            if (paymentId) {

            } else {
                res.send({
                    number: user.number,
                    name: user.name,
                    email: user.email,
                    contact: user.contact                    
                })
            }
        } else {
            const paymentData = req.body;
            mongo.SavePayment(paymentData).then(payment => {
                console.log(payment);
                if (payment) {
                    res.send(payment);
                }
            });
        }
    });

    app.use('/data/api/payments', function(req, res) {
        mongo.GetPayments().then(payments => {
            console.log(payments);
            if (payments) {
                res.send(payments);
            }
        });
    });
}