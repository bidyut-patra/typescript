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
    MongoAccess.prototype.CreateSession = function (user, sessionId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var sessionDb = client.db('apartments').collection('session');
                if (sessionDb !== undefined) {
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
                if (userDb !== undefined) {
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
                                        user.roles = role.roles;
                                        resolve(user);
                                    });
                                }
                                else {
                                    user.roles = [];
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
                if (ownerDb !== undefined) {
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
                if (paymentTypeDb !== undefined) {
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
                if (transactionTypeDb !== undefined) {
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
                if (transactionHistoryDb !== undefined) {
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
    MongoAccess.prototype.SavePayment = function (transaction) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var transactionHistoryDb = client.db('apartments').collection('transactionhistory');
                if (transactionHistoryDb !== undefined) {
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
    MongoAccess.prototype.GetPayments = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var transactionTypeDb = client.db('apartments').collection('transactionhistory');
                if (transactionTypeDb !== undefined) {
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
    return MongoAccess;
}(data_access_1.DataAccess));
exports.MongoAccess = MongoAccess;
