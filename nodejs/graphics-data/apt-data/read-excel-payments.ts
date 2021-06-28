import df from 'dateformat';
import { AppSettings } from '../appsettings-reader';
import { Utility } from '../lib/utility';
import { Excel } from './excel';

export class ReadPaymentExcel extends Excel {
    private owners: any[];
    private transactions: any[];

    constructor(owners: any[]) {
        super();
        this.owners = owners;
        this.transactions = [];
    }

    public async initialize() {  
        const mainTransactions = await this.readFile(AppSettings.InputTransactionFile, this.getMainSheetConfiguration());
        this.transactions = mainTransactions.Main;
        const payments = await this.readFile(AppSettings.InputPaymentFile, this.getFlatSheetConfiguration());
        const corpus = await this.readFile(AppSettings.InputPaymentFile, this.getCorpusSheetConfiguration());
        const water = await this.readFile(AppSettings.InputPaymentFile, this.getWaterSheetConfiguration());
        const commercial = await this.readFile(AppSettings.InputPaymentFile, this.getCommercialSheetConfiguration());
        
        let credits: any[] = [];
        credits = credits.concat(this.prepareResidentTransactions(payments));
        credits = credits.concat(this.prepareCorpusTransactions(corpus.Corpus_Water));
        credits = credits.concat(this.prepareWaterTransactions(water.Corpus_Water));
        credits = credits.concat(this.prepareCommercialTransactions(commercial.Commercial));
        const otherTransactions = this.prepareOthersTransactions(this.transactions);
        credits = credits.concat(otherTransactions.credits);

        return {
            credits: credits,
            debits: otherTransactions.debits
        };
    }

    private prepareResidentTransactions(payments: any): any[] {
        const processedPayments: any[] = [];
        const trimCharacters: string[] = ['\\s', '-'];

        for(let prop in payments) {
            const aptNumber = parseInt(prop);
            const ownerPaymentHistory = <any[]>payments[prop];

            for (let i = 0; i < ownerPaymentHistory.length; i++) {
                const processedPayment: any = {};
                const ownerPayment = ownerPaymentHistory[i];
                const transactionMsg = ownerPayment.transactionMsg;

                if (ownerPayment.paidAmount) {
                    const transaction = this.getTransaction(transactionMsg, ownerPayment.paidAmount, aptNumber, ownerPayment.paymentDate);
                    transaction.accounted = true;
                    processedPayment['aptNumber'] = aptNumber;
                    processedPayment['owner'] = this.getAptOwner(aptNumber);
                    processedPayment['transactionType'] = this.getTransactionType(transactionMsg);
                    processedPayment['paymentType'] = 'maintenance';
                    processedPayment['paymentDate'] = ownerPayment.paymentDate;
                    processedPayment['paidAmount'] = ownerPayment.paidAmount;
                    processedPayment['transactionMsg'] = transactionMsg;
                    processedPayment['transactionFilter'] = Utility.trimChars(transactionMsg, trimCharacters);
                    processedPayment['comment'] = transaction.comment;
                    processedPayment['commentFilter'] = Utility.trimChars(transaction.comment, trimCharacters);
                    processedPayment['createdDate'] = df(new Date(), 'd-mmm-yyyy');
                    processedPayments.push(processedPayment);
                }
            }
        }
        return processedPayments;
    }

    private prepareOthersTransactions(others: any[]): any {
        const otherTransactions: any = {
            credits: [],
            debits: []
        };
        const trimCharacters: string[] = ['\\s', '-'];

        for (let i = 0; i < this.transactions.length; i++) {
            const transaction = this.transactions[i];
            if (!transaction.accounted) {
                const otherTransaction: any = {};                
                transaction.accounted = true;
                otherTransaction['transactionType'] = this.getTransactionType(transaction.transactionMsg);
                otherTransaction['paymentDate'] = transaction.paymentDate;
                otherTransaction['transactionMsg'] = transaction.transactionMsg;
                otherTransaction['transactionFilter'] = Utility.trimChars(transaction.transactionMsg, trimCharacters);
                otherTransaction['comment'] = transaction.comment;
                otherTransaction['commentFilter'] = Utility.trimChars(transaction.comment, trimCharacters);
                otherTransaction['createdDate'] = df(new Date(), 'd-mmm-yyyy');
                if (transaction.creditAmount) {
                    otherTransaction['paymentType'] = transaction.paidBy;
                    otherTransaction['paidAmount'] = transaction.creditAmount;
                    otherTransactions.credits.push(otherTransaction);
                } else {
                    otherTransaction['paymentType'] = 'expense';
                    otherTransaction['paidAmount'] = transaction.debitAmount;
                    otherTransactions.debits.push(otherTransaction);
                }
            }
        }
        return otherTransactions;
    }

