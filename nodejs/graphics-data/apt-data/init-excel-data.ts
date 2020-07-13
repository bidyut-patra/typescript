import { ReadPaymentExcel } from './read-excel-payments';
import { MongoAccess } from '../data-access/mongo-access';

export class InitExcelData {
    private mongo: MongoAccess;
    
    constructor(mongo: MongoAccess) {
        this.mongo = mongo;
    }

    public async initialize() {
        const readExcelPayments = new ReadPaymentExcel();
        const transactions = await readExcelPayments.initialize();
        await this.mongo.ClearAllTransactions();
        await this.mongo.SaveAllTransactions(transactions);
    }
}