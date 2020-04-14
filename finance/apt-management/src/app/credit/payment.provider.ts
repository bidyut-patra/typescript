import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/appsettings';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentDataProvider {

    constructor(private http: HttpClient, private appSettings: AppSettings) {

    }

    public getNewPayment(): Observable<any> {
        const userToken = this.appSettings.UserToken;
        const sessionId = this.appSettings.SessionId;
        const newPaymentUrl = this.appSettings.ServerApi + '/payment?user=' + userToken + '&session=' + sessionId;
        return this.http.get(newPaymentUrl);
    }

    public getPayments(): Observable<any> {
        const userToken = this.appSettings.UserToken;
        const sessionId = this.appSettings.SessionId;
        const paymentsUrl = this.appSettings.ServerApi + '/payments?user=' + userToken + '&session=' + sessionId;
        return this.http.get(paymentsUrl);
    }

    public getPayment(paymentId: string): Observable<any> {
        const userToken = this.appSettings.UserToken;
        const sessionId = this.appSettings.SessionId;
        const queryString = '/payments?user=' + userToken + '&session=' + sessionId + '&paymentId=' + paymentId;
        const paymentUrl = this.appSettings.ServerApi + queryString;
        return this.http.get(paymentUrl);
    }

    public savePayment(payment: any): Observable<any> {
        const userToken = this.appSettings.UserToken;
        const sessionId = this.appSettings.SessionId;
        const paymentUrl = this.appSettings.ServerApi + '/payment?user=' + userToken + '&session=' + sessionId;
        return this.http.post(paymentUrl, payment);
    }
}
