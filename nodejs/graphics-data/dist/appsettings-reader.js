"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var AppSettings = /** @class */ (function () {
    function AppSettings() {
    }
    AppSettings.initialize = function () {
        return new Promise(function (resolve, reject) {
            var fileName = './/appsettings.json';
            fs.readFile(fileName, 'utf8', function (err, data) {
                if (err)
                    throw err;
                AppSettings.settings = JSON.parse(data);
                resolve();
            });
        });
    };
    Object.defineProperty(AppSettings, "DbConnectionString", {
        get: function () {
            return AppSettings.settings.db.connectionString;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppSettings, "Origins", {
        get: function () {
            return AppSettings.settings.origins;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppSettings, "PopulateData", {
        get: function () {
            return AppSettings.settings.populateData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppSettings, "InputTransactionFile", {
        get: function () {
            return AppSettings.settings.output.outputDir + '/' + AppSettings.settings.output.transactionSheet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppSettings, "InputPaymentFile", {
        get: function () {
            return AppSettings.settings.output.outputDir + '/' + AppSettings.settings.output.paymentSheet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppSettings, "OutputTransactionFile", {
        get: function () {
            var fileNameWithoutExtn = AppSettings.getFileNameWithoutExtn(AppSettings.settings.output.transactionSheet);
            var fileExtn = AppSettings.getFileExtn(AppSettings.settings.output.transactionSheet);
            var outputTransactionFileName = fileNameWithoutExtn + AppSettings.getDayMonth() + "." + fileExtn;
            return AppSettings.settings.output.outputDir + '/' + outputTransactionFileName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppSettings, "OutputPaymentFile", {
        get: function () {
            var fileNameWithoutExtn = AppSettings.getFileNameWithoutExtn(AppSettings.settings.output.paymentSheet);
            var fileExtn = AppSettings.getFileExtn(AppSettings.settings.output.paymentSheet);
            var outputPaymentFileName = fileNameWithoutExtn + AppSettings.getDayMonth() + "." + fileExtn;
            return AppSettings.settings.output.outputDir + '/' + outputPaymentFileName;
        },
        enumerable: true,
        configurable: true
    });
    AppSettings.getFileExtn = function (fileName) {
        var fileExtn;
        var index = fileName ? fileName.lastIndexOf(".") : -1;
        fileExtn = index >= 0 ? fileName.substring(index + 1) : fileName;
        return fileExtn;
    };
    AppSettings.getFileNameWithoutExtn = function (fileName) {
        var fileNameWithoutExtn;
        var index = fileName ? fileName.lastIndexOf(".") : -1;
        fileNameWithoutExtn = index >= 0 ? fileName.substring(0, index) : fileName;
        return fileNameWithoutExtn;
    };
    AppSettings.getDayMonth = function () {
        var today = new Date();
        var day = today.getDate();
        var month = today.getMonth();
        return "_" + day + "_" + AppSettings.getMonth(month);
    };
    AppSettings.getMonth = function (month) {
        var monthArr = new Array();
        monthArr[0] = "JAN";
        monthArr[1] = "FEB";
        monthArr[2] = "MAR";
        monthArr[3] = "APR";
        monthArr[4] = "MAY";
        monthArr[5] = "JUN";
        monthArr[6] = "JUL";
        monthArr[7] = "AUG";
        monthArr[8] = "SEP";
        monthArr[9] = "OCT";
        monthArr[10] = "NOV";
        monthArr[11] = "DEC";
        return monthArr[month];
    };
    return AppSettings;
}());
exports.AppSettings = AppSettings;