    private prepareCorpusTransactions(corpus: any[]): any[] {
        let corpusTransactions: any[] = [];
        const trimCharacters: string[] = ['\\s', '-'];

        for(let i = 0; i < corpus.length; i++) {
            const transactionMsg = corpus[i].transactionMsg ? corpus[i].transactionMsg : corpus[i].transactionMsg2;
            if (transactionMsg && corpus[i].paidAmount && (corpus[i].paidAmount > 0)) {
                const corpusTransaction: any = {};
                const transaction = this.getTransaction(transactionMsg, corpus[i].paidAmount);
                transaction.accounted = true;
                corpusTransaction['aptNumber'] = corpus[i].aptNumber;
                corpusTransaction['owner'] = this.getAptOwner(corpus[i].aptNumber);
                corpusTransaction['transactionType'] = this.getTransactionType(corpus[i].transactionMsg);
                corpusTransaction['paymentType'] = 'corpus';
                corpusTransaction['paymentDate'] = transaction.paymentDate;
                corpusTransaction['paidAmount'] = corpus[i].paidAmount;
                corpusTransaction['transactionMsg'] = transactionMsg;
                corpusTransaction['transactionFilter'] = Utility.trimChars(transactionMsg, trimCharacters);
                corpusTransaction['comment'] = transaction.comment;
                corpusTransaction['commentFilter'] = Utility.trimChars(transaction.comment, trimCharacters);
                corpusTransaction['createdDate'] = df(new Date(), 'd-mmm-yyyy');
                corpusTransactions.push(corpusTransaction);
            }
        }

        return corpusTransactions;
    }

    private prepareWaterTransactions(water: any[]): any[] {
        let waterTransactions: any[] = [];
        const trimCharacters: string[] = ['\\s', '-'];

        for(let i = 0; i < water.length; i++) {
            const transactionMsg = water[i].transactionMsg ? water[i].transactionMsg : water[i].transactionMsg1;
            if (transactionMsg && water[i].paidAmount && (water[i].paidAmount > 0)) {
                const waterTransaction: any = {};
                const transaction = this.getTransaction(transactionMsg, water[i].paidAmount);
                transaction.accounted = true;
                waterTransaction['aptNumber'] = water[i].aptNumber;
                waterTransaction['owner'] = this.getAptOwner(water[i].aptNumber);
                waterTransaction['transactionType'] = this.getTransactionType(transactionMsg);
                waterTransaction['paymentType'] = 'water';
                waterTransaction['paymentDate'] = transaction.paymentDate;
                waterTransaction['paidAmount'] = water[i].paidAmount;
                waterTransaction['transactionMsg'] = transactionMsg;
                waterTransaction['transactionFilter'] = Utility.trimChars(transactionMsg, trimCharacters);
                waterTransaction['comment'] = transaction.comment;
                waterTransaction['commentFilter'] = Utility.trimChars(transaction.comment, trimCharacters);
                waterTransaction['createdDate'] = df(new Date(), 'd-mmm-yyyy');
                waterTransactions.push(waterTransaction);
            }
        }
        
        return waterTransactions;
    }

