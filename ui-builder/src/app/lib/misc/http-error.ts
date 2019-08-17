import { Guid } from './guid';

export class HttpError {
    private subscriptions: Array<any>;
    constructor() {
        this.subscriptions = [];
    }

    public subscribe(f: Function): string {
        const sKey = Guid.guid();
        const subscription = { key: sKey, callback: f};
        this.subscriptions.push(subscription);
        return sKey;
    }

    public unsubscribe(subKey: string) {
        this.subscriptions[subKey] = undefined;
    }

    public publish(msg: any) {
        this.subscriptions.forEach(subscription => {
            subscription.callback(msg);
        });
    }
}

export let HttpErrorHandler = new HttpError();
