import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettings } from 'src/appsettings';
import { ObservableModel } from '../utlities/observablemodel';

@Injectable()
export class PaymentDataProvider {
    private newPayment$: ObservableModel<any>;
    private payments$: ObservableModel<any[]>;
    private payment$: ObservableModel<any>;
    private savedPayment$: ObservableModel<any>;

    constructor(private http: HttpClient, private appSettings: AppSettings) {
        this.newPayment$ = new ObservableModel<any>({
            number: '',
            email: '',
            name: '',
            contact: '',
            currentDate: new Date().toLocaleString()
        }, http);
        this.payments$ = new ObservableModel<any[]>([], http);
        this.payment$ = new ObservableModel<any>({}, http);
        this.savedPayment$ = new ObservableModel<any>({}, http);
    }

    public getNewPayment(): Observable<any> {
        const userToken = this.appSettings.UserToken;
        const sessionId = this.appSettings.SessionId;
        const newPaymentUrl = this.appSettings.ServerApi + '/payment' + this.appSettings.BaseQueryString;
        return this.newPayment$.get(newPaymentUrl);
    }

    public getPayments(): Observable<any> {
        const userToken = this.appSettings.UserToken;
        const sessionId = this.appSettings.SessionId;
        const paymentsUrl = this.appSettings.ServerApi + '/payments' + this.appSettings.BaseQueryString;
        return this.payments$.get(paymentsUrl);
    }

    public getPayment(paymentId: string): Observable<any> {
        const userToken = this.appSettings.UserToken;
        const sessionId = this.appSettings.SessionId;
        const queryString = '/payments' + this.appSettings.BaseQueryString + '&paymentId=' + paymentId;
        const paymentUrl = this.appSettings.ServerApi + queryString;
        return this.payment$.get(paymentUrl);
    }

    public savePayment(payment: any): Observable<any> {
        const userToken = this.appSettings.UserToken;
        const sessionId = this.appSettings.SessionId;
        const paymentUrl = this.appSettings.ServerApi + '/payment' + this.appSettings.BaseQueryString;
        return this.savedPayment$.post(paymentUrl, payment);
    }
}
