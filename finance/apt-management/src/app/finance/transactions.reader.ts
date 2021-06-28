import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable()
export class TransactionsReader {
    constructor() {}

    public read(transactionSheet: XLSX.WorkSheet): any[] {
        const transactions = [];
        const cellLetters = ['B', 'C', 'D', 'H'];
        let row = this.getFirstTransactionRowNumber(transactionSheet);
        console.log('First transaction row: ', row);

        while (transactionSheet && this.hasValidDataAtLeastInOneCell(cellLetters, row, transactionSheet)) {
            const date = this.getCellValue(transactionSheet, 'B', row, 'date');
            const description = this.getCellValue(transactionSheet, 'C', row, 'string');
            const comment = this.getCellValue(transactionSheet, 'D', row, 'string');
            const debit = this.getCellValue(transactionSheet, 'F', row, 'number');
            const credit = this.getCellValue(transactionSheet, 'G', row, 'number');
            const balance = this.getCellValue(transactionSheet, 'H', row, 'number');

            if (credit && (credit > 0)) {
                transactions.push(this.createTransactionObject({
                    description: description,
                    paymentDate: date,
                    comment: comment,
                    paidAmount: credit,
                    balance: balance,
                    remittanceType: 'credit'
                }));
            }

            if (debit && (debit > 0)) {
                transactions.push(this.createTransactionObject({
                    description: description,
                    paymentDate: date,
                    comment: comment,
                    paidAmount: debit,
                    balance: balance,
                    remittanceType: 'debit'
                }));
            }

            row++;
        }

        return transactions;
    }

    private createTransactionObject(cellData: any): any {
        const transaction: any = {};

        transaction.aptNumber = '';
        transaction.owner = '';
        transaction.transactionType = this.getTransactionType(cellData.description);
        transaction.transactionMsg = cellData.description;
        transaction.paymentDate = cellData.paymentDate;
        transaction.paymentType = undefined;
        transaction.paidAmount = cellData.paidAmount;
        transaction.balance = cellData.balance;
        transaction.comment = cellData.comment ? cellData.comment.replace(/\s+/g, ' ') : cellData.comment;
        transaction.remittanceType = cellData.remittanceType;

        return transaction;
    }

    private getCellValue(transactionSheet: XLSX.WorkSheet, cellIndex: string, row: number, cellType: string): any {
        let cellValue: any;

        switch (cellType) {
            case 'string':
                cellValue = transactionSheet[cellIndex + row] ? this.trimSpaces(transactionSheet[cellIndex + row].v) : undefined;
                break;
            case 'date':
                cellValue = transactionSheet[cellIndex + row] ? new Date(transactionSheet[cellIndex + row].w) : undefined;
                break;
            case 'number':
                cellValue = transactionSheet[cellIndex + row] ? this.getNumber(transactionSheet[cellIndex + row].w) : undefined;
                break;
            default:
                cellValue = transactionSheet[cellIndex + row] ? this.trimSpaces(transactionSheet[cellIndex + row].v) : undefined;
                break;
        }
        return cellValue;
    }

    private getFirstTransactionRowNumber(creditSheet: any): number {
        let row = 0;
        const columns: any = {
            B: 'Value Date',
            C: 'Description',
            D: 'Ref No./Cheque No.',
            F: 'Debit',
            G: 'Credit'
        };

        do {
            row++;
        }
        while (this.columnsFound(creditSheet, columns, row));

        return ++row;
    }

    private columnsFound(sheet: any, columns: any, row: number): boolean {
        let reqColumnsFound: boolean;
        // tslint:disable-next-line:forin
        for (const columnKey in columns) {
            const columnName = columns[columnKey];
            if (reqColumnsFound === undefined) {
                reqColumnsFound = (sheet[columnKey + row] === columnName);
            } else {
                reqColumnsFound = reqColumnsFound && (sheet[columnKey + row] === columnName);
            }
        }
        return reqColumnsFound;
    }

    private getTransactionType(remark: string) {
        if (remark) {
            const remarkInLowerCase = remark.toLowerCase();
            const isCashTransaction = remarkInLowerCase.indexOf('cash') >= 0;
            const isChequeTransaction = remarkInLowerCase.indexOf('cheque') >= 0;
            return isCashTransaction ? 'cash' : (isChequeTransaction ? 'cheque' : 'online');
        } else {
            return 'online';
        }
    }

    private hasValidDataAtLeastInOneCell(cells: string[], row: number, sheet: any) {
        let _hasValidDataAtLeastInOneCell = false;
        for (let i = 0; (i < cells.length) && !_hasValidDataAtLeastInOneCell; i++) {
            if (sheet[cells[i] + row]) {
                _hasValidDataAtLeastInOneCell = true;
            }
        }
        return _hasValidDataAtLeastInOneCell;
    }

    private getNumber(cellVal: any): number {
        if (cellVal) {
            cellVal = this.trimSpaces(cellVal);
            if (cellVal === '-') {
                return 0;
            } else if (cellVal === '') {
                return 0;
            } else {
                let rowCell: string = '\'' + cellVal + '\'';
                rowCell = rowCell.replace(/,/g, '');
                rowCell = rowCell.replace('\'', '');
                rowCell = rowCell.replace('\'', '');
                rowCell = rowCell.replace('"', '');
                rowCell = rowCell.replace('"', '');
                rowCell = rowCell.replace('(', '');
                rowCell = rowCell.replace(')', '');
                return parseFloat(rowCell);
            }
        } else {
            return 0;
        }
    }

    private trimSpaces(value: string): string {
        if (value) {
            value = value.replace(/\s\s+/g, ' ');
            value = value.replace(/^\s+/, '');
            value = value.replace(/\s+$/, '');
        }
        return value;
    }
}

