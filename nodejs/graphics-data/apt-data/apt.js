"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    app.use('/data/api/payment', function (req, res) {
        var user = req.body.user;
        console.log('user:' + user);
        if (req.method === 'GET') {
            var paymentId = req.params['paymentId'];
            if (paymentId) {
            }
            else {
                res.send({
                    number: user.number,
                    name: user.name,
                    email: user.email,
                    contact: user.contact
                });
            }
        }
        else {
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
