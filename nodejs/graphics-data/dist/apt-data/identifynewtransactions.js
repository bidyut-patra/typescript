"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utility_1 = require("../lib/utility");
var IdentifyNewTransactions = /** @class */ (function () {
    function IdentifyNewTransactions(mongo) {
        this.trimCharacters = ['\\s', '-'];
        this.mongo = mongo;
    }
    IdentifyNewTransactions.prototype.process = function (credits, debits) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var creditsFilter = _this.getFilter(credits);
            var debitsFilter = _this.getFilter(debits);
            var projection = { transactionFilter: 1, _id: 0 };
            // console.log('Credits filter: ', creditsFilter);
            // console.log('Debits filter: ', debitsFilter);
            var creditsPromise = _this.mongo.GetMatchedCredits(creditsFilter, projection);
            var debitsPromise = _this.mongo.GetMatchedDebits(debitsFilter, projection);
            Promise.all([creditsPromise, debitsPromise]).then(function (results) {
                // console.log('Credits: ', credits);
                // console.log('Debits: ', debits);
                // console.log('Matched transactions: ', results);
                var newCredits = _this.getNewTransactions(credits, results[0]);
                var newDebits = _this.getNewTransactions(debits, results[1]);
                //console.log('New transactions: ', newTransactions);
                resolve(newCredits.concat(newDebits));
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    IdentifyNewTransactions.prototype.getNewTransactions = function (transactions, matchedTransactions) {
        var _this = this;
        var newTransactions = [];
        transactions.forEach(function (transaction) {
            var transactionFilterValue = utility_1.Utility.trimChars(transaction.transactionMsg, _this.trimCharacters);
            if (matchedTransactions.indexOf(transactionFilterValue) < 0) {
                newTransactions.push(transaction);
            }
        });
        return newTransactions;
    };
    IdentifyNewTransactions.prototype.getFilter = function (transactions) {
        var _this = this;
        var filter = {
            transactionFilter: { $in: [] }
        };
        transactions.forEach(function (transaction) {
            var transactionFilterValue = utility_1.Utility.trimChars(transaction.transactionMsg, _this.trimCharacters);
            filter.transactionFilter.$in.push(transactionFilterValue);
        });
        return filter;
    };
    return IdentifyNewTransactions;
}());
exports.IdentifyNewTransactions = IdentifyNewTransactions;
