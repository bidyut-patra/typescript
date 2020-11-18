import df from 'dateformat';
import { Excel } from './excel';

export class ReadPaymentExcel extends Excel {
    private owners: any[];

    constructor(owners: any[]) {
        super();
        this.owners = owners;
    }

    public async initialize() {
        const dir = 'C:\WORK@SE\Personal\RSROA\FY20_FY21_Q3\\';        
        const transactionFile = dir + 'Transaction New Association_30_Sep.xlsx';
        const paymentFile = dir + 'JULY_SEP_FY20_21-Q1_Q4_Sheet_30_Sep.xlsx';        
    
        const transactions = await this.readFile(transactionFile, this.getTransactionFileConfigurations());
        const payments = await this.readFile(paymentFile, this.getPaymentFileConfigurations());
        const transactionData = this.prepareOwnerTransactionData(transactions.Main, payments);

        return transactionData;
    }

    private prepareOwnerTransactionData(transactions: any[], payments: any): any[] {
        const processedPayments: any[] = [];

        for(let prop in payments) {
            const aptNumber = parseInt(prop);
            const ownerPaymentHistory = <any[]>payments[prop];

            for (let i = 0; i < ownerPaymentHistory.length; i++) {
                const processedPayment: any = {};
                const ownerPayment = ownerPaymentHistory[i];
                const transactionMsg = ownerPayment.transactionMsg;

                if (ownerPayment.paidAmount) {
                    processedPayment['aptNumber'] = aptNumber;
                    processedPayment['owner'] = this.getAptOwner(aptNumber);
                    processedPayment['transactionType'] = 'quarter';
                    processedPayment['paymentType'] = this.getTransactionType(transactionMsg);
                    processedPayment['paymentDate'] = ownerPayment.paymentDate;
                    processedPayment['paidAmount'] = ownerPayment.paidAmount;
                    processedPayment['transactionMsg'] = transactionMsg;
                    processedPayment['comment'] = this.getComment(transactions, transactionMsg, { 
                        aptNumber: aptNumber, 
                        paymentDate: ownerPayment.paymentDate,
                        paidAmount: ownerPayment.paidAmount
                    });
                    processedPayment['createdDate'] = df(new Date(), 'd-mmm-yyyy');
                    processedPayments.push(processedPayment);
                }
            }
        }
        return processedPayments;
    }

    private getAptOwner(aptNumber: number) {
        const owner = this.owners.find(o => o.number === aptNumber);
        if (owner) {
            return owner.name;
        } else {
            return '';
        }
    }

    private getComment(transactions: any[], transactionMsg: string, filter: any) {
        const matchingTransactions = transactions.filter(t => {
            const isArray = Array.isArray(t.aptNumber);
            const aptMatch = isArray ? (t.aptNumber.indexOf(filter.aptNumber) >= 0) : (t.aptNumber === filter.aptNumber);
            const amountMatch = isArray ? true : (t.paidAmount === filter.paidAmount);            
            return aptMatch && (t.paymentDate === filter.paymentDate) && amountMatch;
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
                    type: 'number',
                    array: true,
                    separator: ','
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