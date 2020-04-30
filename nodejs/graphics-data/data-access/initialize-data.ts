import { MongoAccess } from './mongo-access';

let mongo: MongoAccess;

export function setMongoAccess(mongoObj: MongoAccess) {
    mongo = mongoObj;
}

export function saveTransactions(transactions: any[]) {
    mongo.SaveAllTransactions(transactions)
    .then(r => {
        console.log('Saved transactions');
    })
}

export function saveMaintenances(maintenances: any) {
    mongo.GenerateBalanceForAllResidents(maintenances)
    .then(r => {
        console.log('Saved maintenances');
    })
}

export function generateData() {
    mongo.GenerateBalanceForAllResidents({});
}

export function saveOwners(owners: any[]) {
    mongo.SaveOwners(owners)
    .then(r => {
        console.log('Saved owners');
    })
}