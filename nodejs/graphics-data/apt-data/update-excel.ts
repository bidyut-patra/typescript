import { Excel } from './excel';

export class UpdateExcel extends Excel {
    public async writeTransactionDetails(transactions: any[]) {
        const result = this.prepareOwnerTransactionData(transactions);

        const dir = 'C:\WORK@SE\Personal\RSROA\FY20_FY21_Q4\\';

        const sourceTransFile = dir + '2019-20 Transaction New Association_2_Dec.xlsx';
        const targetTransFile = dir + '2021 Transaction New Association_14_Jan.xlsx';

        await this.updateFile(sourceTransFile, targetTransFile, this.getTransactionFileConfigurations(), result.transactions);

        const sourcePaymentFile = dir + 'OCT_DEC_FY20_21-Q1_Q4_Sheet_16_Dec.xlsx';
        const targetPaymentFile = dir + 'OCT_DEC_FY20_21-Q4_Sheet_14_Jan.xlsx';

        await this.updateFile(sourcePaymentFile, targetPaymentFile, this.getPaymentFileConfigurations(), result.payments);
    }

    /**
     * Prepares the transaction list
     * 
     * @param transactions 
     */
    private prepareOwnerTransactionData(transactions: any[]): { payments: any, transactions: any } {
        const result: { payments: any, transactions: any } = {
            payments: {},
            transactions: {
                Main: []
            }
        };

        for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];
            const aptNumberStr = transaction.aptNumber ? transaction.aptNumber.toString() : undefined;
            const aptNumber = aptNumberStr ? parseInt(aptNumberStr) : '';

            result.transactions.Main.push({
                aptNumber: aptNumber,
                paymentDate: transaction.paymentDate,
                paidAmount: transaction.paidAmount,
                transactionMsg: transaction.transactionMsg,
                comment: transaction.comment
            });

            if (aptNumberStr) {
                if (result.payments[aptNumber] === undefined) {
                    result.payments[aptNumber] = [];
                }
    
                result.payments[aptNumber].push({
                    paymentDate: transaction.paymentDate,
                    paidAmount: transaction.paidAmount,
                    transactionMsg: transaction.transactionMsg
                });

                const day = new Date(transaction.paymentDate).getDate();
                if (day > 15) {
                    result.payments[aptNumber].push({
                        paymentDate: transaction.paymentDate,
                        penalty: '(500)',
                        transactionMsg: 'Late payment charges'
                    });
                }

            } else {
                console.log('Apt Number Not Found');
            }
        }

        console.log('transactions', Object.keys(result.transactions).length);
        console.log('payments', Object.keys(result.payments).length);

        return result;
    }
    
    /**
     * Gets the configuration
     */
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
                    valueFormat: 'm/dd/yyyy',
                    cellFormat: 'd-mmm-yy',
                    alignment: { horizontal: 'right', vertical: 'middle' },
                    update: true
                },                
                {
                    label: 'B',
                    column: 'paymentDate',
                    type: 'date',
                    valueFormat: 'm/dd/yyyy',
                    cellFormat: 'd-mmm-yy',
                    alignment: { horizontal: 'right', vertical: 'middle' },
                    update: true
                },
                {
                    label: 'C',
                    column: 'transactionMsg',
                    type: 'string',
                    alignment: { horizontal: 'left', vertical: 'middle' },
                    update: true
                },
                {
                    label: 'D',
                    column: 'debitAmount',
                    type: 'number',
                    alignment: { horizontal: 'right', vertical: 'middle' },
                    update: true
                },                
                {
                    label: 'E',
                    column: 'paidAmount',
                    type: 'number',
                    alignment: { horizontal: 'right', vertical: 'middle' },
                    update: true
                },
                {
                    label: 'F',
                    column: 'aptNumber',
                    type: 'number',
                    alignment: { horizontal: 'right', vertical: 'middle' },
                    update: true
                },
                {
                    label: 'G',
                    column: 'owner',
                    type: 'string',
                    alignment: { horizontal: 'left', vertical: 'middle' },
                    update: true
                },                
                {
                    label: 'I',
                    column: 'comment',
                    type: 'string',
                    alignment: { horizontal: 'left', vertical: 'middle' },
                    update: true
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
                        alignment: { horizontal: 'right', vertical: 'middle' },
                        update: true
                    },       
                    {
                        label: 'B',
                        column: 'paidAmount',
                        type: 'number',
                        update: false
                    }, 
                    {
                        label: 'C',
                        column: 'paidAmount',
                        type: 'number',
                        update: false
                    },      
                    {
                        label: 'D',
                        column: 'paidAmount',
                        type: 'number',
                        update: false
                    },                                 
                    {
                        label: 'E',
                        column: 'paidAmount',
                        type: 'number',
                        alignment: { horizontal: 'right', vertical: 'middle' },
                        update: true
                    },
                    {
                        label: 'F',
                        column: 'paidAmount',
                        type: 'number',
                        update: false
                    },
                    {
                        label: 'G',
                        column: 'penalty',
                        type: 'string',
                        update: true
                    },                                        
                    {
                        label: 'H',
                        column: 'transactionMsg',
                        type: 'string',
                        alignment: { horizontal: 'left', vertical: 'middle' },
                        update: true
                    }                                        
                ]                
            });

            if (i === k) {
                j++;
                i = j * 100 + 100;
                k = j * 100 + 141
            }
        }
        return configurations;   
    }
}