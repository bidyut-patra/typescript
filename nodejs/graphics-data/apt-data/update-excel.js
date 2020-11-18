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
Object.defineProperty(exports, "__esModule", { value: true });
var excel_1 = require("./excel");
var UpdateExcel = /** @class */ (function (_super) {
    __extends(UpdateExcel, _super);
    function UpdateExcel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UpdateExcel.prototype.writeTransactionDetails = function (transactions) {
        return __awaiter(this, void 0, void 0, function () {
            var result, dir, sourceTransFile, targetTransFile, sourcePaymentFile, targetPaymentFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = this.prepareOwnerTransactionData(transactions);
                        dir = 'C:\\WORK@SE\\Personal\\RSROA\\FY20_FY21_Q3\\';
                        sourceTransFile = dir + '2019-20 Transaction New Association_30_Sep.xlsx';
                        targetTransFile = dir + '2019-20 Transaction New Association_17_Oct.xlsx';
                        return [4 /*yield*/, this.updateFile(sourceTransFile, targetTransFile, this.getTransactionFileConfigurations(), result.transactions)];
                    case 1:
                        _a.sent();
                        sourcePaymentFile = dir + 'JULY_SEP_FY20_21-Q1_Q4_Sheet_2_Oct.xlsx';
                        targetPaymentFile = dir + 'JULY_SEP_FY20_21-Q1_Q4_Sheet_17_Oct.xlsx';
                        return [4 /*yield*/, this.updateFile(sourcePaymentFile, targetPaymentFile, this.getPaymentFileConfigurations(), result.payments)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Prepares the transaction list
     *
     * @param transactions
     */
    UpdateExcel.prototype.prepareOwnerTransactionData = function (transactions) {
        var result = {
            payments: {},
            transactions: {
                Main: []
            }
        };
        for (var i = 0; i < transactions.length; i++) {
            var transaction = transactions[i];
            var aptNumberStr = transaction.aptNumber ? transaction.aptNumber.toString() : undefined;
            var aptNumber = aptNumberStr ? parseInt(aptNumberStr) : '';
            result.transactions.Main.push({
                aptNumber: aptNumber,
                paymentDate: transaction.paymentDate,
                paidAmount: transaction.paidAmount,
                transactionMsg: transaction.transactionMsg,
                comment: transaction.comment
            });
            if (aptNumberStr) {
                if (result.payments[aptNumber] === undefined) {
                    result.payments[aptNumber] = [];
                }
                result.payments[aptNumber].push({
                    paymentDate: transaction.paymentDate,
                    paidAmount: transaction.paidAmount,
                    transactionMsg: transaction.transactionMsg
                });
                var day = new Date(transaction.paymentDate).getDate();
                if (day > 15) {
                    result.payments[aptNumber].push({
                        paymentDate: transaction.paymentDate,
                        penalty: '(500)',
                        transactionMsg: 'Late payment charges'
                    });
                }
            }
            else {
                console.log('Apt Number Not Found');
            }
        }
        console.log('transactions', Object.keys(result.transactions).length);
        console.log('payments', Object.keys(result.payments).length);
        return result;
    };
    /**
     * Gets the configuration
     */
    UpdateExcel.prototype.getTransactionFileConfigurations = function () {
        var configurations = [];
        configurations.push({
            sheetName: 'Main',
            row: 2,
            cells: [
                {
                    label: 'A',
                    column: 'paymentDate',
                    type: 'date',
                    valueFormat: 'm/dd/yyyy',
                    cellFormat: 'd-mmm-yy',
                    alignment: { horizontal: 'right', vertical: 'middle' },
                    update: true
                },
                {
                    label: 'B',
                    column: 'paymentDate',
                    type: 'date',
                    valueFormat: 'm/dd/yyyy',
                    cellFormat: 'd-mmm-yy',
                    alignment: { horizontal: 'right', vertical: 'middle' },
                    update: true
                },
                {
                    label: 'C',
                    column: 'transactionMsg',
                    type: 'string',
                    alignment: { horizontal: 'left', vertical: 'middle' },
                    update: true
                },
                {
                    label: 'D',
                    column: 'debitAmount',
                    type: 'number',
                    alignment: { horizontal: 'right', vertical: 'middle' },
                    update: true
                },
                {
                    label: 'E',
                    column: 'paidAmount',
                    type: 'number',
                    alignment: { horizontal: 'right', vertical: 'middle' },
                    update: true
                },
                {
                    label: 'F',
                    column: 'aptNumber',
                    type: 'number',
                    alignment: { horizontal: 'right', vertical: 'middle' },
                    update: true
                },
                {
                    label: 'G',
                    column: 'owner',
                    type: 'string',
                    alignment: { horizontal: 'left', vertical: 'middle' },
                    update: true
                },
                {
                    label: 'I',
                    column: 'comment',
                    type: 'string',
                    alignment: { horizontal: 'left', vertical: 'middle' },
                    update: true
                }
            ]
        });
        return configurations;
    };
    UpdateExcel.prototype.getPaymentFileConfigurations = function () {
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
                        type: 'date',
                        valueFormat: 'mm/dd/yyyy',
                        cellFormat: 'd-mmm-yy',
                        alignment: { horizontal: 'right', vertical: 'middle' },
                        update: true
                    },
                    {
                        label: 'B',
                        column: 'paidAmount',
                        type: 'number',
                        update: false
                    },
                    {
                        label: 'C',
                        column: 'paidAmount',
                        type: 'number',
                        update: false
                    },
                    {
                        label: 'D',
                        column: 'paidAmount',
                        type: 'number',
                        update: false
                    },
                    {
                        label: 'E',
                        column: 'paidAmount',
                        type: 'number',
                        alignment: { horizontal: 'right', vertical: 'middle' },
                        update: true
                    },
                    {
                        label: 'F',
                        column: 'paidAmount',
                        type: 'number',
                        update: false
                    },
                    {
                        label: 'G',
                        column: 'penalty',
                        type: 'string',
                        update: true
                    },
                    {
                        label: 'H',
                        column: 'transactionMsg',
                        type: 'string',
                        alignment: { horizontal: 'left', vertical: 'middle' },
                        update: true
                    }
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
    return UpdateExcel;
}(excel_1.Excel));
exports.UpdateExcel = UpdateExcel;
