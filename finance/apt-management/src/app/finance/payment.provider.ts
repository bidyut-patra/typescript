import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import { AppSettings } from 'src/appsettings';
import { ObservableModel } from '../utlities/observablemodel';
import { TransactionsReader } from './transactions.reader';

@Injectable()
export class PaymentDataProvider {
    private owner$: ObservableModel<any>;
    private balance$: ObservableModel<any>;
    private payments$: ObservableModel<any[]>;
    private payment$: ObservableModel<any>;
    private savedPayment$: ObservableModel<any>;
    private transactions$: ObservableModel<any[]>;
    private savedTransactions$: ObservableModel<any[]>;

    constructor(private http: HttpClient, private appSettings: AppSettings, private transactionsReader: TransactionsReader) {
        this.owner$ = new ObservableModel<any>({}, http);
        this.balance$ = new ObservableModel<any>({}, http);
        this.payments$ = new ObservableModel<any[]>([], http);
        this.payment$ = new ObservableModel<any>({}, http);
        this.savedPayment$ = new ObservableModel<any>({}, http);
        this.savedTransactions$ = new ObservableModel<any[]>([], http);
        this.transactions$ = new ObservableModel<any[]>([], http, this.getTransformedTransactions);
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

    public getPayments(aptNumber?: number): ObservableModel<any[]> {
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

    private getTransformedTransactions(transactions: any[]) {
        const transformedTransactions = [];
        transactions.forEach(transaction => {
            let transformedTransaction: any = {};
            transformedTransaction = Object.assign(transformedTransaction, transaction);
            if (transaction.aptNumber) {
                transformedTransaction.selected = true;
            } else {
                transformedTransaction.selected = false;
            }
            transformedTransactions.push(transformedTransaction);
        });
        // transformedTransactions.sort((a: any, b: any) => {
        //     if (a.aptNumber === b.aptNumber) {
        //         return 0;
        //     } else {
        //         return 1;
        //     }
        // });
        return transformedTransactions;
    }

    public getTransactions(bankStatementFiles: any[]): ObservableModel<any[]> {
        if (this.transactions$.loading) {
            return this.transactions$;
        } else {
            const readFile = new FileReader();
            readFile.onload = (e) => {
              const data = new Uint8Array(<any>readFile.result);
              const arr = new Array();
              for (let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
              const bstr = arr.join('');
              const workbook = XLSX.read(bstr, { type: 'binary' });
              const first_sheet_name = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[first_sheet_name];
              const transactions = this.transactionsReader.read(worksheet);
              console.log('Transactions: ', transactions);
              // send the transactions to the server to identify the owners
              const identifyOwnerUrl = this.appSettings.ServerApi + '/identifyowner' + this.appSettings.BaseQueryString;
              this.transactions$.post(identifyOwnerUrl, { transactions: transactions });
            };
            readFile.readAsArrayBuffer(bankStatementFiles[0]);
            this.transactions$.next([]);
            return this.transactions$;
        }
    }

    public findApt(aptNumber: number): boolean {
        const transactions = this.transactions$.value.filter(t => t.aptNumber === aptNumber);
        return transactions.length > 1;
    }

    public areOwnersIdentified(): boolean {
        return this.transactions$.value.every(t => {
            if (t.aptNumber) {
                return true;
            } else {
                return false;
            }
        });
    }

    public areValidOwnersIdentified(): boolean {
        const ownersIdentified = this.areOwnersIdentified();
        if (ownersIdentified) {
            return this.transactions$.value.every(t => {
                const aptNumber = parseInt(t.aptNumber, 10);
                return (aptNumber > 100 && aptNumber < 142) || (aptNumber > 200 && aptNumber < 242) ||
                        (aptNumber > 300 && aptNumber < 342) || (aptNumber > 400 && aptNumber < 442);
            });
        } else {
            return false;
        }
    }

    public areOwnersUnique(): boolean {
        const aptNumbers = {};
        let uniqueOwner = true;
        for (let i = 0; (i < this.transactions$.value.length) && uniqueOwner; i++) {
            const val = this.transactions$.value[i];
            if (aptNumbers[val]) {
                uniqueOwner = false;
            } else {
                aptNumbers[val] = true;
            }
        }
        return uniqueOwner;
    }

    public saveTransactions() {
        const queryString = '/transactions' + this.appSettings.BaseQueryString;
        const paymentUrl = this.appSettings.ServerApi + queryString;
        this.savedTransactions$.next([]);
        return this.savedTransactions$.post(paymentUrl, { transactions: this.transactions$.value });
    }
}
