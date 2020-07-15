import { MongoAccess } from "../data-access/mongo-access";

export class IdentifyOwner {
    private mongo: MongoAccess;

    constructor(mongo: MongoAccess) {
        this.mongo = mongo;
    }

    public async identifyTransactions(transactions: any[]) {
        // Identify the owner from the transaction message and comment and old payment history
        const transactionCount = transactions.length;
        for (let i = 0; i < transactionCount; i++) {
            const filter = this.getFilterToIdentifyTransactionOwner(transactions[i]);
            transactions[i]['transactionMsgFilter'] = filter.transactionMsgFilter;
            transactions[i]['commentFilter'] = filter.commentFilter;

            let owner = undefined;
            if (filter.dbFilter) {
                const result = await this.getTransactionOwner(filter.dbFilter);
                owner = result.transactionOwner;
            }

            if ((owner === undefined) || (owner.number === undefined)) {
                console.log('transactionMsgFilter: ', filter.transactionMsgFilter);
                console.log('commentFilter: ', filter.commentFilter);
            }        

            if(owner && filter.aptNumber) {
                transactions[i].aptNumber = filter.aptNumber;
                transactions[i].owner = '';                
            } else if (owner) {
                transactions[i].aptNumber = owner.number;
                transactions[i].owner = owner.name;
            } else if (filter.aptNumber) {
                transactions[i].aptNumber = filter.aptNumber;
                transactions[i].owner = '';
            } else {
                transactions[i].aptNumber = '';
                transactions[i].owner = '';
            }
        }
        return transactions;
    }

    private getTransactionOwner(dbFilter: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.mongo.GetTransactionOwner(dbFilter).then(owner => {
                resolve({
                    transactionOwner: owner
                });
            });
        });
    }
    
    private getFilterToIdentifyTransactionOwner(transaction: any) {
        const aptNumber = this.getAptNumber(transaction.transactionMsg, '[\/\* ]');
        const transactionType = this.getPaymentType(transaction.transactionMsg);
        const transactionMsg = this.trimTraillingChars(transaction.transactionMsg, ['-']);
        const transactionMsgFilter = this.getFilterTexts(transactionMsg, '[\/\*]', true);
        const comment = this.trimTraillingChars(transaction.comment, ['/', ' ']);
        const commentFilter = this.getFilterTexts(comment, '[ ]', false);

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
    
    private getFilterTexts(message: string, pattern: string, identifyNameOnce: boolean = false) {
        const subMessages = this.splitText(message, pattern);
        const filteredSubMsg: string[] = [];
        let filterOrderIndex = 0;
        let lastSubMsgType = undefined;
        let nameIdentified = false;
        for (let i = 0; i < subMessages.length; i++) {
            const subSubMessages = this.splitText(subMessages[i], '[ ]');
            let foundName = false;
            for (let j = 0; j < subSubMessages.length; j++) {
                if (this.isTextValid(subSubMessages[j])) {
                    if (this.isMobileNumber(subSubMessages[j])) {
                        filteredSubMsg.unshift(subSubMessages[j]);
                        lastSubMsgType = 'mobile';
                        filterOrderIndex++;
                    } else if (this.isName(subSubMessages[j]) && 
                               this.allowNameIdentification(identifyNameOnce, nameIdentified)) {
                        if (lastSubMsgType === 'name') {
                            const lastSubMsg = filteredSubMsg[filterOrderIndex - 1];
                            filteredSubMsg[filterOrderIndex - 1] = lastSubMsg + '\\s+' + subSubMessages[j];
                        } else {
                            filteredSubMsg.push(subSubMessages[j]);
                            filterOrderIndex++;
                        }
                        lastSubMsgType = 'name';
                        foundName = true;
                    } else {
                        lastSubMsgType = undefined;
                    }    
                }
            }
            nameIdentified = nameIdentified ? true : (foundName ? true : false);
        }
        return filteredSubMsg;
    }

    private allowNameIdentification(identifyNameOnce: boolean, foundName: boolean) {
        return identifyNameOnce ? (foundName ? false : true) : true;
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

    private getPaymentType(message: string): any {
        return message.startsWith('CHEQUE') ? 'cheque' : 'online';
    }

    private isTextValid(subMsg: string) {
        return subMsg !== 'BY' && subMsg !== 'FROM' && !subMsg.startsWith('TRANSFER') && subMsg !== 'Main' && subMsg !== 'BI' &&
               !subMsg.startsWith('CITI') && !subMsg.startsWith('Maintenance') && subMsg !== 'CR' && subMsg !== 'TRANSFER-UPI' &&
               !subMsg.startsWith('CHEQUE') && !subMsg.startsWith('CHQ') && !subMsg.startsWith('CLEARING') && subMsg !== 'Se' &&
               !subMsg.startsWith('HDFC') && !subMsg.startsWith('SBIN') && !subMsg.startsWith('ICIC') && !subMsg.startsWith('Paym') &&
               !subMsg.startsWith('IMPS') && !subMsg.startsWith('HSBC') && !subMsg.startsWith('UTIB') && subMsg !== 'MICR' &&
               !subMsg.startsWith('Society') && !subMsg.toLowerCase().startsWith('july') && !subMsg.toLowerCase().startsWith('aug') &&
               !subMsg.toLowerCase().startsWith('sep') && !subMsg.startsWith('for') && subMsg !== 'UTILITY' && subMsg !== 'A' &&
               !subMsg.toLowerCase().startsWith('june') && subMsg !== 'EVA' && subMsg.toLowerCase() !== 'to' && subMsg !== 'MBS' &&
               !subMsg.toLowerCase().startsWith('main') && subMsg !== 'UPI' && !subMsg.toLowerCase().startsWith('jul') &&
               subMsg.toLowerCase() !== 'rs' && subMsg.toLowerCase() !== 'rs.' && !subMsg.toLowerCase().startsWith('rent') &&
               !subMsg.toLowerCase().startsWith('bloc') && !subMsg.toLowerCase().startsWith('exp') && 
               !subMsg.toLowerCase().startsWith('due') && !subMsg.toLowerCase().startsWith('toward') &&
               subMsg.toLowerCase() !== 'others' && !subMsg.toLowerCase().startsWith('flat') && 
               subMsg.toLowerCase() !== 'no' && subMsg.toLowerCase() !== 'radiant';
    }

    private isMobileNumber(subMsg: string) {
        const matches = subMsg.match(/^[3-9][0-9]{9}$/);
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

    private trimChars(message: string, leadingChars: string[], traillingChars: string[]) {
        const messageAfterLeadingCharsRemoval = this.trimLeadingChars(message, leadingChars);
        return this.trimTraillingChars(messageAfterLeadingCharsRemoval, traillingChars);
    }

    private trimTraillingChars(message: string, characters: string[]) {
        for (let i = 0; i < characters.length; i++) {
            const character = characters[i];
            while (message.endsWith(character)) {
                message = message.substring(0, message.length - 2);
            }
        }
        return message;
    }

    private trimLeadingChars(message: string, characters: string[]) {
        for (let i = 0; i < characters.length; i++) {
            const character = characters[i];
            while (message.endsWith(character)) {
                message = message.substring(0, message.length - 2);
            }
        }
        return message;
    }
}
