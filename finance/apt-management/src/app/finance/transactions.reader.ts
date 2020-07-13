import { Injectable } from '@angular/core';

@Injectable()
export class TransactionsReader {
    constructor() {}

    public readCreditData(creditSheet: any): any[] {
        let row = 2;
        const cellLetters = ['B', 'C', 'D', 'G'];
        const credits = [];

        while (creditSheet && this.hasValidDataAtLeastInOneCell(cellLetters, row, creditSheet)) {
            const date = creditSheet['B' + row] ? new Date(creditSheet['B' + row].w).toString() : undefined;
            const description = creditSheet['C' + row] ? this.trimSpaces(creditSheet['C' + row].v) : undefined;
            const comment = creditSheet['D' + row] ? this.trimSpaces(creditSheet['D' + row].v) : undefined;
            const maintenance = creditSheet['G' + row] ? this.getNumber(creditSheet['G' + row].w) : undefined;

            if (maintenance && (maintenance > 0)) {
                const paymentData: any = {};

                paymentData.aptNumber = '';
                paymentData.owner = '';
                paymentData.transactionType = this.getTransactionType(description);
                paymentData.transactionMsg = description ? description.replace(/\s+/g, ' ') : description;
                paymentData.paymentDate = date;
                paymentData.paymentType = 'maintenance';
                paymentData.paidAmount = maintenance;
                paymentData.comment = comment ? comment.replace(/\s+/g, ' ') : comment;

                credits.push(paymentData);
            }

            row++;
        }

        return credits;
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

    private getPenalty(penalties: any[]) {
        if (penalties && (penalties.length > 0)) {
            let totalPenalty = 0;
            const cutOffDate = new Date('4/15/2020');
            for (let i = 0; i < penalties.length; i++) {
                if (penalties[i].date) {
                    const date = new Date(penalties[i].date);
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
                rowCell = rowCell.replace(',', '');
                rowCell = rowCell.replace('\'', '');
                rowCell = rowCell.replace('\'', '');
                rowCell = rowCell.replace('"', '');
                rowCell = rowCell.replace('"', '');
                rowCell = rowCell.replace('(', '');
                rowCell = rowCell.replace(')', '');
                return parseInt(rowCell, 10);
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

