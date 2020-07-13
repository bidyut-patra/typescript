"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getTransaction(row, transactions) {
    var transaction = {};
    transaction['aptNumber'] = parseInt(row[0]);
    transaction['owner'] = '';
    transaction['transactionType'] = 'online';
    transaction['transactionMsg'] = row[3];
    transaction['paymentType'] = 'quarter';
    transaction['paymentDate'] = new Date(row[2]).toString();
    transaction['paidAmount'] = getNumber(row[1]);
    transaction['comment'] = row[4];
    transaction['createdDate'] = new Date().toString();
    transactions.push(transaction);
}
exports.getTransaction = getTransaction;
function getMaintenance(row, maintenances) {
    var aptNumber = parseInt(row[0]);
    maintenances[aptNumber] = {};
    maintenances[aptNumber].maintenance = getNumber(row[1]);
    maintenances[aptNumber].penalty = 0;
    maintenances[aptNumber].corpus = getNumber(row[2]);
    maintenances[aptNumber].water = getNumber(row[3]);
    maintenances[aptNumber].advance = getNumber(row[4]);
}
exports.getMaintenance = getMaintenance;
function getNumber(cellVal) {
    var rowCell = "'" + cellVal + "'";
    rowCell = rowCell.replace(',', '');
    rowCell = rowCell.replace("'", "");
    rowCell = rowCell.replace("'", "");
    rowCell = rowCell.replace('"', '');
    rowCell = rowCell.replace('"', '');
    return parseInt(rowCell);
}
function getOwner(row, convertedRows) {
    var owner = {};
    owner.number = parseInt(row[0]);
    owner.name = row[1];
    owner.size = row[2];
    owner.roleId = 2;
    owner.email = '',
        owner.contact = '';
    convertedRows.push(owner);
}
function loadData(convertRow, saveConvertedRows, initialValue, csvPath) {
    var Fs = require('fs');
    var CsvReadableStream = require('csv-reader');
    var AutoDetectDecoderStream = require('autodetect-decoder-stream');
    var inputStream = Fs.createReadStream(csvPath)
        .pipe(new AutoDetectDecoderStream({ defaultEncoding: '1255' })); // If failed to guess encoding, default to 1255
    // The AutoDetectDecoderStream will know if the stream is UTF8, windows-1255, windows-1252 etc.
    // It will pass a properly decoded data to the CsvReader.
    var convertedRows = initialValue;
    inputStream.pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
        .on('data', function (row) {
        convertRow(row, convertedRows);
    }).on('end', function (data) {
        saveConvertedRows(convertedRows);
    });
}
exports.loadData = loadData;
