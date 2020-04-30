"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongo;
function setMongoAccess(mongoObj) {
    mongo = mongoObj;
}
exports.setMongoAccess = setMongoAccess;
function saveTransactions(transactions) {
    mongo.SaveAllTransactions(transactions)
        .then(function (r) {
        console.log('Saved transactions');
    });
}
exports.saveTransactions = saveTransactions;
function saveMaintenances(maintenances) {
    mongo.GenerateBalanceForAllResidents(maintenances)
        .then(function (r) {
        console.log('Saved maintenances');
    });
}
exports.saveMaintenances = saveMaintenances;
function generateData() {
    mongo.GenerateBalanceForAllResidents({});
}
exports.generateData = generateData;
function saveOwners(owners) {
    mongo.SaveOwners(owners)
        .then(function (r) {
        console.log('Saved owners');
    });
}
exports.saveOwners = saveOwners;
