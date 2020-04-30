import { MongoClient, Db } from 'mongodb';
import { DataAccess } from "./data-access";
import { PaymentType } from './payment-balance';

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

    public SaveOwners(owners: any[]) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.getClient().then(client => {
                const ownerDb = client.db('apartments').collection('owner');
                if (ownerDb) {
                    ownerDb.insertMany(owners).then(result => {
                        resolve(result);
                    });
                } else {
                    resolve({});
                }
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
                                        user.role = role;
                                        resolve(user);   
                                    });
                                } else {
                                    user.role = undefined;
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

    public SaveAllTransactions(transactions: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getClient().then(client => {
                const transactionHistoryDb = client.db('apartments').collection('transactionhistory');
                if (transactionHistoryDb) {
                    transactionHistoryDb.insertMany(transactions)
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

    public GetCurrentMaintenance(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getClient().then(client => {
                const maintenanceDb = client.db('apartments').collection('maintenance');
                if (maintenanceDb) {
                    maintenanceDb.findOne({ status: 'current' }).then(currentMaintenance => {
                        if(currentMaintenance) {
                            resolve(currentMaintenance);
                        } else {
                            resolve({});
                        }
                    });           
                } else {
                    resolve({});
                }
            });
        });
    }   
    
    public ApplyMaintenance(maintenance: any, user: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.getClient().then(client => {
                const maintenanceDb = client.db('apartments').collection('maintenance');
                let maintenanceChanged = false;
                if (maintenanceDb) {
                    maintenanceDb.findOne({status: 'current'})
                    .then(currentMaintenance => {
                        if ((currentMaintenance.sizeAbove.amount !== maintenance.sizeAbove.amount) ||
                           (currentMaintenance.sizeBelow.amount !== maintenance.sizeBelow.amount) ||
                           (currentMaintenance.sizeEqual.amount !== maintenance.sizeEqual.amount)) {
                            maintenanceDb.findOneAndUpdate({ 
                                status: 'current' 
                            },
                            {
                                $set: {
                                    status: 'old'
                                }
                            },
                            {
                                upsert: true
                            })
                            .then(oldMaintenance => {
                                maintenance.status = 'current';
                                maintenance.modifiedDate = new Date().toString();
                                maintenance.modifiedBy = user.email;
                                maintenance.appliedOn = [new Date().toString()];
                                delete maintenance._id;
                                maintenanceDb.insertOne(maintenance);
                                // Apply the maintenance on each apartments
                                this.UpdateResidentsMaintenance(maintenance)
                                .then(r => {
                                    resolve(r);
                                });
                            });  
                        } else {
                            let maintenanceToApplyOnResidents = false;
                            let lastUpdate = currentMaintenance.appliedOn[currentMaintenance.appliedOn.length - 1];
                            lastUpdate = new Date(lastUpdate);
                            let currentDate = new Date();
                            if ((currentDate.getFullYear() - lastUpdate.getFullYear()) > 0) {
                                maintenanceToApplyOnResidents = true;
                            } else if ((currentDate.getMonth() - lastUpdate.getMonth()) >= 3) {
                                maintenanceToApplyOnResidents = true;
                            } else {
                                maintenanceToApplyOnResidents = false;
                            }
                            if (maintenanceToApplyOnResidents) {
                                currentMaintenance.appliedOn.push(new Date().toString());                                
                                maintenanceDb.replaceOne({ status: 'current' }, currentMaintenance);
                                // Apply the maintenance on each apartments
                                this.UpdateResidentsMaintenance(maintenance)
                                .then(r => {
                                    resolve(r);
                                });                                
                            }                          
                        }
                    });
                } else {
                    resolve(false);
                }
            });
        });
    }    

    /**
     * Gets the maintenance amount
     * 
     * @param maintenance 
     * @param owner 
     */
    private getMaintenanceAmount(maintenance: any, owner: any): number {
        let maintenanceAmount: number = 0;
        if (owner.size > maintenance.sizeAbove.size) {
            maintenanceAmount = maintenance.sizeAbove.amount;
        } else if (owner.size < maintenance.sizeBelow.size) {
            maintenanceAmount = maintenance.sizeBelow.amount;
        } else if (owner.size === maintenance.sizeEqual.size) {
            maintenanceAmount = maintenance.sizeEqual.amount;
        } else {

        }
        return maintenanceAmount;
    }
    
    public UpdateResidentsMaintenance(maintenance: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.GetOwners().then(owners => {
                this.getClient().then(client => {
                    const paymentBalanceDb = client.db('apartments').collection('paymentbalance');
                    paymentBalanceDb.find({}).toArray()
                    .then(paymentBalances => {
                        paymentBalances.forEach(balance => {
                            const owner = owners.find(o => o.number === balance.aptNumber);
                            const maintenanceAmount = this.getMaintenanceAmount(maintenance, owner);
                            const calculatedBalance = this.calculateBalance(balance, maintenanceAmount, PaymentType.ApplyMaintenance);
                            paymentBalanceDb.replaceOne({ 
                                aptNumber: balance.aptNumber
                            }, calculatedBalance);
                        })
                        resolve(true);
                    });
                });
            });
        });
    }

    public GenerateBalanceForAllResidents(paymentBalances: any) {
        return new Promise((resolve, reject) => {
            this.getClient().then(client => {
                const paymentBalanceDb = client.db('apartments').collection('paymentbalance');
                paymentBalanceDb.remove({});                
                const ownerDb = client.db('apartments').collection('owner');
                ownerDb.find({}).toArray()
                .then(owners => {
                    const balances: any[] = [];
                    owners.forEach(owner => {
                        if (paymentBalances[owner.number]) {
                            const balance = this.getBalance(paymentBalances[owner.number], owner.number);
                            balances.push(balance);
                        } else {
                            const emptyBalance = this.generateEmptyBalance(owner.number);
                            balances.push(emptyBalance);
                        }
                    })
                    paymentBalanceDb.insertMany(balances);
                    resolve(true);
                });
            });
        });
    }

    public GetPayments(aptNumber: number): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.getClient().then(client => {
                const transactionHistoryDb = client.db('apartments').collection('transactionhistory');
                if (transactionHistoryDb) {
                    const query = aptNumber ? { aptNumber: aptNumber } : {};
                    transactionHistoryDb.find(query).toArray().then(transactionHistory => {
                        if(transactionHistory) {
                            resolve(this.getValidEntries(transactionHistory));
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

    public SaveBalance(apartment: number, paidAmount: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getClient().then(client => {
                const paymentBalanceDb = client.db('apartments').collection('paymentbalance');
                if (paymentBalanceDb) {
                    paymentBalanceDb.findOne({ 
                        aptNumber: apartment 
                    }).then(balance => {
                        if (balance) {
                            const calculatedBalance = this.calculateBalance(balance, paidAmount, PaymentType.MakePayment)
                            paymentBalanceDb.replaceOne({ 
                                aptNumber: apartment
                            }, calculatedBalance);
                        } else {
                            paymentBalanceDb.insertOne(this.generateEmptyBalance(apartment));
                        }
                    });    
                    resolve(true);       
                } else {
                    resolve(false);
                }
            });
        });
    }
    
    /**
     * Calculates the new balance based on payment type
     * 
     * @param balance 
     * @param amount 
     * @param paymentType 
     */
    private calculateBalance(balance: any, amount: number, paymentType: PaymentType): any {
        let previous = balance.previous;

        let currentBalance = {
            maintenance: balance.maintenance,
            penalty: balance.penalty,
            corpus: balance.corpus,
            water: balance.water,
            advance: balance.advance,
            message: balance.message,
            appliedOn: balance.appliedOn
        };

        if (previous) {
            previous.push(currentBalance);
        } else {
            previous = [];
            previous.push(currentBalance);
        }

        let calculatedBalance;

        switch(paymentType) {
            case PaymentType.ApplyMaintenance:
                calculatedBalance = this.adjustBalanceForMaintenanceApplied(balance, amount);
                break;            
            case PaymentType.MakePayment:
                calculatedBalance = this.adjustBalanceForPaidAmount(balance, amount);
                break;
            default:
                calculatedBalance = balance;
                break;
        }

        return {
            aptNumber: balance.aptNumber,
            maintenance: calculatedBalance.maintenance,
            penalty: calculatedBalance.penalty,
            corpus: calculatedBalance.corpus,
            water: calculatedBalance.water,
            advance: calculatedBalance.advance,
            message: paymentType,
            appliedOn: new Date().toString(),
            previous: previous
        }
    }

    /**
     * Adjusts the balance as maintenance is applied
     * 
     * @param balance 
     * @param maintenanceAmount 
     */
    private adjustBalanceForMaintenanceApplied(balance: any, maintenanceAmount: number): any {
        const newBalance: any = balance;
        if (balance.advance > 0) {
            if (balance.advance >= maintenanceAmount) {
                newBalance.maintenance = 0;
                newBalance.advance = balance.advance - maintenanceAmount;
            } else {
                newBalance.maintenance = maintenanceAmount - balance.advance;
                newBalance.advance = 0;
            }
        } else {
            newBalance.maintenance = balance.maintenance + maintenanceAmount;
        }
        return newBalance;
    }

    /**
     * Adjusts the balance as payment is made
     * 
     * @param balance 
     * @param paidAmount 
     */
    private adjustBalanceForPaidAmount(balance: any, paidAmount: number): any {
        const newBalance: any = {};
        const balanceMaintenance = balance.maintenance - paidAmount;
        newBalance.maintenance = balanceMaintenance > 0 ? balanceMaintenance : 0;
        if (balanceMaintenance < 0) {
            const balancePenalty = balance.penalty + balanceMaintenance;
            newBalance.penalty = balancePenalty > 0 ? balancePenalty : 0;
            if (balancePenalty < 0) {
                const balanceCorpus = balance.corpus + balancePenalty;
                newBalance.corpus = balanceCorpus > 0 ? balanceCorpus : 0;
                if (balanceCorpus < 0) {
                    const balanceWater = balance.water + balanceCorpus;
                    newBalance.water = balanceWater > 0 ? balanceWater : 0;
                    if (balanceWater < 0) {
                        newBalance.advance = balance.advance + Math.abs(balanceWater);
                    }
                }
            }
        }

        return newBalance;
    }

    /**
     * Generates initial payment balance
     * 
     * @param apartment 
     */
    private generateEmptyBalance(apartment: number) {
        return {
            aptNumber: apartment,
            maintenance: 0,
            penalty: 0,
            corpus: 0,
            water: 0,
            advance: 0,
            message: 'ZeroBalance',
            appliedOn: new Date().toString(),
            previous: []
        }
    }

    /**
     * Generates initial payment balance
     * 
     * @param apartment 
     */
    private getBalance(balance: any, apartment: number) {
        return {
            aptNumber: apartment,
            maintenance: balance.maintenance,
            penalty: balance.penalty,
            corpus: balance.corpus,
            water: balance.water,
            advance: balance.advance,
            message: 'InitialBalance',
            appliedOn: new Date().toString(),
            previous: []
        }
    }    
}