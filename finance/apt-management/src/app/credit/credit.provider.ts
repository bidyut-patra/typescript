import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/appsettings';
import { Observable } from 'rxjs';
import { ObservableModel } from '../utlities/observablemodel';

@Injectable()
export class CreditDataProvider {
    private cache: any;
    private owners$: ObservableModel<any[]>;
    private transactionTypes$: ObservableModel<any[]>;
    private paymentTypes$: ObservableModel<any[]>;

    constructor(private http: HttpClient, private appSettings: AppSettings) {
        this.owners$ = new ObservableModel<any[]>([], http);
        this.transactionTypes$ = new ObservableModel<any[]>([], http);
        this.paymentTypes$ = new ObservableModel<any[]>([], http);
    }

    public loadCache(reload: boolean) {
        if (reload) {
            this.cache = {};
            this.cache.owners = this.getOwners();
            this.cache.paymentTypes = this.getPaymentTypes();
            this.cache.transactionTypes = this.getTransactionTypes();
        }
    }

    public getCache(): any {
        return this.cache;
    }

    public getTransactionTypes(): Observable<any> {
        const credentialUrl = this.appSettings.ServerApi + '/transactiontypes' + this.appSettings.BaseQueryString;
        return this.transactionTypes$.get(credentialUrl);
    }

    public getPaymentTypes(): Observable<any> {
        const credentialUrl = this.appSettings.ServerApi + '/paymenttypes' + this.appSettings.BaseQueryString;
        return this.paymentTypes$.get(credentialUrl);
    }

    public getOwners(): Observable<any> {
        const credentialUrl = this.appSettings.ServerApi + '/owners' + this.appSettings.BaseQueryString;
        return this.owners$.get(credentialUrl);
    }
}
