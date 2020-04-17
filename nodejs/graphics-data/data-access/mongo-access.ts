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

    public GetConfiguration(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getClient().then(client => {
                const blocks = client.db('vault').collection('configuration').find({})
                blocks.toArray().then(config => {
                    if (config && (config.length > 0)) {
                        resolve(config[0]);
                    } else {
                        resolve(undefined);
                    }
                });
            });
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
                if (sessionDb) {
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
                if (userDb) {
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
                if (ownerDb) {
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
                if (paymentTypeDb) {
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
                if (transactionTypeDb) {
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
                if (transactionHistoryDb) {
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

    public SavePayment(payment: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getClient().then(client => {
                const transactionHistoryDb = client.db('apartments').collection('transactionhistory');
                if (transactionHistoryDb) {
                    console.log('payment: ' + payment);
                    transactionHistoryDb.insertOne(payment)
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
                if (transactionTypeDb) {
                    transactionTypeDb.find({}).toArray().then(transactionTypes => {
                        if(transactionTypes) {
                            resolve(this.getValidEntries(transactionTypes));
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

    private getValidEntries(entries: any[]): any[] {
        const validEntries: any[] = [];
        entries.forEach(e => {
            if (Object.keys(e).length > 1) {
                validEntries.push(e);
            }
        })
        return validEntries;
    }
    
    public FindBalance(apartment: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getClient().then(client => {
                const paymentBalanceDb = client.db('apartments').collection('paymentbalance');
                if (paymentBalanceDb) {
                    paymentBalanceDb.findOne({ 
                        aptNumber: apartment 
                    }).then(balance => {
                        console.log('balance: ' + balance);
                        if (balance) {
                            resolve(balance);
                        } else {
                            resolve({
                                maintenance: 0,
                                penalty: 0,
                                corpus: 0,
                                water: 0,
                                advance: 0
                            });
                        }
                    });           
                } else {
                    resolve(undefined);
                }
            });
        });
    }
}