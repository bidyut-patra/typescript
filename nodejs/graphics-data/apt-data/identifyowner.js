"use strict";
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
var IdentifyOwner = /** @class */ (function () {
    function IdentifyOwner(mongo) {
        this.mongo = mongo;
    }
    IdentifyOwner.prototype.identifyTransactions = function (transactions) {
        return __awaiter(this, void 0, void 0, function () {
            var transactionCount, i, filter, owner, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transactionCount = transactions.length;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < transactionCount)) return [3 /*break*/, 5];
                        filter = this.getFilterToIdentifyTransactionOwner(transactions[i]);
                        transactions[i]['transactionMsgFilter'] = filter.transactionMsgFilter;
                        transactions[i]['commentFilter'] = filter.commentFilter;
                        owner = undefined;
                        if (!filter.dbFilter) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getTransactionOwner(filter.dbFilter)];
                    case 2:
                        result = _a.sent();
                        owner = result.transactionOwner;
                        _a.label = 3;
                    case 3:
                        if ((owner === undefined) || (owner.number === undefined)) {
                            console.log('transactionMsgFilter: ', filter.transactionMsgFilter);
                            console.log('commentFilter: ', filter.commentFilter);
                        }
                        if (owner && filter.aptNumber) {
                            transactions[i].aptNumber = filter.aptNumber;
                            transactions[i].owner = '';
                        }
                        else if (owner) {
                            transactions[i].aptNumber = owner.number;
                            transactions[i].owner = owner.name;
                        }
                        else if (filter.aptNumber) {
                            transactions[i].aptNumber = filter.aptNumber;
                            transactions[i].owner = '';
                        }
                        else {
                            transactions[i].aptNumber = '';
                            transactions[i].owner = '';
                        }
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, transactions];
                }
            });
        });
    };
    IdentifyOwner.prototype.getTransactionOwner = function (dbFilter) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.mongo.GetTransactionOwner(dbFilter).then(function (owner) {
                resolve({
                    transactionOwner: owner
                });
            });
        });
    };
    IdentifyOwner.prototype.getFilterToIdentifyTransactionOwner = function (transaction) {
        var aptNumber = this.getAptNumber(transaction.transactionMsg, '[\/\* ]');
        var transactionType = this.getPaymentType(transaction.transactionMsg);
        var transactionMsg = this.trimTraillingChars(transaction.transactionMsg, ['-']);
        var transactionMsgFilter = this.getFilterTexts(transactionMsg, '[\/\*]', true);
        var comment = this.trimTraillingChars(transaction.comment, ['/', ' ']);
        var commentFilter = this.getFilterTexts(comment, '[ ]', false);
        var filter = undefined;
        if (this.isFilterValid(transactionMsgFilter) && this.isFilterValid(commentFilter)) {
            filter = {
                $or: [
                    this.getDbFilter('transactionMsg', transactionMsgFilter),
                    this.getDbFilter('comment', commentFilter)
                ]
            };
        }
        else if (this.isFilterValid(transactionMsgFilter)) {
            filter = this.getDbFilter('transactionMsg', transactionMsgFilter);
        }
        else if (this.isFilterValid(commentFilter)) {
            filter = this.getDbFilter('comment', commentFilter);
        }
        else {
            filter = undefined;
        }
        return {
            aptNumber: aptNumber,
            transactionMsgFilter: transactionMsgFilter,
            commentFilter: commentFilter,
            dbFilter: filter,
            transactionType: transactionType
        };
    };
    IdentifyOwner.prototype.isFilterValid = function (filteredSubMsg) {
        return filteredSubMsg && filteredSubMsg.length > 0;
    };
    IdentifyOwner.prototype.getDbFilter = function (field, filters) {
        if (filters && filters.length > 0) {
            var filter = {};
            var regExFilters_1 = [];
            filters.forEach(function (f) {
                regExFilters_1.push(new RegExp(f));
            });
            filter[field] = {
                $in: regExFilters_1
            };
            return filter;
        }
        else {
            return undefined;
        }
    };
    IdentifyOwner.prototype.getFilterTexts = function (message, pattern, identifyNameOnce) {
        if (identifyNameOnce === void 0) { identifyNameOnce = false; }
        var subMessages = this.splitText(message, pattern);
        var filteredSubMsg = [];
        var filterOrderIndex = 0;
        var lastSubMsgType = undefined;
        var nameIdentified = false;
        for (var i = 0; i < subMessages.length; i++) {
            var subSubMessages = this.splitText(subMessages[i], '[ ]');
            var foundName = false;
            for (var j = 0; j < subSubMessages.length; j++) {
                if (this.isTextValid(subSubMessages[j])) {
                    if (this.isMobileNumber(subSubMessages[j])) {
                        filteredSubMsg.unshift(subSubMessages[j]);
                        lastSubMsgType = 'mobile';
                        filterOrderIndex++;
                    }
                    else if (this.isName(subSubMessages[j]) &&
                        this.allowNameIdentification(identifyNameOnce, nameIdentified)) {
                        if (lastSubMsgType === 'name') {
                            var lastSubMsg = filteredSubMsg[filterOrderIndex - 1];
                            filteredSubMsg[filterOrderIndex - 1] = lastSubMsg + '\\s+' + subSubMessages[j];
                        }
                        else {
                            filteredSubMsg.push(subSubMessages[j]);
                            filterOrderIndex++;
                        }
                        lastSubMsgType = 'name';
                        foundName = true;
                    }
                    else {
                        lastSubMsgType = undefined;
                    }
                }
            }
            nameIdentified = nameIdentified ? true : (foundName ? true : false);
        }
        return filteredSubMsg;
    };
    IdentifyOwner.prototype.allowNameIdentification = function (identifyNameOnce, foundName) {
        return identifyNameOnce ? (foundName ? false : true) : true;
    };
    IdentifyOwner.prototype.getAptNumber = function (message, pattern) {
        if (message && (message.length > 0)) {
            var numbers = message.match(/(\d+)/g);
            if (numbers !== null) {
                var aptNumber = undefined;
                var aptNumberFound = false;
                for (var i = 0; (i < numbers.length) && !aptNumberFound; i++) {
                    var number = numbers[i];
                    if (number) {
                        var aptNumbers = number.match(/^([1-4][0-4][0-9])$/);
                        aptNumberFound = (aptNumbers !== null) && (aptNumbers.length > 0);
                        if (aptNumberFound) {
                            aptNumber = aptNumbers[0];
                        }
                    }
                }
                return aptNumber;
            }
            else {
                return undefined;
            }
        }
        else {
            return undefined;
        }
    };
    IdentifyOwner.prototype.getPaymentType = function (message) {
        return message.startsWith('CHEQUE') ? 'cheque' : 'online';
    };
    IdentifyOwner.prototype.isTextValid = function (subMsg) {
        return subMsg !== 'BY' && subMsg !== 'FROM' && !subMsg.startsWith('TRANSFER') && subMsg !== 'Main' && subMsg !== 'BI' &&
            !subMsg.startsWith('CITI') && !subMsg.startsWith('Maintenance') && subMsg !== 'CR' && subMsg !== 'TRANSFER-UPI' &&
            !subMsg.startsWith('CHEQUE') && !subMsg.startsWith('CHQ') && !subMsg.startsWith('CLEARING') && subMsg !== 'Se' &&
            !subMsg.startsWith('HDFC') && !subMsg.startsWith('SBIN') && !subMsg.startsWith('ICIC') && !subMsg.startsWith('Paym') &&
            !subMsg.startsWith('IMPS') && !subMsg.startsWith('HSBC') && !subMsg.startsWith('UTIB') && subMsg !== 'MICR' &&
            !subMsg.startsWith('Society') && !subMsg.toLowerCase().startsWith('july') && !subMsg.toLowerCase().startsWith('aug') &&
            !subMsg.toLowerCase().startsWith('sep') && !subMsg.startsWith('for') && subMsg !== 'UTILITY' && subMsg !== 'A' &&
            !subMsg.toLowerCase().startsWith('june') && subMsg !== 'EVA' && subMsg.toLowerCase() !== 'to' && subMsg !== 'MBS' &&
            !subMsg.toLowerCase().startsWith('main') && subMsg !== 'UPI' && !subMsg.toLowerCase().startsWith('jul') &&
            subMsg.toLowerCase() !== 'rs' && subMsg.toLowerCase() !== 'rs.' && !subMsg.toLowerCase().startsWith('rent') &&
            !subMsg.toLowerCase().startsWith('bloc') && !subMsg.toLowerCase().startsWith('exp') &&
            !subMsg.toLowerCase().startsWith('due') && !subMsg.toLowerCase().startsWith('toward') &&
            subMsg.toLowerCase() !== 'others' && !subMsg.toLowerCase().startsWith('flat') &&
            subMsg.toLowerCase() !== 'no' && subMsg.toLowerCase() !== 'radiant';
    };
    IdentifyOwner.prototype.isMobileNumber = function (subMsg) {
        var matches = subMsg.match(/^[3-9][0-9]{9}$/);
        return (matches !== null) && matches.length === 1 ? true : false;
    };
    IdentifyOwner.prototype.isName = function (subMsg) {
        var matches = subMsg.match(/^[a-zA-Z]+$/);
        return (matches !== null) && matches.length === 1 ? true : false;
    };
    IdentifyOwner.prototype.isAlphanumeric = function (subMsg) {
        var matches = subMsg.match(/^[a-zA-Z0-9]+$/);
        return matches && matches.length === 1 ? true : false;
    };
    IdentifyOwner.prototype.splitText = function (message, pattern) {
        var regex = new RegExp(pattern, 'g');
        var splitStrings = message.split(regex);
        return splitStrings;
    };
    IdentifyOwner.prototype.trimChars = function (message, leadingChars, traillingChars) {
        var messageAfterLeadingCharsRemoval = this.trimLeadingChars(message, leadingChars);
        return this.trimTraillingChars(messageAfterLeadingCharsRemoval, traillingChars);
    };
    IdentifyOwner.prototype.trimTraillingChars = function (message, characters) {
        for (var i = 0; i < characters.length; i++) {
            var character = characters[i];
            while (message.endsWith(character)) {
                message = message.substring(0, message.length - 2);
            }
        }
        return message;
    };
    IdentifyOwner.prototype.trimLeadingChars = function (message, characters) {
        for (var i = 0; i < characters.length; i++) {
            var character = characters[i];
            while (message.endsWith(character)) {
                message = message.substring(0, message.length - 2);
            }
        }
        return message;
    };
    return IdentifyOwner;
}());
exports.IdentifyOwner = IdentifyOwner;
