import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/appsettings';
import { ObservableModel } from '../utlities/observablemodel';

@Injectable()
export class PaymentDataProvider {
    private owner$: ObservableModel<any>;
    private balance$: ObservableModel<any>;
    private payments$: ObservableModel<any[]>;
    private payment$: ObservableModel<any>;
    private savedPayment$: ObservableModel<any>;

    constructor(private http: HttpClient, private appSettings: AppSettings) {
        this.owner$ = new ObservableModel<any>({}, http);
        this.balance$ = new ObservableModel<any>({}, http);
        this.payments$ = new ObservableModel<any[]>([], http);
        this.payment$ = new ObservableModel<any>({}, http);
        this.savedPayment$ = new ObservableModel<any>({}, http);
    }

    public getOwner(): Observable<any> {
        const ownerUrl = this.appSettings.ServerApi + '/owner' + this.appSettings.BaseQueryString;
        return this.owner$.get(ownerUrl);
    }

    public getBalance(aptNumber?: number): Observable<any> {
        const aptNumberQueryParam = aptNumber ? '&aptNumber=' + aptNumber : '';
        const balanceUrl = this.appSettings.ServerApi + '/balance' + this.appSettings.BaseQueryString + aptNumberQueryParam;
        return this.balance$.get(balanceUrl);
    }

    public getPayments(aptNumber?: number): Observable<any> {
        const aptNumberQueryParam = aptNumber ? '&aptNumber=' + aptNumber : '';
        const paymentsUrl = this.appSettings.ServerApi + '/payments' + this.appSettings.BaseQueryString + aptNumberQueryParam;
        return this.payments$.get(paymentsUrl);
    }

    public getPayment(paymentId: string): Observable<any> {
        const queryString = '/payments' + this.appSettings.BaseQueryString + '&paymentId=' + paymentId;
        const paymentUrl = this.appSettings.ServerApi + queryString;
        return this.payment$.get(paymentUrl);
    }

    public savePayment(payment: any): Observable<any> {
        const paymentUrl = this.appSettings.ServerApi + '/payment' + this.appSettings.BaseQueryString;
        return this.savedPayment$.post(paymentUrl, payment);
    }
}
