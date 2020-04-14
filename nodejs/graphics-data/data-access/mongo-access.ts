import { MongoClient, Db } from 'mongodb';
import { DataAccess } from "./data-access";

export class MongoAccess extends DataAccess {
    private url: string = 'mongodb://localhost:27017/graphics';

    constructor() { 
        super();
    }

    private getClient(): Promise<MongoClient> {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.url, (err, client) => {
                if(err) throw err;
                console.log('Database connected.');
                resolve(client);
            })
        });
    }

    public GetBlocks() : Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.getClient().then(client => {
                const blocks = client.db('graphics').collection('block').find({})
                blocks.toArray().then(v => {
                    resolve(v);
                });
            });
        });
    }

    public GetConnections() : Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.getClient().then(client => {
                const connections = client.db('graphics').collection('connection').find({})
                connections.toArray().then(v => {
                    resolve(v);
                });
            });
        });
    }

    public CreateSession(user: string, sessionId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.getClient().then(client => {
                const sessionDb = client.db('apartments').collection('session');
                if (sessionDb !== undefined) {
                    sessionDb.findOneAndUpdate({
                        user: user
                    },
                    {
                        $set: {
                            user: user,
                            sessionId: sessionId
                        }
                    },
                    {
                        upsert: true
                    })
                    .then(session => {
                        if (session) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    })
                    .catch(err => {
                        resolve(false);
                    });       
                } else {
                    resolve(false);
                }
            });
        });
    }

    public FindUser(user: string, includeRoles: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getClient().then(client => {
                const userDb = client.db('apartments').collection('owner');
                if (userDb !== undefined) {
                    userDb.findOne({
                        email: user
                    }).then(user => {
                        if(user) {
                            if (includeRoles) {
                                const roleDb = client.db('apartments').collection('role');
                                if (roleDb) {
                                    roleDb.findOne({
                                        roleId: user.roleId
                                    }).then(role => {
                                        user.roles = role.roles;
                                        resolve(user);   
                                    });
                                } else {
                                    user.roles = [];
                                    resolve(user);    
                                }
                            } else {
                                resolve(user);
                            }
                        } else {
                            resolve(undefined);
                        }
                    });           
                } else {
                    resolve(undefined);
                }
            });
        });
    }    

    public GetOwners(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.getClient().then(client => {
                const ownerDb = client.db('apartments').collection('owner');
                if (ownerDb !== undefined) {
                    ownerDb.find({}).toArray().then(owners => {
                        if(owners) {
                            resolve(owners);
                        } else {
                            resolve([]);
                        }
                    });           
                } else {
                    resolve([]);
                }
            });
        });
    }  
    
    public GetPaymentTypes(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.getClient().then(client => {
                const paymentTypeDb = client.db('apartments').collection('paymenttype');
                if (paymentTypeDb !== undefined) {
                    paymentTypeDb.find({}).toArray().then(paymentTypes => {
                        if(paymentTypes) {
                            resolve(paymentTypes);
                        } else {
                            resolve([]);
                        }
                    });           
                } else {
                    resolve([]);
                }
            });
        });
    }    

    public GetTransactionTypes(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.getClient().then(client => {
                const transactionTypeDb = client.db('apartments').collection('transactiontype');
                if (transactionTypeDb !== undefined) {
                    transactionTypeDb.find({}).toArray().then(transactionTypes => {
                        if(transactionTypes) {
                            resolve(transactionTypes);
                        } else {
                            resolve([]);
                        }
                    });           
                } else {
                    resolve([]);
                }
            });
        });
    }
    
    public SaveTransaction(transaction: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getClient().then(client => {
                const transactionHistoryDb = client.db('apartments').collection('transactionhistory');
                if (transactionHistoryDb !== undefined) {
                    transactionHistoryDb.insertOne(transaction)
                    .then(result => {
                        if (result) {
                            resolve(result);
                        } else {
                            resolve(undefined);
                        }
                    })
                    .catch(err => {
                        resolve(undefined);
                    });       
                } else {
                    resolve(undefined);
                }
            });
        });
    }

    public SavePayment(transaction: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getClient().then(client => {
                const transactionHistoryDb = client.db('apartments').collection('transactionhistory');
                if (transactionHistoryDb !== undefined) {
                    transactionHistoryDb.insertOne(transaction)
                    .then(result => {
                        if (result) {
                            resolve(result);
                        } else {
                            resolve(undefined);
                        }
                    })
                    .catch(err => {
                        resolve(undefined);
                    });       
                } else {
                    resolve(undefined);
                }
            });
        });
    }

    public GetPayments(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.getClient().then(client => {
                const transactionTypeDb = client.db('apartments').collection('transactionhistory');
                if (transactionTypeDb !== undefined) {
                    transactionTypeDb.find({}).toArray().then(transactionTypes => {
                        if(transactionTypes) {
                            resolve(transactionTypes);
                        } else {
                            resolve([]);
                        }
                    });           
                } else {
                    resolve([]);
                }
            });
        });
    }    
}