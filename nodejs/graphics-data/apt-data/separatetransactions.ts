import { Utility } from "../lib/utility";
import df from 'dateformat';

export class SeparateTransactions {
    public static process(transactions: any[]): any {
        const processedTransactions: any = {
            credits: [],
            debits: []
        };
        const trimCharacters: string[] = ['\\s', '-'];

        for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];

            if (transaction.remittanceType === 'credit') {
                processedTransactions.credits.push({
                    aptNumber: transaction.aptNumber,
                    owner: transaction.owner,
                    transactionType: transaction.transactionType,
                    paymentType: transaction.paymentType,
                    paidAmount: transaction.paidAmount,
                    paymentDate: transaction.paymentDate,
                    transactionMsg: transaction.transactionMsg,
                    transactionFilter: Utility.trimChars(transaction.transactionMsg, trimCharacters),
                    comment: transaction.comment,
                    commentFilter: Utility.trimChars(transaction.comment, trimCharacters),
                    createdDate: df(new Date(), 'dd-MMM-yyyy')
                });
            }

            if (transactions[i].remittanceType === 'debit') {
                processedTransactions.debits.push({
                    transactionType: transaction.transactionType,
                    paymentType: transaction.paymentType,
                    paidAmount: transaction.paidAmount,
                    paymentDate: transaction.paymentDate,
                    transactionMsg: transaction.transactionMsg,
                    transactionFilter: Utility.trimChars(transaction.transactionMsg, trimCharacters),
                    comment: transaction.comment,
                    commentFilter: Utility.trimChars(transaction.comment, trimCharacters),
                    createdDate: df(new Date(), 'dd-MMM-yyyy')
                });
            }            
        }

        return processedTransactions;
    }
}