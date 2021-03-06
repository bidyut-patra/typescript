"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var XLSX = __importStar(require("xlsx"));
function readMainExcelFile(excelFile, initializeData) {
    var workbook = XLSX.readFile(excelFile);
    var sheetNames = workbook.SheetNames;
    var paymentBalances = readResidentsMaintenancePayment(sheetNames, workbook);
    var consolidatedPayments = readResidentsConsolidatedPayment(workbook.Sheets[sheetNames[0]], paymentBalances.penalties);
    var corpusPayments = readResidentsCorpusWaterPayment(workbook.Sheets[sheetNames[2]]);
    var commercialPayments = readResidentsCommercialPayment(workbook.Sheets[sheetNames[3]]);
    initializeData.payments(consolidatedPayments);
    initializeData.transactions(paymentBalances.payments.concat(corpusPayments, commercialPayments));
}
exports.readMainExcelFile = readMainExcelFile;
function readBankExcelFile(excelFile, saveTransactions) {
    var workbook = XLSX.readFile(excelFile);
    var sheet = workbook.Sheets[workbook.SheetNames[0]];
    var credits = readCreditData(sheet);
    if ((saveTransactions !== undefined) && (credits.length > 0)) {
        saveTransactions(credits);
    }
}
exports.readBankExcelFile = readBankExcelFile;
function readCreditData(creditSheet) {
    var row = 2;
    var cellLetters = ['B', 'C', 'D', 'F', 'G'];
    var credits = [];
    while (creditSheet && hasValidDataAtLeastInOneCell(cellLetters, row, creditSheet)) {
        var date = creditSheet['B' + row] ? new Date(creditSheet['B' + row].w).toString() : undefined;
        var description = creditSheet['C' + row] ? trimSpaces(creditSheet['C' + row].v) : undefined;
        var comment = creditSheet['D' + row] ? trimSpaces(creditSheet['D' + row].v) : undefined;
        var debitAmount = creditSheet['F' + row] ? getNumber(creditSheet['F' + row].w) : undefined;
        var maintenance = creditSheet['G' + row] ? getNumber(creditSheet['G' + row].w) : undefined;
        if (maintenance && (maintenance > 0)) {
            var paymentData = {};
            paymentData.aptNumber = '';
            paymentData.owner = '';
            paymentData.transactionType = getTransactionType(description);
            paymentData.transactionMsg = description;
            paymentData.paymentDate = date;
            paymentData.paymentType = 'maintenance';
            paymentData.debitAmount = debitAmount;
            paymentData.paidAmount = maintenance;
            paymentData.comment = comment;
            credits.push(paymentData);
        }
        row++;
    }
    return credits;
}
function readResidentsConsolidatedPayment(consolidatedSheet, penalties) {
    var consolidatedPayments = {};
    var row = 5;
    var cellLetters = ['A', 'C', 'D', 'E', 'F'];
    while (consolidatedSheet && hasValidDataAtLeastInOneCell(cellLetters, row, consolidatedSheet)) {
        var aptNumber = getNumber(consolidatedSheet['A' + row].w);
        consolidatedPayments[aptNumber] = {};
        var totalPenalty = getPenalty(penalties[aptNumber]);
        var mCellValue = getNumber(consolidatedSheet['C' + row].w);
        var maintenance = mCellValue >= totalPenalty ? mCellValue - totalPenalty : mCellValue;
        var totalDue = getNumber(consolidatedSheet['F' + row].w);
        maintenance = totalDue < 0 ? maintenance + totalDue : maintenance;
        consolidatedPayments[aptNumber].maintenance = maintenance;
        consolidatedPayments[aptNumber].penalty = totalPenalty <= mCellValue ? totalPenalty : 0;
        consolidatedPayments[aptNumber].corpus = getNumber(consolidatedSheet['D' + row].w);
        consolidatedPayments[aptNumber].water = getNumber(consolidatedSheet['E' + row].w);
        consolidatedPayments[aptNumber].advance = totalDue < 0 ? Math.abs(totalDue) : 0;
        row++;
        if (row > 168)
            break;
    }
    return consolidatedPayments;
}
function readResidentsMaintenancePayment(sheetNames, workbook) {
    var paymentBalances = {
        payments: [],
        penalties: {}
    };
    for (var i = 4; i < sheetNames.length; i++) {
        var sheetName = getNumber(sheetNames[i]);
        var sheet = workbook.Sheets[sheetName];
        paymentBalances.penalties[sheetName] = [];
        var row = 16;
        var cellLetters = ['A', 'B', 'C', 'E', 'F', 'G', 'H'];
        while (sheet && hasValidDataAtLeastInOneCell(cellLetters, row, sheet)) {
            var date = sheet['A' + row] ? new Date(sheet['A' + row].w).toString() : undefined;
            var maintenance = sheet['B' + row] ? sheet['B' + row].w : (sheet['E' + row] ? sheet['E' + row].w : undefined);
            maintenance = maintenance ? getNumber(maintenance) : maintenance;
            var asd = sheet['C' + row] ? sheet['C' + row].w : (sheet['F' + row] ? sheet['F' + row].w : undefined);
            asd = asd ? getNumber(asd) : asd;
            if (maintenance && asd) {
                maintenance = maintenance + asd;
            }
            else if (asd) {
                maintenance = asd;
            }
            var penalty = sheet['G' + row] ? sheet['G' + row].w : undefined;
            penalty = penalty ? getNumber(penalty) : penalty;
            var remark = sheet['H' + row] ? trimSpaces(sheet['H' + row].w) : undefined;
            if (maintenance) {
                var paymentData = {};
                paymentData.aptNumber = sheetName;
                paymentData.owner = '';
                paymentData.transactionType = getTransactionType(remark);
                paymentData.transactionMsg = remark;
                paymentData.paymentDate = date;
                paymentData.paymentType = 'maintenance';
                paymentData.paidAmount = maintenance;
                paymentData.comment = remark;
                paymentBalances.payments.push(paymentData);
            }
            if (penalty) {
                var penaltyData = {};
                penaltyData.date = date;
                penaltyData.penalty = penalty;
                penaltyData.remark = remark;
                paymentBalances.penalties[sheetName].push(penaltyData);
            }
            row++;
        }
    }
    return paymentBalances;
}
function readResidentsCorpusWaterPayment(corpusWaterSheet) {
    var row = 2;
    var cellLetters = ['A', 'C', 'D', 'E', 'F'];
    var corpusPayments = [];
    while (corpusWaterSheet && hasValidDataAtLeastInOneCell(cellLetters, row, corpusWaterSheet)) {
        var corpusPayment = {};
        var aptNumber = getNumber(corpusWaterSheet['A' + row].w);
        corpusPayment.aptNumber = aptNumber;
        corpusPayment.owner = '';
        var corpus = corpusWaterSheet['C' + row] ? corpusWaterSheet['C' + row].w : undefined;
        corpus = corpus ? getNumber(corpus) : corpus;
        var corpusRemark = corpusWaterSheet['D' + row] ? corpusWaterSheet['D' + row].w : undefined;
        corpusRemark = corpusRemark ? trimSpaces(corpusRemark) : corpusRemark;
        var water = corpusWaterSheet['E' + row] ? corpusWaterSheet['E' + row].w : undefined;
        water = water ? getNumber(water) : water;
        if (corpus && water) {
            corpusPayment.paidAmount = corpus + water;
        }
        else if (corpus) {
            corpusPayment.paidAmount = corpus;
        }
        else if (water) {
            corpusPayment.paidAmount = water;
        }
        else {
            corpusPayment.paidAmount = undefined;
        }
        var waterRemark = corpusWaterSheet['F' + row] ? corpusWaterSheet['F' + row].w : undefined;
        waterRemark = waterRemark ? trimSpaces(waterRemark) : waterRemark;
        if (corpusRemark === waterRemark) {
            if (corpus && water) {
                corpusPayment.transactionType = getTransactionType(corpusRemark);
                corpusPayment.transactionMsg = corpusRemark;
                corpusPayment.paymentType = 'corpus',
                    corpusPayment.comment = 'corpus + water';
            }
        }
        else {
            if (corpus) {
                corpusPayment.transactionType = getTransactionType(corpusRemark);
                corpusPayment.transactionMsg = corpusRemark;
                corpusPayment.paymentType = 'corpus',
                    corpusPayment.comment = 'corpus';
            }
            if (water) {
                corpusPayment.transactionType = getTransactionType(waterRemark);
                corpusPayment.transactionMsg = waterRemark;
                corpusPayment.paymentType = 'water',
                    corpusPayment.comment = 'water';
            }
        }
        corpusPayments.push(corpusPayment);
        row++;
    }
    return corpusPayments;
}
function readResidentsCommercialPayment(commercialSheet) {
    var commercialPayments = [];
    var row = 15;
    var cellLetters = ['A', 'E', 'H'];
    while (commercialSheet && hasValidDataAtLeastInOneCell(cellLetters, row, commercialSheet)) {
        var commercialPayment = {};
        commercialPayment.aptNumber = 0;
        commercialPayment.owner = 'RSROA';
        commercialPayment.transactionMsg = commercialSheet['H' + row] ? commercialSheet['H' + row].w : undefined;
        commercialPayment.transactionMsg = commercialPayment.transactionMsg ? trimSpaces(commercialPayment.transactionMsg) : commercialPayment.transactionMsg;
        commercialPayment.transactionType = getTransactionType(commercialPayment.transactionMsg);
        commercialPayment.paymentType = 'commercial';
        commercialPayment.paymentDate = commercialSheet['A' + row] ? new Date(commercialSheet['A' + row].w).toString() : undefined;
        commercialPayment.paidAmount = commercialSheet['E' + row] ? commercialSheet['E' + row].w : undefined;
        commercialPayment.paidAmount = commercialPayment.paidAmount ? getNumber(commercialPayment.paidAmount) : commercialPayment.paidAmount;
        commercialPayment.comment = 'Commercial payment';
        commercialPayments.push(commercialPayment);
        row++;
    }
    return commercialPayments;
}
function getTransactionType(remark) {
    if (remark) {
        var remarkInLowerCase = remark.toLowerCase();
        var isCashTransaction = remarkInLowerCase.indexOf('cash') >= 0;
        var isChequeTransaction = remarkInLowerCase.indexOf('cheque') >= 0;
        return isCashTransaction ? 'cash' : (isChequeTransaction ? 'cheque' : 'online');
    }
    else {
        return 'online';
    }
}
function getPenalty(penalties) {
    if (penalties && (penalties.length > 0)) {
        var totalPenalty = 0;
        var cutOffDate = new Date('4/15/2020');
        for (var i = 0; i < penalties.length; i++) {
            if (penalties[i].date) {
                var date = new Date(penalties[i].date);
                if (date.getTime() >= cutOffDate.getTime()) {
                    totalPenalty += penalties[i].penalty;
                }
            }
        }
        return totalPenalty;
    }
    else {
        return 0;
    }
}
function hasValidDataAtLeastInOneCell(cells, row, sheet) {
    var _hasValidDataAtLeastInOneCell = false;
    for (var i = 0; (i < cells.length) && !_hasValidDataAtLeastInOneCell; i++) {
        if (sheet[cells[i] + row]) {
            _hasValidDataAtLeastInOneCell = true;
        }
    }
    return _hasValidDataAtLeastInOneCell;
}
function getNumber(cellVal) {
    if (cellVal) {
        cellVal = trimSpaces(cellVal);
        if (cellVal === '-') {
            return 0;
        }
        else if (cellVal === '') {
            return 0;
        }
        else {
            var rowCell = "'" + cellVal + "'";
            rowCell = rowCell.replace(',', '');
            rowCell = rowCell.replace("'", "");
            rowCell = rowCell.replace("'", "");
            rowCell = rowCell.replace('"', '');
            rowCell = rowCell.replace('"', '');
            rowCell = rowCell.replace('(', '');
            rowCell = rowCell.replace(')', '');
            return parseInt(rowCell);
        }
    }
    else {
        return 0;
    }
}
function trimSpaces(value) {
    if (value) {
        value = value.replace(/\s\s+/g, ' ');
        value = value.replace(/^\s+/, '');
        value = value.replace(/\s+$/, '');
    }
    return value;
}
