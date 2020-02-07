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
}