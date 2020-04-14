import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CreditDataProvider } from '../credit.provider';
import { PaymentDataProvider } from '../payment.provider';

@Component({
    selector: 'app-new-payment',
    templateUrl: './new-payment.view.html',
    styleUrls: ['./new-payment.scss']
})
export class NewPaymentComponent implements OnInit {
    public payment$: Observable<any>;
    public lists: any;
    public isNewPayment: boolean;

    constructor(private creditDataProvider: CreditDataProvider,
                private paymentDataProvider: PaymentDataProvider) {

    }

    ngOnInit() {
        this.lists = this.creditDataProvider.getCache();
        this.payment$ = this.paymentDataProvider.getNewPayment();
        this.isNewPayment = true;
    }
}
