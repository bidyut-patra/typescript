import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/appsettings';
import { ObservableModel } from '../utlities/observablemodel';
import { ITypes } from './types';

@Injectable()
export class FinanceDataProvider {
    private types: ITypes;
    private owners$: ObservableModel<any[]>;
    private transactionTypes$: ObservableModel<any[]>;
    private paymentTypes$: ObservableModel<any[]>;

    constructor(private http: HttpClient, private appSettings: AppSettings) {
        this.owners$ = new ObservableModel<any[]>([], http);
        this.transactionTypes$ = new ObservableModel<any[]>([], http);
        this.paymentTypes$ = new ObservableModel<any[]>([], http);
    }

    public loadTypes(reload: boolean) {
        if (reload) {
            this.types = {
                owners: undefined,
                paymentTypes: undefined,
                transactionTypes: undefined
            };
            this.types.owners = this.getOwners();
            this.types.paymentTypes = this.getPaymentTypes();
            this.types.transactionTypes = this.getTransactionTypes();
        }
    }

    public getTypes(): any {
        return this.types;
    }

    public getTransactionTypes(): ObservableModel<any[]> {
        const credentialUrl = this.appSettings.ServerApi + '/transactiontypes' + this.appSettings.BaseQueryString;
        return this.transactionTypes$.get(credentialUrl);
    }

    public getPaymentTypes(): ObservableModel<any[]> {
        const credentialUrl = this.appSettings.ServerApi + '/paymenttypes' + this.appSettings.BaseQueryString;
        return this.paymentTypes$.get(credentialUrl);
    }

    public getOwners(): ObservableModel<any[]> {
        const credentialUrl = this.appSettings.ServerApi + '/owners' + this.appSettings.BaseQueryString;
        return this.owners$.get(credentialUrl);
    }
}
