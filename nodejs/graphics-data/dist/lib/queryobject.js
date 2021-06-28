"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queryString = require("querystring");
function getQueryData(url) {
    var qStr = url.substr(url.indexOf('?') + 1);
    var queryObj = queryString.parse(qStr);
    return queryObj;
}
exports.getQueryData = getQueryData;
