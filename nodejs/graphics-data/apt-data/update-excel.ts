import { Workbook, Worksheet } from 'exceljs';
import df from 'dateformat';
import { Excel } from './excel';

export class UpdateExcel extends Excel {
    public async writeTransactionDetails(transactions: any[]) {
        const result = this.prepareOwnerTransactionData(transactions);

        const dir = 'C:\\WORK@SE\\Personal\\RSROA\\2020 Q3\\';

        const sourceTransFile = dir + '2019-20 Transaction New Association_Copy.xlsx';
        const targetTransFile = dir + '2019-20 Transaction New Association_Copy_Auto_Updated.xlsx';

        await this.updateFile(sourceTransFile, targetTransFile, this.getTransactionFileConfigurations(), result.transactions);

        const sourcePaymentFile = dir + 'JULY_SEP_FY20_21-Q1_Q4_Sheet.xlsx';
        const targetPaymentFile = dir + 'JULY_SEP_FY20_21-Q1_Q4_Sheet_Auto_Updated.xlsx';

        await this.updateFile(sourcePaymentFile, targetPaymentFile, this.getPaymentFileConfigurations(), result.payments);
    }

    private prepareOwnerTransactionData(transactions: any[]): { payments: any, transactions: any } {
        const result: { payments: any, transactions: any } = {
            payments: {},
            transactions: {
                Main: []
            }
        };

        for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];
            const aptNumber = transaction.aptNumber.toString();            

            result.transactions.Main.push({
                aptNumber: parseInt(aptNumber),
                paymentDate: transaction.paymentDate,
                paidAmount: transaction.paidAmount,
                transactionMsg: transaction.transactionMsg,
                comment: transaction.comment
            });

            if (result.payments[aptNumber] === undefined) {
                result.payments[aptNumber] = [];
            }

            result.payments[aptNumber].push({
                paymentDate: transaction.paymentDate,
                paidAmount: transaction.paidAmount,
                transactionMsg: transaction.transactionMsg
            });
        }

        return result;
    }
    
    private getTransactionFileConfigurations(): any[] {
        const configurations: any[] = [];
        configurations.push({
            sheetName: 'Main',
            row: 2,
            cells: [
                {
                    label: 'A',
                    column: 'paymentDate',
                    type: 'date',
                    valueFormat: 'mm/dd/yyyy',
                    cellFormat: 'd-mmm-yy',
                    alignment: { horizontal: 'right', vertical: 'middle' }
                },                
                {
                    label: 'B',
                    column: 'paymentDate',
                    type: 'date',
                    valueFormat: 'mm/dd/yyyy',
                    cellFormat: 'd-mmm-yy',
                    alignment: { horizontal: 'right', vertical: 'middle' }
                },
                {
                    label: 'C',
                    column: 'transactionMsg',
                    type: 'string',
                    alignment: { horizontal: 'left', vertical: 'middle' }
                },
                {
                    label: 'E',
                    column: 'paidAmount',
                    type: 'number',
                    alignment: { horizontal: 'right', vertical: 'middle' }
                },
                {
                    label: 'F',
                    column: 'aptNumber',
                    type: 'number',
                    alignment: { horizontal: 'right', vertical: 'middle' }
                },
                {
                    label: 'I',
                    column: 'comment',
                    type: 'string',
                    alignment: { horizontal: 'left', vertical: 'middle' }
                }
            ]
        })
        return configurations;    
    }

    private getPaymentFileConfigurations(): any[] {
        const configurations: any[] = [];
        let j = 0;
        let k = 141;
        for(let i = 101; (i <= k) && (j < 4); i++) {
            const aptNumber = i.toString();
            configurations.push({
                sheetName: aptNumber,
                row: 16,
                cells: [
                    {
                        label: 'A',
                        column: 'paymentDate',
                        type: 'date',
                        valueFormat: 'mm/dd/yyyy',
                        cellFormat: 'd-mmm-yy',                        
                        alignment: { horizontal: 'right', vertical: 'middle' }
                    },                    
                    {
                        label: 'E',
                        column: 'paidAmount',
                        type: 'number',
                        alignment: { horizontal: 'right', vertical: 'middle' }
                    },                    
                    {
                        label: 'H',
                        column: 'transactionMsg',
                        type: 'string',
                        alignment: { horizontal: 'left', vertical: 'middle' }
                    }                                        
                ]                
            });

            if (i === k) {
                j++;
                i = j * 100 + 101;
                k = j * 100 + 141
            }
        }
        return configurations;   
    }
}