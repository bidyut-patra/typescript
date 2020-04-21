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
                        console.log('balance: ', balance);
                        console.log('paidAmount: ', paidAmount);
                        if (balance) {
                            var maintenance = balance.maintenance;
                            var penalty = balance.penalty;
                            var corpus = balance.corpus;
                            var water = balance.water;
                            var advance = balance.advance;
                            var previous = balance.previous;
                            var currentBalance = {
                                maintenance: balance.maintenance,
                                penalty: balance.penalty,
                                corpus: balance.corpus,
                                water: balance.water,
                                advance: balance.advance
                            };
                            if (previous) {
                                previous.push(currentBalance);
                            }
                            else {
                                previous = [];
                                previous.push(currentBalance);
                            }
                            var balanceMaintenance = balance.maintenance - paidAmount;
                            maintenance = balanceMaintenance > 0 ? balanceMaintenance : 0;
                            if (balanceMaintenance < 0) {
                                var balancePenalty = balance.penalty + balanceMaintenance;
                                penalty = balancePenalty > 0 ? balancePenalty : 0;
                                if (balancePenalty < 0) {
                                    var balanceCorpus = balance.corpus + balancePenalty;
                                    corpus = balanceCorpus > 0 ? balanceCorpus : 0;
                                    if (balanceCorpus < 0) {
                                        var balanceWater = balance.water + balanceCorpus;
                                        water = balanceWater > 0 ? balanceWater : 0;
                                        if (balanceWater < 0) {
                                            advance = balance.advance + Math.abs(balanceWater);
                                        }
                                    }
                                }
                            }
                            paymentBalanceDb.replaceOne({
                                aptNumber: apartment
                            }, {
                                aptNumber: apartment,
                                maintenance: maintenance,
                                penalty: penalty,
                                corpus: corpus,
                                water: water,
                                advance: advance,
                                previous: previous
                            });
                        }
                        else {
                            paymentBalanceDb.insertOne({
                                aptNumber: apartment,
                                maintenance: 0,
                                penalty: 0,
                                corpus: 0,
                                water: 0,
                                advance: paidAmount,
                                previous: []
                            });
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
    return MongoAccess;
}(data_access_1.DataAccess));
exports.MongoAccess = MongoAccess;
