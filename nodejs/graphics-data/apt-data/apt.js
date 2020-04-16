"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queryobject_1 = require("../lib/queryobject");
function configureAptApi(app, mongo) {
    app.use('/data/api/owners', function (req, res) {
        mongo.GetOwners().then(function (owners) {
            console.log(owners);
            if (owners) {
                res.send(owners);
            }
        });
    });
    app.use('/data/api/paymenttypes', function (req, res) {
        mongo.GetPaymentTypes().then(function (paymentTypes) {
            console.log(paymentTypes);
            if (paymentTypes) {
                res.send(paymentTypes);
            }
        });
    });
    app.use('/data/api/transactiontypes', function (req, res) {
        mongo.GetTransactionTypes().then(function (transactionTypes) {
            console.log(transactionTypes);
            if (transactionTypes) {
                res.send(transactionTypes);
            }
        });
    });
    app.use('/data/api/transaction', function (req, res) {
        var transactionData = req.body;
        mongo.SaveTransaction(transactionData).then(function (transaction) {
            console.log(transaction);
            if (transaction) {
                res.send(transaction);
            }
        });
    });
    app.use('/data/api/balance', function (req, res) {
        var user = req.query.user;
        var queryObj = queryobject_1.getQueryData(req.url);
        var aptNumber = queryObj.aptNumber;
        console.log('apt: ' + aptNumber);
        if (aptNumber === undefined) {
            aptNumber = user.number;
        }
        aptNumber = parseInt(aptNumber);
        mongo.FindBalance(aptNumber).then(function (balance) {
            var totalDue = balance.maintenance + balance.penalty - balance.advance;
            res.send({
                maintenance: balance.maintenance,
                penalty: balance.penalty,
                advance: balance.advance,
                totalDue: totalDue
            });
        });
    });
    app.use('/data/api/owner', function (req, res) {
        var user = req.query.user;
        if (user) {
            res.send({
                number: user.number,
                name: user.name,
                email: user.email,
                contact: user.contact
            });
        }
        else {
            res.send({});
        }
    });
    app.use('/data/api/payment', function (req, res) {
        var user = req.query.user;
        if (req.method === 'GET') {
            var queryObj = queryobject_1.getQueryData(req.url);
            var paymentId = queryObj.paymentId;
            if (paymentId) { // existing payment
            }
        }
        else { // Save a payment
            var paymentData = req.body;
            mongo.SavePayment(paymentData).then(function (payment) {
                console.log(payment);
                if (payment) {
                    res.send(payment);
                }
            });
        }
    });
    app.use('/data/api/payments', function (req, res) {
        mongo.GetPayments().then(function (payments) {
            console.log(payments);
            if (payments) {
                res.send(payments);
            }
        });
    });
}
exports.configureAptApi = configureAptApi;
