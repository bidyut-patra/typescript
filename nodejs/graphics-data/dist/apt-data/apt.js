"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queryobject_1 = require("../lib/queryobject");
var identifyowner_1 = require("./identifyowner");
var identifynewtransactions_1 = require("./identifynewtransactions");
var update_excel_1 = require("./update-excel");
var separatetransactions_1 = require("./separatetransactions");
function configureAptApi(app, mongo) {
    app.use('/data/api/owners', function (req, res) {
        if (req.method === 'GET') {
            mongo.GetOwners().then(function (owners) {
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
            if (paymentTypes) {
                res.send(paymentTypes);
            }
        });
    });
    app.use('/data/api/transactiontypes', function (req, res) {
        mongo.GetTransactionTypes().then(function (transactionTypes) {
            if (transactionTypes) {
                res.send(transactionTypes);
            }
        });
    });
    app.use('/data/api/transaction', function (req, res) {
        var transactionData = req.body;
        mongo.SaveCredit(transactionData).then(function (transaction) {
            if (transaction) {
                res.send(transaction);
            }
        });
    });
    app.use('/data/api/transactions', function (req, res) {
        var transactions = req.body ? req.body.transactions : [];
        if (transactions && transactions.length > 0) {
            // save the transaction details into the master excel sheet
            var updateExcel = new update_excel_1.UpdateExcel();
            updateExcel.saveTransactions(transactions).then(function () {
                var processedTransactions = separatetransactions_1.SeparateTransactions.process(transactions);
                // save the transaction details into the mongo database
                var creditsPromise = mongo.SaveCredits(processedTransactions.credits);
                var debitsPromise = mongo.SaveDebits(processedTransactions.debits);
                Promise.all([creditsPromise, debitsPromise]).then(function (results) {
                    res.send(results);
                });
            });
        }
        else {
            res.send(transactions);
        }
    });
    app.use('/data/api/identifyowner', function (req, res) {
        var transactions = req.body ? req.body.transactions : [];
        if (transactions && transactions.length > 0) {
            var processedTransactions = separatetransactions_1.SeparateTransactions.process(transactions);
            var credits = processedTransactions.credits;
            var debits = processedTransactions.debits;
            var newTransactionsObj = new identifynewtransactions_1.IdentifyNewTransactions(mongo);
            newTransactionsObj.process(credits, debits).then(function (newTransactions) {
                var identifyOwners = new identifyowner_1.IdentifyOwner(mongo);
                identifyOwners.identifyTransactions(newTransactions).then(function (transactions) {
                    if (transactions && transactions.length > 0) {
                        res.send(transactions);
                    }
                    else {
                        res.send([]);
                    }
                });
            });
        }
        else {
            res.send(transactions);
        }
    });
    app.use('/data/api/balance', function (req, res) {
        var user = req.query.user;
        var queryObj = queryobject_1.getQueryData(req.url);
        var aptNumber = queryObj.aptNumber;
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
                size: user.size,
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
                    var aptNumber = parseInt(paymentData_1.aptNumber);
                    var paidAmount = parseFloat(paymentData_1.paidAmount);
                    mongo.SaveBalance(aptNumber, paidAmount).then(function (result) {
                        if (result) {
                            res.send(payment);
                        }
                    });
                }
            });
        }
    });
    app.use('/data/api/payments', function (req, res) {
        //const user = req.query.user;
        var queryObj = queryobject_1.getQueryData(req.url);
        var aptNumber = parseInt(queryObj.aptNumber);
        mongo.GetPayments(aptNumber).then(function (payments) {
            if (payments) {
                res.send(payments);
            }
        });
    });
    app.use('/data/api/maintenance', function (req, res) {
        if (req.method === 'GET') {
            mongo.GetCurrentMaintenance().then(function (currentMaintenance) {
                if (currentMaintenance) {
                    res.send(currentMaintenance);
                }
                else {
                    res.send({});
                }
            });
        }
        else if (req.method === 'POST') {
            var user = req.query.user;
            var maintenance = req.body.maintenance;
            mongo.ApplyMaintenance(maintenance, user).then(function (result) {
                if (result) {
                    res.send(true);
                }
                else {
                    res.send(false);
                }
            });
        }
        else {
            res.send({});
        }
    });
}
exports.configureAptApi = configureAptApi;
