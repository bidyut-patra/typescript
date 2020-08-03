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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var exceljs_1 = require("exceljs");
var dateformat_1 = __importDefault(require("dateformat"));
var Excel = /** @class */ (function () {
    function Excel() {
    }
    /**
     * Reads the excel data
     *
     * @param transactionFile
     * @param configurations
     */
    Excel.prototype.readFile = function (transactionFile, configurations) {
        return __awaiter(this, void 0, void 0, function () {
            var workbook, dataSheets, i, configuration, sheet, data, row, cells, excelRow, rowData, i_1, cell, cellValue, formattedValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        workbook = new exceljs_1.Workbook();
                        return [4 /*yield*/, workbook.xlsx.readFile(transactionFile)];
                    case 1:
                        _a.sent();
                        dataSheets = {};
                        for (i = 0; i < configurations.length; i++) {
                            configuration = configurations[i];
                            sheet = workbook.getWorksheet(configuration.sheetName);
                            data = [];
                            if (sheet) {
                                row = configuration.row;
                                cells = configuration.cells;
                                excelRow = sheet.getRow(row);
                                while (this.isValidRow(cells, excelRow)) {
                                    rowData = {};
                                    for (i_1 = 0; i_1 < cells.length; i_1++) {
                                        cell = cells[i_1];
                                        cellValue = excelRow.getCell(cell.label).value;
                                        formattedValue = this.getFormattedData(cellValue, cell.type, cell.array, cell.separator);
                                        if (rowData[cell.column]) {
                                            rowData[cell.column] += formattedValue ? formattedValue : 0;
                                        }
                                        else {
                                            rowData[cell.column] = formattedValue;
                                        }
                                    }
                                    data.push(rowData);
                                    excelRow = sheet.getRow(++row);
                                }
                            }
                            dataSheets[configuration.sheetName] = data;
                        }
                        return [2 /*return*/, dataSheets];
                }
            });
        });
    };
    /**
     * Update the excel sheets
     *
     * @param sourceFile
     * @param targetFile
     * @param configurations
     * @param transactions
     */
    Excel.prototype.updateFile = function (sourceFile, targetFile, configurations, transactions) {
        return __awaiter(this, void 0, void 0, function () {
            var workbook, aptCounter, _loop_1, this_1, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        workbook = new exceljs_1.Workbook();
                        return [4 /*yield*/, workbook.xlsx.readFile(sourceFile)];
                    case 1:
                        _a.sent();
                        aptCounter = 0;
                        _loop_1 = function (i) {
                            var configuration = configurations[i];
                            var sheet = workbook.getWorksheet(configuration.sheetName);
                            var sheetTransactions = transactions[configuration.sheetName];
                            if (sheet && sheetTransactions && (sheetTransactions.length > 0)) {
                                var row = configuration.row;
                                var cells = configuration.cells;
                                var excelRow_1 = sheet.getRow(row);
                                while (this_1.isValidRow(cells, excelRow_1)) {
                                    excelRow_1 = sheet.getRow(++row);
                                }
                                ;
                                var _loop_2 = function (j) {
                                    var transaction = sheetTransactions[j];
                                    cells.forEach(function (cell) {
                                        if (cell.update) {
                                            excelRow_1.getCell(cell.label).alignment = cell.alignment;
                                            if (cell.type === 'date') {
                                                var dateValue = transaction[cell.column];
                                                var dateString = dateformat_1.default(dateValue, cell.valueFormat);
                                                var formattedDate = dateformat_1.default(dateValue, cell.cellFormat);
                                                excelRow_1.getCell(cell.label).value = dateString;
                                            }
                                            else {
                                                if (transaction[cell.column]) {
                                                    excelRow_1.getCell(cell.label).value = transaction[cell.column];
                                                }
                                            }
                                        }
                                    });
                                    excelRow_1 = sheet.getRow(++row);
                                };
                                for (var j = 0; j < sheetTransactions.length; j++) {
                                    _loop_2(j);
                                }
                                aptCounter++;
                            }
                        };
                        this_1 = this;
                        for (i = 0; i < configurations.length; i++) {
                            _loop_1(i);
                        }
                        console.log(aptCounter);
                        return [4 /*yield*/, workbook.xlsx.writeFile(targetFile)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets the formatted data
     *
     * @param cellValue
     * @param type
     */
    Excel.prototype.getFormattedData = function (cellValue, type, array, separator) {
        if ((cellValue === null) || (cellValue === undefined)) {
            return undefined;
        }
        else {
            var arrayValues = [];
            if (array && separator) {
                arrayValues = this.splitText(cellValue.toString(), separator);
            }
            var formattedValue = undefined;
            switch (type) {
                case 'date':
                    formattedValue = dateformat_1.default(new Date(cellValue), 'd-mmm-yyyy');
                    break;
                case 'number':
                    formattedValue = arrayValues.length === 0 ? parseFloat(cellValue) : arrayValues.map(function (a) { return parseFloat(a); });
                    break;
                case 'string':
                    formattedValue = cellValue.toString();
                    break;
                default:
                    formattedValue = cellValue;
                    break;
            }
            return formattedValue;
        }
    };
    /**
     * Checks if this is a row with valid data or an empty row
     *
     * @param cells
     * @param excelRow
     */
    Excel.prototype.isValidRow = function (cells, excelRow) {
        var _hasValidDataAtLeastInOneCell = false;
        for (var i = 0; (i < cells.length) && !_hasValidDataAtLeastInOneCell; i++) {
            if (excelRow.getCell(cells[i].label).value) {
                _hasValidDataAtLeastInOneCell = true;
            }
        }
        return _hasValidDataAtLeastInOneCell;
    };
    /**
     * Splits the text based on given separator
     *
     * @param message
     * @param pattern
     */
    Excel.prototype.splitText = function (message, pattern) {
        if (message) {
            var regex = new RegExp(pattern, 'g');
            var splitStrings = message.split(regex);
            return splitStrings;
        }
        else {
            return [];
        }
    };
    return Excel;
}());
exports.Excel = Excel;
