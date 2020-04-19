"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queryobject_1 = require("../lib/queryobject");
function configureAptApi(app, mongo) {
    app.use('/data/api/owners', function (req, res) {
        if (req.method === 'GET') {
            mongo.GetOwners().then(function (owners) {
                console.log(owners);
                if (owners) {
                    res.send(owners);
                }
            });
        }
        else if (req.method === 'POST') {
            var owners = req.body.owners;
            if (owners && owners.length > 0) {
                mongo.SaveOwners(owners).then(function (result) {
                    res.send({
                        saved: true,
                        message: 'Success'
                    });
                });
            }
            else {
                res.send({
                    saved: false,
                    message: 'Error: Owner list is empty'
                });
            }
        }
        else {
            res.send({
                error: 'Unsupported request type'
            });
        }
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
            var totalPaymentDue = balance.maintenance + balance.corpus + balance.water;
            var totalDue = totalPaymentDue + balance.penalty - balance.advance;
            var maintenanceMsg = 'Maintenance: ' + balance.maintenance + ', Corpus: ' + balance.corpus + ', Water: ' + balance.water;
            res.send({
                maintenance: totalPaymentDue,
                maintenanceMsg: maintenanceMsg,
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
            var paymentData_1 = req.body;
            mongo.SavePayment(paymentData_1).then(function (payment) {
                if (payment) {
                    mongo.SaveBalance(paymentData_1.aptNumber, paymentData_1.paidAmount).then(function (result) {
                        if (result) {
                            res.send(payment);
                        }
                    });
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
