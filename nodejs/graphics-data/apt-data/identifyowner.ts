import { MongoAccess } from "../data-access/mongo-access";

export class IdentifyOwner {
    private mongo: MongoAccess;

    constructor(mongo: MongoAccess) {
        this.mongo = mongo;
    }

    public identifyTransactions(transactions: any[]): Promise<any[]> {
        return new Promise((resolve, reject) => {  
            // Identify the owner from the transaction message and comment and old payment history
            const transactionCount = transactions.length;
            for (let i = 0; i < transactionCount; i++) {
                const mFilter = this.getFilterToIdentifyTransactionOwner(transactions[i]);
                this.getTransactionOwner(i, mFilter).then(result => {
                    if(result.transactionOwner) {
                        const aptNumberFromDb = result.transactionOwner.number;
                        const aptNumber = result.conflict && (result.conflict.length > 0) ? result.conflict[0] : aptNumberFromDb;
                        transactions[result.transactionIndex].aptNumber = aptNumber;
                        transactions[result.transactionIndex].owner = result.transactionOwner.name;
                        transactions[result.transactionIndex]['transactionMsgFilter'] = result.transactionMsgFilter;
                        transactions[result.transactionIndex]['commentFilter'] = result.commentFilter;
                        transactions[result.transactionIndex]['conflict'] = result.conflict;
                        // Save the transactions to database when the owner is identified for the last transaction
                        if(result.transactionIndex === (transactionCount - 1)) {
                            resolve(transactions);
                        }
                    }
                });
            }
        });    
    }

