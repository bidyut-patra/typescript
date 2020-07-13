"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IdentifyOwner = /** @class */ (function () {
    function IdentifyOwner(mongo) {
        this.mongo = mongo;
    }
    IdentifyOwner.prototype.identifyTransactions = function (transactions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Identify the owner from the transaction message and comment and old payment history
            var transactionCount = transactions.length;
            for (var i = 0; i < transactionCount; i++) {
                var mFilter = _this.getFilterToIdentifyTransactionOwner(transactions[i]);
                _this.getTransactionOwner(i, mFilter).then(function (result) {
                    if (result.transactionOwner) {
                        var aptNumberFromDb = result.transactionOwner.number;
                        var aptNumber = result.conflict && (result.conflict.length > 0) ? result.conflict[0] : aptNumberFromDb;
                        transactions[result.transactionIndex].aptNumber = aptNumber;
                        transactions[result.transactionIndex].owner = result.transactionOwner.name;
                        transactions[result.transactionIndex]['transactionMsgFilter'] = result.transactionMsgFilter;
                        transactions[result.transactionIndex]['commentFilter'] = result.commentFilter;
                        transactions[result.transactionIndex]['conflict'] = result.conflict;
                        // Save the transactions to database when the owner is identified for the last transaction
                        if (result.transactionIndex === (transactionCount - 1)) {
                            resolve(transactions);
                        }
                    }
                });
            }
        });
    };
    IdentifyOwner.prototype.getTransactionOwner = function (index, mFilter) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.mongo.GetTransactionOwner(mFilter.dbFilter).then(function (owner) {
                var conflictingApts = [];
                if (mFilter.aptNumber && owner && owner.number) {
                    var aptNumberMatch = parseInt(mFilter.aptNumber) !== parseInt(owner.number);
                    owner.number = aptNumberMatch ? mFilter.aptNumber : owner.number;
                }
                if (owner === undefined) {
                    console.log('transactionMsgFilter: ', mFilter.transactionMsgFilter);
                    console.log('commentFilter: ', mFilter.commentFilter);
                }
                resolve({
                    transactionIndex: index,
                    transactionOwner: owner,
                    transactionMsgFilter: mFilter.transactionMsgFilter,
                    commentFilter: mFilter.commentFilter,
                    conflict: conflictingApts
                });
            });
        });
    };
    IdentifyOwner.prototype.getFilterToIdentifyTransactionOwner = function (transaction) {
        var aptNumber = this.getAptNumber(transaction.transactionMsg, '[\/\* ]');
        var transactionType = this.getTransactionType(transaction.transactionMsg);
        var transactionMsgFilter = this.getFilter(transaction.transactionMsg, '[\/\*]');
        var commentFilter = this.getFilter(transaction.comment, '[ ]');
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
    IdentifyOwner.prototype.getFilter = function (message, pattern) {
        var subMessages = this.splitText(message, pattern);
        var filteredSubMsg = [];
        var filterOrderIndex = 0;
        var lastSubMsgType = undefined;
        for (var i = 0; i < subMessages.length; i++) {
            var subSubMessages = this.splitText(subMessages[i], '[ ]');
            for (var j = 0; j < subSubMessages.length; j++) {
                if (this.isTextValid(subSubMessages[j])) {
                    if (this.isMobileNumber(subSubMessages[j])) {
                        filteredSubMsg.unshift(subSubMessages[j]);
                        lastSubMsgType = 'mobile';
                        filterOrderIndex++;
                    }
                    else if (this.isName(subSubMessages[j])) {
                        if (lastSubMsgType === 'name') {
                            var lastSubMsg = filteredSubMsg[filterOrderIndex - 1];
                            filteredSubMsg[filterOrderIndex - 1] = lastSubMsg + '\\s+' + subSubMessages[j];
                        }
                        else {
                            filteredSubMsg.splice(filterOrderIndex, 0, subSubMessages[j]);
                            filterOrderIndex++;
                        }
                        lastSubMsgType = 'name';
                    }
                    else {
                        lastSubMsgType = undefined;
                    }
                }
            }
        }
        return filteredSubMsg;
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
    IdentifyOwner.prototype.getTransactionType = function (message) {
        return message.startsWith('CHEQUE') ? 'cheque' : 'online';
    };
    IdentifyOwner.prototype.isTextValid = function (subMsg) {
        return subMsg !== 'BY' && subMsg !== 'FROM' && !subMsg.startsWith('TRANSFER') && subMsg !== 'Main' &&
            !subMsg.startsWith('CITI') && !subMsg.startsWith('Maintenance') && subMsg !== 'CR' &&
            !subMsg.startsWith('CHEQUE') && !subMsg.startsWith('CHQ') && !subMsg.startsWith('CLEARING') &&
            !subMsg.startsWith('HDFC') && !subMsg.startsWith('SBIN') && !subMsg.startsWith('ICIC') &&
            !subMsg.startsWith('IMPS') && !subMsg.startsWith('HSBC') && !subMsg.startsWith('UTIB') &&
            !subMsg.startsWith('Society') && !subMsg.toLowerCase().startsWith('july') && !subMsg.toLowerCase().startsWith('aug') &&
            !subMsg.toLowerCase().startsWith('sep') && !subMsg.startsWith('for') && subMsg !== 'UTILITY' && subMsg !== 'A' &&
            !subMsg.toLowerCase().startsWith('june') && subMsg !== 'EVA' && subMsg !== 'TO' && !subMsg.toLowerCase().startsWith('main') &&
            subMsg.toLowerCase() !== 'rs' && subMsg.toLowerCase() !== 'rs.' && !subMsg.toLowerCase().startsWith('rent') &&
            !subMsg.toLowerCase().startsWith('bloc') && !subMsg.toLowerCase().startsWith('exp') &&
            !subMsg.toLowerCase().startsWith('flat') && subMsg.toLowerCase() !== 'no';
    };
    IdentifyOwner.prototype.isMobileNumber = function (subMsg) {
        var matches = subMsg.match(/^[4-9]\d{9}$/);
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
    IdentifyOwner.prototype.trimChars = function (message, characters) {
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
