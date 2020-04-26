"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var data_access_1 = require("./data-access");
var payment_balance_1 = require("./payment-balance");
var MongoAccess = /** @class */ (function (_super) {
    __extends(MongoAccess, _super);
    function MongoAccess() {
        var _this = _super.call(this) || this;
        _this.url = 'mongodb://localhost:27017/graphics';
        return _this;
    }
    MongoAccess.prototype.getClient = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            mongodb_1.MongoClient.connect(_this.url, function (err, client) {
                if (err)
                    throw err;
                console.log('Database connected.');
                resolve(client);
            });
        });
    };
    MongoAccess.prototype.GetConfiguration = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var blocks = client.db('vault').collection('configuration').find({});
                blocks.toArray().then(function (config) {
                    if (config && (config.length > 0)) {
                        resolve(config[0]);
                    }
                    else {
                        resolve(undefined);
                    }
                });
            });
        });
    };
    MongoAccess.prototype.GetBlocks = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var blocks = client.db('graphics').collection('block').find({});
                blocks.toArray().then(function (v) {
                    resolve(v);
                });
            });
        });
    };
    MongoAccess.prototype.GetConnections = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var connections = client.db('graphics').collection('connection').find({});
                connections.toArray().then(function (v) {
                    resolve(v);
                });
            });
        });
    };
    MongoAccess.prototype.SaveOwners = function (owners) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var ownerDb = client.db('apartments').collection('owner');
                if (ownerDb) {
                    ownerDb.insertMany(owners).then(function (result) {
                        resolve(result);
                    });
                }
                else {
                    resolve({});
                }
            });
        });
    };
    MongoAccess.prototype.CreateSession = function (user, sessionId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var sessionDb = client.db('apartments').collection('session');
                if (sessionDb) {
                    sessionDb.findOneAndUpdate({
                        user: user
                    }, {
                        $set: {
                            user: user,
                            sessionId: sessionId
                        }
                    }, {
                        upsert: true
                    })
                        .then(function (session) {
                        if (session) {
                            resolve(true);
                        }
                        else {
                            resolve(false);
                        }
                    })
                        .catch(function (err) {
                        resolve(false);
                    });
                }
                else {
                    resolve(false);
                }
            });
        });
    };
    MongoAccess.prototype.FindUser = function (user, includeRoles) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var userDb = client.db('apartments').collection('owner');
                if (userDb) {
                    userDb.findOne({
                        email: user
                    }).then(function (user) {
                        if (user) {
                            if (includeRoles) {
                                var roleDb = client.db('apartments').collection('role');
                                if (roleDb) {
                                    roleDb.findOne({
                                        roleId: user.roleId
                                    }).then(function (role) {
                                        user.role = role;
                                        resolve(user);
                                    });
                                }
                                else {
                                    user.role = undefined;
                                    resolve(user);
                                }
                            }
                            else {
                                resolve(user);
                            }
                        }
                        else {
                            resolve(undefined);
                        }
                    });
                }
                else {
                    resolve(undefined);
                }
            });
        });
    };
    MongoAccess.prototype.GetOwners = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var ownerDb = client.db('apartments').collection('owner');
                if (ownerDb) {
                    ownerDb.find({}).toArray().then(function (owners) {
                        if (owners) {
                            resolve(owners);
                        }
                        else {
                            resolve([]);
                        }
                    });
                }
                else {
                    resolve([]);
                }
            });
        });
    };
    MongoAccess.prototype.GetPaymentTypes = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var paymentTypeDb = client.db('apartments').collection('paymenttype');
                if (paymentTypeDb) {
                    paymentTypeDb.find({}).toArray().then(function (paymentTypes) {
                        if (paymentTypes) {
                            resolve(paymentTypes);
                        }
                        else {
                            resolve([]);
                        }
                    });
                }
                else {
                    resolve([]);
                }
            });
        });
    };
    MongoAccess.prototype.GetTransactionTypes = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var transactionTypeDb = client.db('apartments').collection('transactiontype');
                if (transactionTypeDb) {
                    transactionTypeDb.find({}).toArray().then(function (transactionTypes) {
                        if (transactionTypes) {
                            resolve(transactionTypes);
                        }
                        else {
                            resolve([]);
                        }
                    });
                }
                else {
                    resolve([]);
                }
            });
        });
    };
    MongoAccess.prototype.SaveTransaction = function (transaction) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var transactionHistoryDb = client.db('apartments').collection('transactionhistory');
                if (transactionHistoryDb) {
                    transactionHistoryDb.insertOne(transaction)
                        .then(function (result) {
                        if (result) {
                            resolve(result);
                        }
                        else {
                            resolve(undefined);
                        }
                    })
                        .catch(function (err) {
                        resolve(undefined);
                    });
                }
                else {
                    resolve(undefined);
                }
            });
        });
    };
    MongoAccess.prototype.SavePayment = function (payment) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var transactionHistoryDb = client.db('apartments').collection('transactionhistory');
                if (transactionHistoryDb) {
                    console.log('payment: ' + payment);
                    transactionHistoryDb.insertOne(payment)
                        .then(function (result) {
                        if (result) {
                            resolve(result);
                        }
                        else {
                            resolve(undefined);
                        }
                    })
                        .catch(function (err) {
                        resolve(undefined);
                    });
                }
                else {
                    resolve(undefined);
                }
            });
        });
    };
    MongoAccess.prototype.GetCurrentMaintenance = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var maintenanceDb = client.db('apartments').collection('maintenance');
                if (maintenanceDb) {
                    maintenanceDb.findOne({ status: 'current' }).then(function (currentMaintenance) {
                        if (currentMaintenance) {
                            resolve(currentMaintenance);
                        }
                        else {
                            resolve({});
                        }
                    });
                }
                else {
                    resolve({});
                }
            });
        });
    };
    MongoAccess.prototype.ApplyMaintenance = function (maintenance, user) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            console.log('m: ', maintenance);
            console.log('o: ', user);
            _this.getClient().then(function (client) {
                var maintenanceDb = client.db('apartments').collection('maintenance');
                var result;
                if (maintenanceDb) {
                    maintenanceDb.findOne({ status: 'current' })
                        .then(function (currentMaintenance) {
                        if ((currentMaintenance.sizeAbove.amount !== maintenance.sizeAbove.amount) ||
                            (currentMaintenance.sizeBelow.amount !== maintenance.sizeBelow.amount) ||
                            (currentMaintenance.sizeEqual.amount !== maintenance.sizeEqual.amount)) {
                            maintenanceDb.findOneAndUpdate({
                                status: 'current'
                            }, {
                                $set: {
                                    status: 'old'
                                }
                            }, {
                                upsert: true
                            })
                                .then(function (oldMaintenance) {
                                if (oldMaintenance) {
                                    maintenance.status = 'current';
                                    maintenance.modifiedDate = new Date().toString();
                                    maintenance.modifiedBy = user.email;
                                    maintenanceDb.insertOne(maintenance);
                                    result = true;
                                }
                                else {
                                    result = false;
                                }
                            });
                        }
                        else {
                            result = true;
                        }
                    });
                    // Apply the maintenance on each apartments
                    _this.UpdateResidentsMaintenance(maintenance)
                        .then(function (r) {
                        resolve(r);
                    });
                }
                else {
                    resolve(false);
                }
            });
        });
    };
    /**
     * Gets the maintenance amount
     *
     * @param maintenance
     * @param owner
     */
    MongoAccess.prototype.getMaintenanceAmount = function (maintenance, owner) {
        var maintenanceAmount = 0;
        if (owner.size > maintenance.sizeAbove.size) {
            maintenanceAmount = maintenance.sizeAbove.amount;
        }
        else if (owner.size < maintenance.sizeBelow.size) {
            maintenanceAmount = maintenance.sizeBelow.amount;
        }
        else if (owner.size === maintenance.sizeEqual.size) {
            maintenanceAmount = maintenance.sizeEqual.amount;
        }
        else {
        }
        return maintenanceAmount;
    };
    MongoAccess.prototype.UpdateResidentsMaintenance = function (maintenance) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.GetOwners().then(function (owners) {
                _this.getClient().then(function (client) {
                    var paymentBalanceDb = client.db('apartments').collection('paymentbalance');
                    paymentBalanceDb.find({}).toArray()
                        .then(function (paymentBalances) {
                        paymentBalances.forEach(function (balance) {
                            var owner = owners.find(function (o) { return o.number === balance.aptNumber; });
                            var maintenanceAmount = _this.getMaintenanceAmount(maintenance, owner);
                            var calculatedBalance = _this.calculateBalance(balance, maintenanceAmount, payment_balance_1.PaymentType.ApplyMaintenance);
                            paymentBalanceDb.replaceOne({
                                aptNumber: balance.aptNumber
                            }, calculatedBalance);
                        });
                        resolve(true);
                    });
                });
            });
        });
    };
    MongoAccess.prototype.GenerateEmptyBalanceForAllResidents = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var ownerDb = client.db('apartments').collection('owner');
                ownerDb.find({}).toArray()
                    .then(function (owners) {
                    var emptyBalances = [];
                    owners.forEach(function (owner) {
                        var emptyBalance = _this.generateEmptyBalance(owner.number);
                        emptyBalances.push(emptyBalance);
                    });
                    var paymentBalanceDb = client.db('apartments').collection('paymentbalance');
                    paymentBalanceDb.remove({});
                    paymentBalanceDb.insertMany(emptyBalances);
                    resolve(true);
                });
            });
        });
    };
    MongoAccess.prototype.GetPayments = function (aptNumber) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var transactionTypeDb = client.db('apartments').collection('transactionhistory');
                if (transactionTypeDb) {
                    transactionTypeDb.find({ aptNumber: aptNumber }).toArray().then(function (transactionTypes) {
                        if (transactionTypes) {
                            resolve(_this.getValidEntries(transactionTypes));
                        }
                        else {
                            resolve([]);
                        }
                    });
                }
                else {
                    resolve([]);
                }
            });
        });
    };
    MongoAccess.prototype.getValidEntries = function (entries) {
        var validEntries = [];
        entries.forEach(function (e) {
            if (Object.keys(e).length > 1) {
                validEntries.push(e);
            }
        });
        return validEntries;
    };
    MongoAccess.prototype.FindBalance = function (apartment) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var paymentBalanceDb = client.db('apartments').collection('paymentbalance');
                if (paymentBalanceDb) {
                    paymentBalanceDb.findOne({
                        aptNumber: apartment
                    }).then(function (balance) {
                        console.log('balance: ' + balance);
                        if (balance) {
                            resolve(balance);
                        }
                        else {
                            resolve({
                                maintenance: 0,
                                penalty: 0,
                                corpus: 0,
                                water: 0,
                                advance: 0
                            });
                        }
                    });
                }
                else {
                    resolve(undefined);
                }
            });
        });
    };
    MongoAccess.prototype.SaveBalance = function (apartment, paidAmount) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var paymentBalanceDb = client.db('apartments').collection('paymentbalance');
                if (paymentBalanceDb) {
                    paymentBalanceDb.findOne({
                        aptNumber: apartment
                    }).then(function (balance) {
                        if (balance) {
                            var calculatedBalance = _this.calculateBalance(balance, paidAmount, payment_balance_1.PaymentType.MakePayment);
                            paymentBalanceDb.replaceOne({
                                aptNumber: apartment
                            }, calculatedBalance);
                        }
                        else {
                            paymentBalanceDb.insertOne(_this.generateEmptyBalance(apartment));
                        }
                    });
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });
    };
    /**
     * Calculates the new balance based on payment type
     *
     * @param balance
     * @param amount
     * @param paymentType
     */
    MongoAccess.prototype.calculateBalance = function (balance, amount, paymentType) {
        var previous = balance.previous;
        var currentBalance = {
            maintenance: balance.maintenance,
            penalty: balance.penalty,
            corpus: balance.corpus,
            water: balance.water,
            advance: balance.advance,
            message: balance.message
        };
        if (previous) {
            previous.push(currentBalance);
        }
        else {
            previous = [];
            previous.push(currentBalance);
        }
        var calculatedBalance;
        switch (paymentType) {
            case payment_balance_1.PaymentType.ApplyMaintenance:
                calculatedBalance = this.adjustBalanceForMaintenanceApplied(balance, amount);
                break;
            case payment_balance_1.PaymentType.MakePayment:
                calculatedBalance = this.adjustBalanceForPaidAmount(balance, amount);
                break;
            default:
                calculatedBalance = balance;
                break;
        }
        return {
            aptNumber: balance.aptNumber,
            maintenance: calculatedBalance.maintenance,
            penalty: calculatedBalance.penalty,
            corpus: calculatedBalance.corpus,
            water: calculatedBalance.water,
            advance: calculatedBalance.advance,
            message: paymentType,
            previous: previous
        };
    };
    /**
     * Adjusts the balance as maintenance is applied
     *
     * @param balance
     * @param maintenanceAmount
     */
    MongoAccess.prototype.adjustBalanceForMaintenanceApplied = function (balance, maintenanceAmount) {
        var newBalance = balance;
        if (balance.advance > 0) {
            if (balance.advance >= maintenanceAmount) {
                newBalance.maintenance = 0;
                newBalance.advance = balance.advance - maintenanceAmount;
            }
            else {
                newBalance.maintenance = maintenanceAmount - balance.advance;
                newBalance.advance = 0;
            }
        }
        else {
            newBalance.maintenance = balance.maintenance + maintenanceAmount;
        }
        return newBalance;
    };
    /**
     * Adjusts the balance as payment is made
     *
     * @param balance
     * @param paidAmount
     */
    MongoAccess.prototype.adjustBalanceForPaidAmount = function (balance, paidAmount) {
        var newBalance = {};
        var balanceMaintenance = balance.maintenance - paidAmount;
        newBalance.maintenance = balanceMaintenance > 0 ? balanceMaintenance : 0;
        if (balanceMaintenance < 0) {
            var balancePenalty = balance.penalty + balanceMaintenance;
            newBalance.penalty = balancePenalty > 0 ? balancePenalty : 0;
            if (balancePenalty < 0) {
                var balanceCorpus = balance.corpus + balancePenalty;
                newBalance.corpus = balanceCorpus > 0 ? balanceCorpus : 0;
                if (balanceCorpus < 0) {
                    var balanceWater = balance.water + balanceCorpus;
                    newBalance.water = balanceWater > 0 ? balanceWater : 0;
                    if (balanceWater < 0) {
                        newBalance.advance = balance.advance + Math.abs(balanceWater);
                    }
                }
            }
        }
        return newBalance;
    };
    /**
     * Generates initial payment balance
     *
     * @param apartment
     */
    MongoAccess.prototype.generateEmptyBalance = function (apartment) {
        return {
            aptNumber: apartment,
            maintenance: 0,
            penalty: 0,
            corpus: 0,
            water: 0,
            advance: 0,
            message: 'zero balance',
            previous: []
        };
    };
    return MongoAccess;
}(data_access_1.DataAccess));
exports.MongoAccess = MongoAccess;
