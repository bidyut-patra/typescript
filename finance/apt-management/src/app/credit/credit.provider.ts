import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { AppSettings } from 'src/appsettings';
import { Observable } from 'rxjs';

@Injectable()
export class CreditDataProvider {
    private cache: any;

    constructor(private http: HttpClient, private appSettings: AppSettings) {

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
        const credentialUrl = this.appSettings.ServerApi + '/transactiontypes';
        return this.http.get(credentialUrl);
    }

    public getPaymentTypes(): Observable<any> {
        const credentialUrl = this.appSettings.ServerApi + '/paymenttypes';
        return this.http.get(credentialUrl);
    }

    public getOwners(): Observable<any> {
        const credentialUrl = this.appSettings.ServerApi + '/owners';
        return this.http.get(credentialUrl);
    }
}
