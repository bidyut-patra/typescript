"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utility = /** @class */ (function () {
    function Utility() {
    }
    Utility.trimSpaces = function (text) {
        if (text) {
            return text.replace(/\s/g, '');
        }
        else {
            return text;
        }
    };
    Utility.trimChars = function (text, characters) {
        if (text) {
            for (var i = 0; i < characters.length; i++) {
                var character = characters[i];
                text = text.replace(new RegExp(character, 'g'), '');
            }
        }
        return text;
    };
    Utility.trimLeadingSpaces = function (text) {
        return text.replace(/^\s*(.*)/, "$1");
    };
    Utility.trimTrailingSpaces = function (text) {
        return text.replace(/(.*)\s*$/, "$1");
    };
    Utility.getNumber = function (val) {
        if (val) {
            if (val === '-') {
                return 0;
            }
            else if (val === '') {
                return 0;
            }
            else {
                var strVal = '\'' + val + '\'';
                strVal = strVal.replace(/,/g, '');
                strVal = strVal.replace('\'', '');
                strVal = strVal.replace('\'', '');
                strVal = strVal.replace('"', '');
                strVal = strVal.replace('"', '');
                strVal = strVal.replace('(', '');
                strVal = strVal.replace(')', '');
                return parseFloat(strVal);
            }
        }
        else {
            return 0;
        }
    };
    return Utility;
}());
exports.Utility = Utility;
