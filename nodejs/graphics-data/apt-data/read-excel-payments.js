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
var excel_1 = require("./excel");
var ReadPaymentExcel = /** @class */ (function (_super) {
    __extends(ReadPaymentExcel, _super);
    function ReadPaymentExcel(owners) {
        var _this = _super.call(this) || this;
        _this.owners = owners;
        return _this;
    }
    ReadPaymentExcel.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dir, transactionFile, paymentFile, transactions, payments, transactionData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dir = 'C:\\WORK@SE\\Personal\\RSROA\\2020 Q3\\';
                        transactionFile = dir + '2019-20 Transaction New Association.xlsx';
                        paymentFile = dir + 'JULY_SEP_FY20_21-Q1_Q4_Sheet.xlsx';
                        return [4 /*yield*/, this.readFile(transactionFile, this.getTransactionFileConfigurations())];
                    case 1:
                        transactions = _a.sent();
                        return [4 /*yield*/, this.readFile(paymentFile, this.getPaymentFileConfigurations())];
                    case 2:
                        payments = _a.sent();
                        transactionData = this.prepareOwnerTransactionData(transactions.Main, payments);
                        return [2 /*return*/, transactionData];
                }
            });
        });
    };
    ReadPaymentExcel.prototype.prepareOwnerTransactionData = function (transactions, payments) {
        var processedPayments = [];
        for (var prop in payments) {
            var aptNumber = parseInt(prop);
            var ownerPaymentHistory = payments[prop];
            for (var i = 0; i < ownerPaymentHistory.length; i++) {
                var processedPayment = {};
                var ownerPayment = ownerPaymentHistory[i];
                var transactionMsg = ownerPayment.transactionMsg;
                if (ownerPayment.paidAmount) {
                    processedPayment['aptNumber'] = aptNumber;
                    processedPayment['owner'] = this.getAptOwner(aptNumber);
                    processedPayment['transactionType'] = 'quarter';
                    processedPayment['paymentType'] = this.getTransactionType(transactionMsg);
                    processedPayment['paymentDate'] = ownerPayment.paymentDate;
                    processedPayment['paidAmount'] = ownerPayment.paidAmount;
                    processedPayment['transactionMsg'] = transactionMsg;
                    processedPayment['comment'] = this.getComment(transactions, transactionMsg, {
                        aptNumber: aptNumber,
                        paymentDate: ownerPayment.paymentDate,
                        paidAmount: ownerPayment.paidAmount
                    });
                    processedPayment['createdDate'] = dateformat_1.default(new Date(), 'd-mmm-yyyy');
                    processedPayments.push(processedPayment);
                }
            }
        }
        return processedPayments;
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
    ReadPaymentExcel.prototype.trimSpaces = function (value) {
        if (value) {
            value = value.replace(/\s\s+/g, ' ');
            value = value.replace(/^\s+/, '');
            value = value.replace(/\s+$/, '');
        }
        return value;
    };
    ReadPaymentExcel.prototype.getTransactionFileConfigurations = function () {
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
                    label: 'E',
                    column: 'paidAmount',
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
                    label: 'I',
                    column: 'comment',
                    type: 'string'
                }
            ]
        });
        return configurations;
    };
    ReadPaymentExcel.prototype.getPaymentFileConfigurations = function () {
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
                i = j * 100 + 101;
                k = j * 100 + 141;
            }
        }
        return configurations;
    };
    return ReadPaymentExcel;
}(excel_1.Excel));
exports.ReadPaymentExcel = ReadPaymentExcel;
