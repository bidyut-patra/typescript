export function getTransaction(row: any[], transactions: any[]) {
    const transaction: any = {};
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

export function getMaintenance(row: any[], maintenances: any) {
    const aptNumber = parseInt(row[0]);
    maintenances[aptNumber] = {};
    maintenances[aptNumber].maintenance = getNumber(row[1]);
    maintenances[aptNumber].penalty = 0;
    maintenances[aptNumber].corpus = getNumber(row[2]);
    maintenances[aptNumber].water = getNumber(row[3]);
    maintenances[aptNumber].advance = getNumber(row[4]);
}

function getNumber(cellVal: any): number {
    let rowCell: string = "'" + cellVal + "'";
    rowCell = rowCell.replace(',','');
    rowCell = rowCell.replace("'", "");
    rowCell = rowCell.replace("'", "");
    rowCell = rowCell.replace('"', '');
    rowCell = rowCell.replace('"', '');
    return parseInt(rowCell);
}

function getOwner(row: any[], convertedRows: any) {
    const owner: any = {};
    owner.number = parseInt(row[0]);
    owner.name = row[1];
    owner.size = row[2];
    owner.roleId = 2;
    owner.email = '',
    owner.contact = '';
    convertedRows.push(owner);
}

export function loadData(convertRow: Function, saveConvertedRows: Function, initialValue: any, csvPath: string) {
    const Fs = require('fs');
    const CsvReadableStream = require('csv-reader');
    const AutoDetectDecoderStream = require('autodetect-decoder-stream');
     
    let inputStream = Fs.createReadStream(csvPath)
        .pipe(new AutoDetectDecoderStream({ defaultEncoding: '1255' })); // If failed to guess encoding, default to 1255
     
    // The AutoDetectDecoderStream will know if the stream is UTF8, windows-1255, windows-1252 etc.
    // It will pass a properly decoded data to the CsvReader.
    const convertedRows: any = initialValue;     
    inputStream.pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
    .on('data', function (row: any) {
        convertRow(row, convertedRows);        
    }).on('end', function (data: any) {
        saveConvertedRows(convertedRows);
    });
}