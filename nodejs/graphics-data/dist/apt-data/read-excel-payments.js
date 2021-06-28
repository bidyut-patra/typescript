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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dateformat_1 = __importDefault(require("dateformat"));
var appsettings_reader_1 = require("../appsettings-reader");
var utility_1 = require("../lib/utility");
var excel_1 = require("./excel");
var ReadPaymentExcel = /** @class */ (function (_super) {
    __extends(ReadPaymentExcel, _super);
    function ReadPaymentExcel(owners) {
        var _this = _super.call(this) || this;
        _this.owners = owners;
        _this.transactions = [];
        return _this;
    }
    ReadPaymentExcel.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mainTransactions, payments, corpus, water, commercial, credits, otherTransactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.readFile(appsettings_reader_1.AppSettings.InputTransactionFile, this.getMainSheetConfiguration())];
                    case 1:
                        mainTransactions = _a.sent();
                        this.transactions = mainTransactions.Main;
                        return [4 /*yield*/, this.readFile(appsettings_reader_1.AppSettings.InputPaymentFile, this.getFlatSheetConfiguration())];
                    case 2:
                        payments = _a.sent();
                        return [4 /*yield*/, this.readFile(appsettings_reader_1.AppSettings.InputPaymentFile, this.getCorpusSheetConfiguration())];
                    case 3:
                        corpus = _a.sent();
                        return [4 /*yield*/, this.readFile(appsettings_reader_1.AppSettings.InputPaymentFile, this.getWaterSheetConfiguration())];
                    case 4:
                        water = _a.sent();
                        return [4 /*yield*/, this.readFile(appsettings_reader_1.AppSettings.InputPaymentFile, this.getCommercialSheetConfiguration())];
                    case 5:
                        commercial = _a.sent();
                        credits = [];
                        credits = credits.concat(this.prepareResidentTransactions(payments));
                        credits = credits.concat(this.prepareCorpusTransactions(corpus.Corpus_Water));
                        credits = credits.concat(this.prepareWaterTransactions(water.Corpus_Water));
                        credits = credits.concat(this.prepareCommercialTransactions(commercial.Commercial));
                        otherTransactions = this.prepareOthersTransactions(this.transactions);
                        credits = credits.concat(otherTransactions.credits);
                        return [2 /*return*/, {
                                credits: credits,
                                debits: otherTransactions.debits
                            }];
                }
            });
        });
    };
    ReadPaymentExcel.prototype.prepareResidentTransactions = function (payments) {
        var processedPayments = [];
        var trimCharacters = ['\\s', '-'];
        for (var prop in payments) {
            var aptNumber = parseInt(prop);
            var ownerPaymentHistory = payments[prop];
            for (var i = 0; i < ownerPaymentHistory.length; i++) {
                var processedPayment = {};
                var ownerPayment = ownerPaymentHistory[i];
                var transactionMsg = ownerPayment.transactionMsg;
                if (ownerPayment.paidAmount) {
                    var transaction = this.getTransaction(transactionMsg, ownerPayment.paidAmount, aptNumber, ownerPayment.paymentDate);
                    transaction.accounted = true;
                    processedPayment['aptNumber'] = aptNumber;
                    processedPayment['owner'] = this.getAptOwner(aptNumber);
                    processedPayment['transactionType'] = this.getTransactionType(transactionMsg);
                    processedPayment['paymentType'] = 'maintenance';
                    processedPayment['paymentDate'] = ownerPayment.paymentDate;
                    processedPayment['paidAmount'] = ownerPayment.paidAmount;
                    processedPayment['transactionMsg'] = transactionMsg;
                    processedPayment['transactionFilter'] = utility_1.Utility.trimChars(transactionMsg, trimCharacters);
                    processedPayment['comment'] = transaction.comment;
                    processedPayment['commentFilter'] = utility_1.Utility.trimChars(transaction.comment, trimCharacters);
                    processedPayment['createdDate'] = dateformat_1.default(new Date(), 'd-mmm-yyyy');
                    processedPayments.push(processedPayment);
                }
            }
        }
        return processedPayments;
    };
    ReadPaymentExcel.prototype.prepareOthersTransactions = function (others) {
        var otherTransactions = {
            credits: [],
            debits: []
        };
        var trimCharacters = ['\\s', '-'];
        for (var i = 0; i < this.transactions.length; i++) {
            var transaction = this.transactions[i];
            if (!transaction.accounted) {
                var otherTransaction = {};
                transaction.accounted = true;
                otherTransaction['transactionType'] = this.getTransactionType(transaction.transactionMsg);
                otherTransaction['paymentDate'] = transaction.paymentDate;
                otherTransaction['transactionMsg'] = transaction.transactionMsg;
                otherTransaction['transactionFilter'] = utility_1.Utility.trimChars(transaction.transactionMsg, trimCharacters);
                otherTransaction['comment'] = transaction.comment;
                otherTransaction['commentFilter'] = utility_1.Utility.trimChars(transaction.comment, trimCharacters);
                otherTransaction['createdDate'] = dateformat_1.default(new Date(), 'd-mmm-yyyy');
                if (transaction.creditAmount) {
                    otherTransaction['paymentType'] = transaction.paidBy;
                    otherTransaction['paidAmount'] = transaction.creditAmount;
                    otherTransactions.credits.push(otherTransaction);
                }
                else {
                    otherTransaction['paymentType'] = 'expense';
                    otherTransaction['paidAmount'] = transaction.debitAmount;
                    otherTransactions.debits.push(otherTransaction);
                }
            }
        }
        return otherTransactions;
    };
    ReadPaymentExcel.prototype.prepareCorpusTransactions = function (corpus) {
        var corpusTransactions = [];
        var trimCharacters = ['\\s', '-'];
        for (var i = 0; i < corpus.length; i++) {
            var transactionMsg = corpus[i].transactionMsg ? corpus[i].transactionMsg : corpus[i].transactionMsg2;
            if (transactionMsg && corpus[i].paidAmount && (corpus[i].paidAmount > 0)) {
                var corpusTransaction = {};
                var transaction = this.getTransaction(transactionMsg, corpus[i].paidAmount);
                transaction.accounted = true;
                corpusTransaction['aptNumber'] = corpus[i].aptNumber;
                corpusTransaction['owner'] = this.getAptOwner(corpus[i].aptNumber);
                corpusTransaction['transactionType'] = this.getTransactionType(corpus[i].transactionMsg);
                corpusTransaction['paymentType'] = 'corpus';
                corpusTransaction['paymentDate'] = transaction.paymentDate;
                corpusTransaction['paidAmount'] = corpus[i].paidAmount;
                corpusTransaction['transactionMsg'] = transactionMsg;
                corpusTransaction['transactionFilter'] = utility_1.Utility.trimChars(transactionMsg, trimCharacters);
                corpusTransaction['comment'] = transaction.comment;
                corpusTransaction['commentFilter'] = utility_1.Utility.trimChars(transaction.comment, trimCharacters);
                corpusTransaction['createdDate'] = dateformat_1.default(new Date(), 'd-mmm-yyyy');
                corpusTransactions.push(corpusTransaction);
            }
        }
        return corpusTransactions;
    };
    ReadPaymentExcel.prototype.prepareWaterTransactions = function (water) {
        var waterTransactions = [];
        var trimCharacters = ['\\s', '-'];
        for (var i = 0; i < water.length; i++) {
            var transactionMsg = water[i].transactionMsg ? water[i].transactionMsg : water[i].transactionMsg1;
            if (transactionMsg && water[i].paidAmount && (water[i].paidAmount > 0)) {
                var waterTransaction = {};
                var transaction = this.getTransaction(transactionMsg, water[i].paidAmount);
                transaction.accounted = true;
                waterTransaction['aptNumber'] = water[i].aptNumber;
                waterTransaction['owner'] = this.getAptOwner(water[i].aptNumber);
                waterTransaction['transactionType'] = this.getTransactionType(transactionMsg);
                waterTransaction['paymentType'] = 'water';
                waterTransaction['paymentDate'] = transaction.paymentDate;
                waterTransaction['paidAmount'] = water[i].paidAmount;
                waterTransaction['transactionMsg'] = transactionMsg;
                waterTransaction['transactionFilter'] = utility_1.Utility.trimChars(transactionMsg, trimCharacters);
                waterTransaction['comment'] = transaction.comment;
                waterTransaction['commentFilter'] = utility_1.Utility.trimChars(transaction.comment, trimCharacters);
                waterTransaction['createdDate'] = dateformat_1.default(new Date(), 'd-mmm-yyyy');
                waterTransactions.push(waterTransaction);
            }
        }
        return waterTransactions;
    };
    ReadPaymentExcel.prototype.prepareCommercialTransactions = function (commercial) {
        var commercialTransactions = [];
        var trimCharacters = ['\\s', '-'];
        for (var i = 0; i < commercial.length; i++) {
            if (commercial[i].transactionMsg && commercial[i].paidAmount && (commercial[i].paidAmount > 0)) {
                var commercialTransaction = {};
                var transaction = this.getTransaction(commercial[i].transactionMsg, commercial[i].paidAmount);
                transaction.accounted = true;
                commercialTransaction['aptNumber'] = undefined;
                commercialTransaction['owner'] = undefined;
                commercialTransaction['transactionType'] = this.getTransactionType(commercial[i].transactionMsg);
                commercialTransaction['paymentType'] = 'commercial';
                commercialTransaction['paymentDate'] = transaction.paymentDate;
                commercialTransaction['paidAmount'] = commercial[i].paidAmount;
                commercialTransaction['transactionMsg'] = commercial[i].transactionMsg;
                commercialTransaction['transactionFilter'] = utility_1.Utility.trimChars(commercial[i].transactionMsg, trimCharacters);
                commercialTransaction['comment'] = transaction.comment;
                commercialTransaction['commentFilter'] = utility_1.Utility.trimChars(transaction.comment, trimCharacters);
                commercialTransaction['createdDate'] = dateformat_1.default(new Date(), 'd-mmm-yyyy');
                commercialTransactions.push(commercialTransaction);
            }
        }
        return commercialTransactions;
    };
    ReadPaymentExcel.prototype.getAptOwner = function (aptNumber) {
        var owner = this.owners.find(function (o) { return o.number === aptNumber; });
        if (owner) {
            return owner.name;
        }
        else {
            return '';
        }
    };
    ReadPaymentExcel.prototype.getComment = function (transactions, transactionMsg, filter) {
        var matchingTransactions = transactions.filter(function (t) {
            var isArray = Array.isArray(t.aptNumber);
            var aptMatch = isArray ? (t.aptNumber.indexOf(filter.aptNumber) >= 0) : (t.aptNumber === filter.aptNumber);
            var amountMatch = isArray ? true : (t.paidAmount === filter.paidAmount);
            return aptMatch && (t.paymentDate === filter.paymentDate) && amountMatch;
        });
        if (matchingTransactions.length === 1) {
            return matchingTransactions[0].comment;
        }
        else {
            return transactionMsg;
        }
    };
    ReadPaymentExcel.prototype.getTransaction = function (transactionMsg, paidAmount, aptNumber, paymentDate) {
        var trimCharacters = ['\\s', '-'];
        var transactionFilterValue = utility_1.Utility.trimChars(transactionMsg, trimCharacters);
        var matchingTransactions = this.transactions.filter(function (t) {
            var thisTransactionFilterValue = utility_1.Utility.trimChars(t.transactionMsg, trimCharacters);
            var transactionFilterMatch = (transactionFilterValue === thisTransactionFilterValue);
            var paidAmountMatch = (t.paidAmount === paidAmount);
            if (aptNumber && paymentDate) {
                var isArray = Array.isArray(t.aptNumber);
                var aptMatch = isArray ? (t.aptNumber.indexOf(aptNumber) >= 0) : (t.aptNumber === aptNumber);
                var paymentDateMatch = (t.paymentDate === paymentDate);
                return transactionFilterMatch && paidAmountMatch && aptMatch && paymentDateMatch;
            }
            else {
                return transactionFilterMatch && paidAmountMatch;
            }
        });
        if (matchingTransactions.length === 1) {
            return matchingTransactions[0];
        }
        else {
            return {
                comment: transactionMsg
            };
        }
    };
    ReadPaymentExcel.prototype.getTransactionType = function (remark) {
        if (remark) {
            var remarkInLowerCase = remark.toLowerCase();
            var isCashTransaction = remarkInLowerCase.indexOf('cash') >= 0;
            var isChequeTransaction = remarkInLowerCase.indexOf('cheque') >= 0;
            return isCashTransaction ? 'cash' : (isChequeTransaction ? 'cheque' : 'online');
        }
        else {
            return 'online';
        }
    };
    ReadPaymentExcel.prototype.getMainSheetConfiguration = function () {
        var configurations = [];
        configurations.push({
            sheetName: 'Main',
            row: 2,
            cells: [
                {
                    label: 'B',
                    column: 'paymentDate',
                    type: 'date'
                },
                {
                    label: 'C',
                    column: 'transactionMsg',
                    type: 'string'
                },
                {
                    label: 'D',
                    column: 'debitAmount',
                    type: 'number'
                },
                {
                    label: 'E',
                    column: 'creditAmount',
                    type: 'number'
                },
                {
                    label: 'F',
                    column: 'aptNumber',
                    type: 'number',
                    array: true,
                    separator: ','
                },
                {
                    label: 'F',
                    column: 'paidBy',
                    type: 'string'
                },
                {
                    label: 'I',
                    column: 'comment',
                    type: 'string'
                }
            ]
        });
        return configurations;
    };
    ReadPaymentExcel.prototype.getFlatSheetConfiguration = function () {
        var configurations = [];
        var j = 0;
        var k = 141;
        for (var i = 101; (i <= k) && (j < 4); i++) {
            var aptNumber = i.toString();
            configurations.push({
                sheetName: aptNumber,
                row: 16,
                cells: [
                    {
                        label: 'A',
                        column: 'paymentDate',
                        type: 'date'
                    },
                    {
                        label: 'B',
                        column: 'paidAmount',
                        type: 'number'
                    },
                    {
                        label: 'C',
                        column: 'paidAmount',
                        type: 'number'
                    },
                    {
                        label: 'D',
                        column: 'paidAmount',
                        type: 'number'
                    },
                    {
                        label: 'E',
                        column: 'paidAmount',
                        type: 'number'
                    },
                    {
                        label: 'F',
                        column: 'paidAmount',
                        type: 'number'
                    },
                    {
                        label: 'G',
                        column: 'penalty',
                        type: 'number'
                    },
                    {
                        label: 'H',
                        column: 'transactionMsg',
                        type: 'string'
                    },
                ]
            });
            if (i === k) {
                j++;
                i = j * 100 + 100;
                k = j * 100 + 141;
            }
        }
        return configurations;
    };
    ReadPaymentExcel.prototype.getCorpusSheetConfiguration = function () {
        var config = {
            sheetName: 'Corpus_Water',
            row: 2,
            cells: [
                {
                    label: 'A',
                    column: 'aptNumber',
                    type: 'number'
                },
                {
                    label: 'C',
                    column: 'paidAmount',
                    type: 'number'
                },
                {
                    label: 'D',
                    column: 'transactionMsg',
                    type: 'string'
                },
                {
                    label: 'F',
                    column: 'transactionMsg2',
                    type: 'string'
                }
            ]
        };
        return [config];
    };
    ReadPaymentExcel.prototype.getWaterSheetConfiguration = function () {
        var config = {
            sheetName: 'Corpus_Water',
            row: 2,
            cells: [
                {
                    label: 'A',
                    column: 'aptNumber',
                    type: 'number'
                },
                {
                    label: 'D',
                    column: 'transactionMsg1',
                    type: 'string'
                },
                {
                    label: 'E',
                    column: 'paidAmount',
                    type: 'number'
                },
                {
                    label: 'F',
                    column: 'transactionMsg',
                    type: 'string'
                }
            ]
        };
        return [config];
    };
    ReadPaymentExcel.prototype.getCommercialSheetConfiguration = function () {
        var config = {
            sheetName: 'Commercial',
            row: 15,
            cells: [
                {
                    label: 'A',
                    column: 'paymentDate',
                    type: 'date'
                },
                {
                    label: 'E',
                    column: 'paidAmount',
                    type: 'number'
                },
                {
                    label: 'H',
                    column: 'transactionMsg',
                    type: 'string'
                },
            ]
        };
        return [config];
    };
    return ReadPaymentExcel;
}(excel_1.Excel));
exports.ReadPaymentExcel = ReadPaymentExcel;
