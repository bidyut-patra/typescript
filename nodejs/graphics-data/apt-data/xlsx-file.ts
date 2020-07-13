import * as XLSX from 'xlsx';

export function readMainExcelFile(excelFile: string, initializeData: any) {
    const workbook = XLSX.readFile(excelFile);
    const sheetNames = workbook.SheetNames;

    const paymentBalances = readResidentsMaintenancePayment(sheetNames, workbook);
    const consolidatedPayments = readResidentsConsolidatedPayment(workbook.Sheets[sheetNames[0]], paymentBalances.penalties);
    const corpusPayments = readResidentsCorpusWaterPayment(workbook.Sheets[sheetNames[2]]);
    const commercialPayments = readResidentsCommercialPayment(workbook.Sheets[sheetNames[3]]);

    initializeData.payments(consolidatedPayments);
    initializeData.transactions([...paymentBalances.payments, ...corpusPayments, ...commercialPayments]);
}

export function readBankExcelFile(excelFile: string, saveTransactions: Function) {
    const workbook = XLSX.readFile(excelFile);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const credits = readCreditData(sheet);

    if((saveTransactions !== undefined) && (credits.length > 0)) {
        saveTransactions(credits);
    }
}

function readCreditData(creditSheet: any) {
    let row = 2;
    const cellLetters = ['B', 'C', 'D', 'G'];
    const credits = [];

    while(creditSheet && hasValidDataAtLeastInOneCell(cellLetters, row, creditSheet)) {
        const date = creditSheet['B' + row] ? new Date(creditSheet['B' + row].w).toString() : undefined;
        const description = creditSheet['C' + row] ? trimSpaces(creditSheet['C' + row].v) : undefined;
        const comment = creditSheet['D' + row] ? trimSpaces(creditSheet['D' + row].v) : undefined;
        const maintenance = creditSheet['G' + row] ? getNumber(creditSheet['G' + row].w) : undefined;

        if(maintenance && (maintenance > 0)) {
            const paymentData: any = {};

            paymentData.aptNumber = '';
            paymentData.owner = '';
            paymentData.transactionType = getTransactionType(description);
            paymentData.transactionMsg = description;                
            paymentData.paymentDate = date;
            paymentData.paymentType = 'maintenance';
            paymentData.paidAmount = maintenance;
            paymentData.comment = comment;        
    
            credits.push(paymentData);
        }
        
        row++;
    }

    return credits;
}

function readResidentsConsolidatedPayment(consolidatedSheet: any, penalties: any): any {
    const consolidatedPayments: any = {};

    let row = 5;
    const cellLetters = ['A', 'C', 'D', 'E', 'F'];
    while(consolidatedSheet && hasValidDataAtLeastInOneCell(cellLetters, row, consolidatedSheet)) {
        const aptNumber = getNumber(consolidatedSheet['A' + row].w);
        consolidatedPayments[aptNumber] = {};
        const totalPenalty = getPenalty(penalties[aptNumber]);
        let mCellValue = getNumber(consolidatedSheet['C' + row].w)
        let maintenance =  mCellValue >= totalPenalty ? mCellValue - totalPenalty : mCellValue;
        const totalDue = getNumber(consolidatedSheet['F' + row].w);
        maintenance = totalDue < 0 ? maintenance + totalDue : maintenance;
        consolidatedPayments[aptNumber].maintenance = maintenance;
        consolidatedPayments[aptNumber].penalty = totalPenalty <= mCellValue ? totalPenalty : 0;
        consolidatedPayments[aptNumber].corpus = getNumber(consolidatedSheet['D' + row].w);
        consolidatedPayments[aptNumber].water = getNumber(consolidatedSheet['E' + row].w);
        consolidatedPayments[aptNumber].advance = totalDue < 0 ? Math.abs(totalDue) : 0;
        
        row++;

        if (row > 168) break;
    }

    return consolidatedPayments;
}

