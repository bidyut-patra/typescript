"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utility_1 = require("../lib/utility");
var dateformat_1 = __importDefault(require("dateformat"));
var SeparateTransactions = /** @class */ (function () {
    function SeparateTransactions() {
    }
    SeparateTransactions.process = function (transactions) {
        var processedTransactions = {
            credits: [],
            debits: []
        };
        var trimCharacters = ['\\s', '-'];
        for (var i = 0; i < transactions.length; i++) {
            var transaction = transactions[i];
            if (transaction.remittanceType === 'credit') {
                processedTransactions.credits.push({
                    aptNumber: transaction.aptNumber,
                    owner: transaction.owner,
                    transactionType: transaction.transactionType,
                    paymentType: transaction.paymentType,
                    paidAmount: transaction.paidAmount,
                    paymentDate: transaction.paymentDate,
                    transactionMsg: transaction.transactionMsg,
                    transactionFilter: utility_1.Utility.trimChars(transaction.transactionMsg, trimCharacters),
                    comment: transaction.comment,
                    commentFilter: utility_1.Utility.trimChars(transaction.comment, trimCharacters),
                    createdDate: dateformat_1.default(new Date(), 'dd-MMM-yyyy')
                });
            }
            if (transactions[i].remittanceType === 'debit') {
                processedTransactions.debits.push({
                    transactionType: transaction.transactionType,
                    paymentType: transaction.paymentType,
                    paidAmount: transaction.paidAmount,
                    paymentDate: transaction.paymentDate,
                    transactionMsg: transaction.transactionMsg,
                    transactionFilter: utility_1.Utility.trimChars(transaction.transactionMsg, trimCharacters),
                    comment: transaction.comment,
                    commentFilter: utility_1.Utility.trimChars(transaction.comment, trimCharacters),
                    createdDate: dateformat_1.default(new Date(), 'dd-MMM-yyyy')
                });
            }
        }
        return processedTransactions;
    };
    return SeparateTransactions;
}());
exports.SeparateTransactions = SeparateTransactions;