    private prepareCommercialTransactions(commercial: any[]): any[] {
        let commercialTransactions: any[] = [];
        const trimCharacters: string[] = ['\\s', '-'];

        for(let i = 0; i < commercial.length; i++) {
            if (commercial[i].transactionMsg && commercial[i].paidAmount && (commercial[i].paidAmount > 0)) {
                const commercialTransaction: any = {};
                const transaction = this.getTransaction(commercial[i].transactionMsg, commercial[i].paidAmount);
                transaction.accounted = true;
                commercialTransaction['aptNumber'] = undefined;
                commercialTransaction['owner'] = undefined;
                commercialTransaction['transactionType'] = this.getTransactionType(commercial[i].transactionMsg);
                commercialTransaction['paymentType'] = 'commercial';
                commercialTransaction['paymentDate'] = transaction.paymentDate;
                commercialTransaction['paidAmount'] = commercial[i].paidAmount;
                commercialTransaction['transactionMsg'] = commercial[i].transactionMsg;
                commercialTransaction['transactionFilter'] = Utility.trimChars(commercial[i].transactionMsg, trimCharacters);
                commercialTransaction['comment'] = transaction.comment;
                commercialTransaction['commentFilter'] = Utility.trimChars(transaction.comment, trimCharacters);
                commercialTransaction['createdDate'] = df(new Date(), 'd-mmm-yyyy');
                commercialTransactions.push(commercialTransaction);
            }
        }

        return commercialTransactions;
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

    private getTransaction(transactionMsg: string, paidAmount: number, aptNumber?: number, paymentDate?: any): any {
        const trimCharacters: string[] = ['\\s', '-'];
        const transactionFilterValue = Utility.trimChars(transactionMsg, trimCharacters);
        const matchingTransactions = this.transactions.filter(t => {
            const thisTransactionFilterValue = Utility.trimChars(t.transactionMsg, trimCharacters);
            const transactionFilterMatch = (transactionFilterValue === thisTransactionFilterValue);
            const paidAmountMatch = (t.paidAmount === paidAmount);

            if (aptNumber && paymentDate) {
                const isArray = Array.isArray(t.aptNumber);
                const aptMatch = isArray ? (t.aptNumber.indexOf(aptNumber) >= 0) : (t.aptNumber === aptNumber);
                const paymentDateMatch = (t.paymentDate === paymentDate);
                return transactionFilterMatch && paidAmountMatch && aptMatch && paymentDateMatch;
            } else {
                return transactionFilterMatch && paidAmountMatch;
            }
        });
        if (matchingTransactions.length === 1) {
            return matchingTransactions[0];
        } else {
            return {
                comment: transactionMsg
            };
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
    
    private getMainSheetConfiguration(): any[] {
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
                    label: 'D',
                    column: 'debitAmount',
                    type: 'number'
                },                
                {
                    label: 'E',
                    column: 'creditAmount',
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
                    label: 'F',
                    column: 'paidBy',
                    type: 'string'
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

    private getFlatSheetConfiguration(): any[] {
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
                i = j * 100 + 100;
                k = j * 100 + 141;
            }
        }

        return configurations;   
    }

    private getCorpusSheetConfiguration(): any[] {
        const config: any = {
            sheetName: 'Corpus_Water',
            row: 2,
            cells: [
                {
                    label: 'A',
                    column: 'aptNumber',
                    type: 'number'
                },
                {
                    label: 'C',
                    column: 'paidAmount',
                    type: 'number'
                }, 
                {
                    label: 'D',
                    column: 'transactionMsg',
                    type: 'string'
                },
                {
                    label: 'F',
                    column: 'transactionMsg2',
                    type: 'string'
                }                                                   
            ]                
        };
        return [config];
    }

    private getWaterSheetConfiguration(): any[] {
        const config: any = {
            sheetName: 'Corpus_Water',
            row: 2,
            cells: [
                {
                    label: 'A',
                    column: 'aptNumber',
                    type: 'number'
                },      
                {
                    label: 'D',
                    column: 'transactionMsg1',
                    type: 'string'
                },                
                {
                    label: 'E',
                    column: 'paidAmount',
                    type: 'number'
                },                                                             
                {
                    label: 'F',
                    column: 'transactionMsg',
                    type: 'string'
                }                                    
            ]                
        };
        return [config];
    }

    private getCommercialSheetConfiguration(): any[] {
        const config: any = {
            sheetName: 'Commercial',
            row: 15,
            cells: [
                {
                    label: 'A',
                    column: 'paymentDate',
                    type: 'date'
                },
                {
                    label: 'E',
                    column: 'paidAmount',
                    type: 'number'
                },                                 
                {
                    label: 'H',
                    column: 'transactionMsg',
                    type: 'string'
                },                                        
            ]                
        };
        return [config];
    }
}