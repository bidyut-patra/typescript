import df from 'dateformat';
import { Excel } from './excel';

export class ReadPaymentExcel extends Excel {

    public async initialize() {
        const dir = 'C:\\WORK@SE\\Personal\\RSROA\\2020 Q3\\';
        
        let transactionFile = '2019-20 Transaction New Association.xlsx';
        let paymentFile = 'JULY_SEP_FY20_21-Q1_Q4_Sheet.xlsx';
        
        transactionFile = dir + transactionFile;
        paymentFile = dir + paymentFile;  
    
        const transactions = await this.readFile(transactionFile, this.getTransactionFileConfigurations());
        const payments = await this.readFile(paymentFile, this.getPaymentFileConfigurations());
        const transactionData = this.prepareOwnerTransactionData(transactions['Main'], payments);

        return transactionData;
    }

    private prepareOwnerTransactionData(transactions: any[], payments: any): any[] {
        const transactionData: any[] = [];

        for(let prop in payments) {
            const aptNumber = parseInt(prop);
            const ownerPaymentHistory = <any[]>payments[prop];

            for (let i = 0; i < ownerPaymentHistory.length; i++) {
                const transaction: any = {};
                const ownerPayment = ownerPaymentHistory[i];
                const transactionMsg = ownerPayment.transactionMsg;

                if (ownerPayment.paidAmount) {
                    transaction['aptNumber'] = aptNumber;
                    transaction['owner'] = '';
                    transaction['transactionType'] = this.getTransactionType(transactionMsg);
                    transaction['paymentType'] = 'quarter';
                    transaction['paymentDate'] = ownerPayment.paymentDate;
                    transaction['paidAmount'] = ownerPayment.paidAmount;
                    transaction['transactionMsg'] = transactionMsg;
                    transaction['comment'] = this.getComment(transactions, transactionMsg, { 
                        aptNumber: aptNumber, 
                        paymentDate: ownerPayment.paymentDate,
                        paidAmount: ownerPayment.paidAmount
                    });
                    transaction['createdDate'] = df(new Date(), 'd-mmm-yyyy');
    
                    transactionData.push(transaction);
                }
            }
        }

        return transactionData;
    }

    private getComment(transactions: any[], transactionMsg: string, filter: any) {
        const matchingTransactions = transactions.filter(t => {
            return (t.aptNumber === filter.aptNumber) && 
                   (t.paymentDate === filter.paymentDate) &&                   
                   (t.paidAmount === filter.paidAmount);
        });
        if (matchingTransactions.length === 1) {
            return matchingTransactions[0].comment;
        } else {
            return transactionMsg;
        }
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

    private trimSpaces(value: any) {
        if(value) {
            value = value.replace(/\s\s+/g, ' ');
            value = value.replace(/^\s+/, '');
            value = value.replace(/\s+$/, '');        
        }
        return value;
    }
    
    private getTransactionFileConfigurations(): any[] {
        const configurations: any[] = [];
        configurations.push({
            sheetName: 'Main',
            row: 2,
            cells: [
                {
                    label: 'B',
                    column: 'paymentDate',
                    type: 'date'
                },
                {
                    label: 'C',
                    column: 'transactionMsg',
                    type: 'string'
                },
                {
                    label: 'E',
                    column: 'paidAmount',
                    type: 'number'
                },
                {
                    label: 'F',
                    column: 'aptNumber',
                    type: 'number'
                },
                {
                    label: 'I',
                    column: 'comment',
                    type: 'string'
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
                        type: 'date'
                    },
                    {
                        label: 'B',
                        column: 'paidAmount',
                        type: 'number'
                    }, 
                    {
                        label: 'C',
                        column: 'paidAmount',
                        type: 'number'
                    },      
                    {
                        label: 'D',
                        column: 'paidAmount',
                        type: 'number'
                    },                                                     
                    {
                        label: 'E',
                        column: 'paidAmount',
                        type: 'number'
                    },
                    {
                        label: 'F',
                        column: 'paidAmount',
                        type: 'number'
                    },
                    {
                        label: 'G',
                        column: 'penalty',
                        type: 'number'
                    },                    
                    {
                        label: 'H',
                        column: 'transactionMsg',
                        type: 'string'
                    },                                        
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