function readResidentsMaintenancePayment(sheetNames: any[], workbook: any): any {
    const paymentBalances: any = {
        payments: [],
        penalties: {}
    };

    for(let i = 4; i < sheetNames.length; i++) {
        const sheetName = getNumber(sheetNames[i]);
        const sheet = workbook.Sheets[sheetName];
        
        paymentBalances.penalties[sheetName] = [];

        let row = 16;
        let cellLetters = ['A','B','C','E','F','G','H'];
        while(sheet && hasValidDataAtLeastInOneCell(cellLetters, row, sheet)) {
            const date = sheet['A' + row] ? new Date(sheet['A' + row].w).toString() : undefined;
            let maintenance = sheet['B' + row] ? sheet['B' + row].w : (sheet['E' + row] ? sheet['E' + row].w : undefined);
            maintenance = maintenance ? getNumber(maintenance) : maintenance;
            let asd = sheet['C' + row] ? sheet['C' + row].w : (sheet['F' + row] ? sheet['F' + row].w : undefined);
            asd = asd ? getNumber(asd) : asd;
            if (maintenance && asd) {
                maintenance = maintenance + asd;
            } else if (asd) {
                maintenance = asd;
            }
            let penalty = sheet['G' + row] ? sheet['G' + row].w : undefined;
            penalty = penalty ? getNumber(penalty) : penalty;
            const remark = sheet['H' + row] ? trimSpaces(sheet['H' + row].w) : undefined;

            if (maintenance) {
                const paymentData: any = {};
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
                const penaltyData: any = {};
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

function readResidentsCorpusWaterPayment(corpusWaterSheet: any): any[] {
    let row = 2;
    let cellLetters = ['A','C','D','E','F'];
    const corpusPayments: any = [];
    while(corpusWaterSheet && hasValidDataAtLeastInOneCell(cellLetters, row, corpusWaterSheet)) {        
        const corpusPayment: any = {};
        const aptNumber = getNumber(corpusWaterSheet['A' + row].w);
        corpusPayment.aptNumber = aptNumber;
        corpusPayment.owner = '';
        let corpus = corpusWaterSheet['C' + row] ? corpusWaterSheet['C' + row].w : undefined;
        corpus = corpus ? getNumber(corpus) : corpus;
        let corpusRemark = corpusWaterSheet['D' + row] ? corpusWaterSheet['D' + row].w : undefined;
        corpusRemark = corpusRemark ? trimSpaces(corpusRemark) : corpusRemark;
        let water = corpusWaterSheet['E' + row] ? corpusWaterSheet['E' + row].w : undefined;
        water = water ? getNumber(water) : water;
        if (corpus && water) {
            corpusPayment.paidAmount = corpus + water;
        } else if (corpus) {
            corpusPayment.paidAmount = corpus;
        } else if (water) {
            corpusPayment.paidAmount = water;
        } else {
            corpusPayment.paidAmount = undefined;
        }
        let waterRemark = corpusWaterSheet['F' + row] ? corpusWaterSheet['F' + row].w : undefined;
        waterRemark = waterRemark ? trimSpaces(waterRemark) : waterRemark;

        if (corpusRemark === waterRemark) {
            if (corpus && water) {
                corpusPayment.transactionType = getTransactionType(corpusRemark);
                corpusPayment.transactionMsg = corpusRemark;
                corpusPayment.paymentType = 'corpus',
                corpusPayment.comment = 'corpus + water';
            }
        } else {
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

function readResidentsCommercialPayment(commercialSheet: any): any[] {
    const commercialPayments: any[] = [];
    let row = 15;
    let cellLetters = ['A','E','H'];
    while(commercialSheet && hasValidDataAtLeastInOneCell(cellLetters, row, commercialSheet)) {
        const commercialPayment: any = {};

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

function getTransactionType(remark: string) {
    if (remark) {
        const remarkInLowerCase = remark.toLowerCase();
        const isCashTransaction = remarkInLowerCase.indexOf('cash') >= 0;
        const isChequeTransaction = remarkInLowerCase.indexOf('cheque') >= 0;
        return isCashTransaction ? 'cash' : (isChequeTransaction ? 'cheque' : 'online');
    } else {
        return 'online';
    }
}

function getPenalty(penalties: any[]) {
    if (penalties && (penalties.length > 0)) {
        let totalPenalty = 0;
        let cutOffDate = new Date('4/15/2020');
        for (let i = 0; i < penalties.length; i++) {
            if (penalties[i].date) {
                var date = new Date(penalties[i].date);
                if (date.getTime() >= cutOffDate.getTime()) {
                    totalPenalty += penalties[i].penalty;
                }
            }
        }
        return totalPenalty;
    } else {
        return 0;
    }
}

function hasValidDataAtLeastInOneCell(cells: string[], row: number, sheet: any) {
    let _hasValidDataAtLeastInOneCell = false;
    for(let i = 0; (i < cells.length) && !_hasValidDataAtLeastInOneCell; i++) {
        if (sheet[cells[i] + row]) {
            _hasValidDataAtLeastInOneCell = true;
        }
    }
    return _hasValidDataAtLeastInOneCell;
}

function getNumber(cellVal: any): number {
    if (cellVal) {
        cellVal = trimSpaces(cellVal);
        if (cellVal === '-') {
            return 0;
        } else if (cellVal === '') {
            return 0;
        } else {        
            let rowCell: string = "'" + cellVal + "'";
            rowCell = rowCell.replace(',','');
            rowCell = rowCell.replace("'", "");
            rowCell = rowCell.replace("'", "");
            rowCell = rowCell.replace('"', '');
            rowCell = rowCell.replace('"', '');
            rowCell = rowCell.replace('(', '');
            rowCell = rowCell.replace(')', '');
            return parseInt(rowCell);
        }
    } else {
        return 0;
    }
}

function trimSpaces(value: any) {
    if(value) {
        value = value.replace(/\s\s+/g, ' ');
        value = value.replace(/^\s+/, '');
        value = value.replace(/\s+$/, '');        
    }
    return value;
}
