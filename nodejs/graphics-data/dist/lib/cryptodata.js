"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
function getSessionId() {
    return crypto.randomBytes(16).toString('base64');
}
exports.getSessionId = getSessionId;
function encryptUser(user) {
    var cipher = crypto.createCipher('aes-128-cbc', 'd#ffd@gh!');
    var encryptedUserToken = cipher.update(user, 'utf8', 'hex');
    encryptedUserToken += cipher.final('hex');
    return encryptedUserToken;
}
exports.encryptUser = encryptUser;
function decryptUser(userToken) {
    var cipher = crypto.createDecipher('aes-128-cbc', 'd#ffd@gh!');
    var decryptedUserToken = cipher.update(userToken, 'hex', 'utf8');
    decryptedUserToken += cipher.final('utf8');
    return decryptedUserToken;
}
exports.decryptUser = decryptUser;