    private getTransactionOwner(index: number, mFilter: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.mongo.GetTransactionOwner(mFilter.dbFilter).then(owner => {
                let conflictingApts: any[] = [];
                if (mFilter.aptNumber && owner && owner.number) {
                    const aptNumberMatch = parseInt(mFilter.aptNumber) !== parseInt(owner.number);
                    owner.number = aptNumberMatch ? mFilter.aptNumber : owner.number;
                }

                if (owner === undefined) {
                    console.log('transactionMsgFilter: ', mFilter.transactionMsgFilter);
                    console.log('commentFilter: ', mFilter.commentFilter);
                } 

                resolve({
                    transactionIndex: index,
                    transactionOwner: owner,
                    transactionMsgFilter: mFilter.transactionMsgFilter,
                    commentFilter: mFilter.commentFilter,
                    conflict: conflictingApts
                });
            });
        });
    }
    
    private getFilterToIdentifyTransactionOwner(transaction: any) {
        const aptNumber = this.getAptNumber(transaction.transactionMsg, '[\/\* ]');
        const transactionType = this.getTransactionType(transaction.transactionMsg);
        const transactionMsgFilter = this.getFilter(transaction.transactionMsg, '[\/\*]');
        const commentFilter = this.getFilter(transaction.comment, '[ ]');
        let filter = undefined;
        if (this.isFilterValid(transactionMsgFilter) && this.isFilterValid(commentFilter)) {
            filter = {
                $or: [
                    this.getDbFilter('transactionMsg', transactionMsgFilter),
                    this.getDbFilter('comment', commentFilter)
                ]
            };
        } else if (this.isFilterValid(transactionMsgFilter)) {
            filter = this.getDbFilter('transactionMsg', transactionMsgFilter);
        } else if (this.isFilterValid(commentFilter)) {
            filter = this.getDbFilter('comment', commentFilter);
        } else {
            filter = undefined;
        }

        return {
            aptNumber: aptNumber,
            transactionMsgFilter : transactionMsgFilter,
            commentFilter : commentFilter,
            dbFilter: filter,
            transactionType: transactionType
        }
    }

    private isFilterValid(filteredSubMsg: string[]) {
        return filteredSubMsg && filteredSubMsg.length > 0;
    }

    private getDbFilter(field: string, filters: string[]) {
        if (filters && filters.length > 0) {
            const filter: any = {};
            const regExFilters: RegExp[] = [];
            filters.forEach(f => {
                regExFilters.push(new RegExp(f));
            });
            filter[field] = {
                $in: regExFilters
            };
            return filter;
        } else {
            return undefined;
        }
    }
    
    private getFilter(message: string, pattern: string) {
        const subMessages = this.splitText(message, pattern);
        const filteredSubMsg: string[] = [];
        let filterOrderIndex = 0;
        let lastSubMsgType = undefined;
        for (let i = 0; i < subMessages.length; i++) {
            const subSubMessages = this.splitText(subMessages[i], '[ ]');
            for (let j = 0; j < subSubMessages.length; j++) {
                if (this.isTextValid(subSubMessages[j])) {
                    if (this.isMobileNumber(subSubMessages[j])) {
                        filteredSubMsg.unshift(subSubMessages[j]);
                        lastSubMsgType = 'mobile';
                        filterOrderIndex++;
                    } else if (this.isName(subSubMessages[j])) {
                        if (lastSubMsgType === 'name') {
                            const lastSubMsg = filteredSubMsg[filterOrderIndex - 1];
                            filteredSubMsg[filterOrderIndex - 1] = lastSubMsg + '\\s+' + subSubMessages[j];
                        } else {
                            filteredSubMsg.splice(filterOrderIndex, 0, subSubMessages[j]);
                            filterOrderIndex++;
                        }
                        lastSubMsgType = 'name';
                    } else {
                        lastSubMsgType = undefined;
                    }    
                }
            }
        }
        return filteredSubMsg;
    }

    private getAptNumber(message: string, pattern: string): any {
        if (message && (message.length > 0)) {
            const numbers = message.match(/(\d+)/g);
            if (numbers !== null) {
                let aptNumber = undefined;
                let aptNumberFound = false;
                for (let i = 0; (i < numbers.length) && !aptNumberFound; i++) {
                    const number = numbers[i];
                    if (number) {
                        const aptNumbers = number.match(/^([1-4][0-4][0-9])$/);
                        aptNumberFound = (aptNumbers !== null) && ((<any[]>aptNumbers).length > 0);
                        if(aptNumberFound) { 
                            aptNumber = (<any[]>aptNumbers)[0]; 
                        }
                    }
                }
                return aptNumber;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    private getTransactionType(message: string): any {
        return message.startsWith('CHEQUE') ? 'cheque' : 'online';
    }

    private isTextValid(subMsg: string) {
        return subMsg !== 'BY' && subMsg !== 'FROM' && !subMsg.startsWith('TRANSFER') && subMsg !== 'Main' &&
               !subMsg.startsWith('CITI') && !subMsg.startsWith('Maintenance') && subMsg !== 'CR' &&
               !subMsg.startsWith('CHEQUE') && !subMsg.startsWith('CHQ') && !subMsg.startsWith('CLEARING') &&
               !subMsg.startsWith('HDFC') && !subMsg.startsWith('SBIN') && !subMsg.startsWith('ICIC') &&
               !subMsg.startsWith('IMPS') && !subMsg.startsWith('HSBC') && !subMsg.startsWith('UTIB') &&
               !subMsg.startsWith('Society') && !subMsg.toLowerCase().startsWith('july') && !subMsg.toLowerCase().startsWith('aug') &&
               !subMsg.toLowerCase().startsWith('sep') && !subMsg.startsWith('for') && subMsg !== 'UTILITY' && subMsg !== 'A' &&
               !subMsg.toLowerCase().startsWith('june') && subMsg !== 'EVA' && subMsg !== 'TO' && !subMsg.toLowerCase().startsWith('main') &&
               subMsg.toLowerCase() !== 'rs' && subMsg.toLowerCase() !== 'rs.' && !subMsg.toLowerCase().startsWith('rent') &&
               !subMsg.toLowerCase().startsWith('bloc') && !subMsg.toLowerCase().startsWith('exp') && 
               !subMsg.toLowerCase().startsWith('flat') && subMsg.toLowerCase() !== 'no';
    }

    private isMobileNumber(subMsg: string) {
        const matches = subMsg.match(/^[4-9]\d{9}$/);
        return (matches !== null) && matches.length === 1 ? true : false;
    }

    private isName(subMsg: string) {
        const matches =  subMsg.match(/^[a-zA-Z]+$/);
        return (matches !== null) && matches.length === 1 ? true : false;
    }
    
    private isAlphanumeric(subMsg: string) {
        const matches = subMsg.match(/^[a-zA-Z0-9]+$/);
        return matches && matches.length === 1 ? true : false;
    }
    
    private splitText(message: string, pattern: string): string[] {
        const regex = new RegExp(pattern, 'g');
        const splitStrings: string[] = message.split(regex);
        return splitStrings;
    }

    private trimChars(message: string, characters: string[]) {
        for (let i = 0; i < characters.length; i++) {
            const character = characters[i];
            while (message.endsWith(character)) {
                message = message.substring(0, message.length - 2);
            }
        }
        return message;
    }
}
