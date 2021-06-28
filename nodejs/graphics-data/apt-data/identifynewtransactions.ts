import { MongoAccess } from "../data-access/mongo-access";
import { Utility } from "../lib/utility";

export class IdentifyNewTransactions {
    private mongo: MongoAccess;
    private trimCharacters: string[] = ['\\s', '-'];

    constructor(mongo: MongoAccess) {
        this.mongo = mongo;
    }

    public process(credits: any[], debits: any[]): Promise<any[]> {
        return new Promise((resolve, reject) => {
            let creditsFilter = this.getFilter(credits);
            let debitsFilter = this.getFilter(debits);
            const projection = { transactionFilter: 1, _id: 0 };
            // console.log('Credits filter: ', creditsFilter);
            // console.log('Debits filter: ', debitsFilter);
            const creditsPromise = this.mongo.GetMatchedCredits(creditsFilter, projection);
            const debitsPromise = this.mongo.GetMatchedDebits(debitsFilter, projection);

            Promise.all([creditsPromise, debitsPromise]).then(results => {
                // console.log('Credits: ', credits);
                // console.log('Debits: ', debits);
                // console.log('Matched transactions: ', results);
                const newCredits = this.getNewTransactions(credits, results[0]);
                const newDebits = this.getNewTransactions(debits, results[1]);
               
                //console.log('New transactions: ', newTransactions);
                resolve(newCredits.concat(newDebits));
            })
            .catch(error => {
                reject(error);
            });          
        });
    }

    private getNewTransactions(transactions: any[], matchedTransactions: string[]): any[] {
        const newTransactions: any[] = [];
        transactions.forEach(transaction => {
            const transactionFilterValue = Utility.trimChars(transaction.transactionMsg, this.trimCharacters);
            if(matchedTransactions.indexOf(transactionFilterValue) < 0) {
                newTransactions.push(transaction);
            }
        });
        return newTransactions;
    }

    private getFilter(transactions: any[]): any {
        let filter: any = {
            transactionFilter: { $in : [] }
        };
        transactions.forEach(transaction => {
            const transactionFilterValue = Utility.trimChars(transaction.transactionMsg, this.trimCharacters);
            filter.transactionFilter.$in.push(transactionFilterValue);
        });

        return filter;
    }
}