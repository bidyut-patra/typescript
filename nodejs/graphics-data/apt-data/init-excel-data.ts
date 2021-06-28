import { ReadPaymentExcel } from './read-excel-payments';
import { MongoAccess } from '../data-access/mongo-access';

export class InitExcelData {
    private mongo: MongoAccess;
    
    constructor(mongo: MongoAccess) {
        this.mongo = mongo;
    }

    public async initialize() {
        const owners = await this.mongo.GetOwners();
        const readExcelPayments = new ReadPaymentExcel(owners);
        const transactions = await readExcelPayments.initialize();
        await this.mongo.ClearCredits();
        await this.mongo.ClearDebits();
        await this.mongo.SaveCredits(transactions.credits);
        await this.mongo.SaveDebits(transactions.debits);
    }
}