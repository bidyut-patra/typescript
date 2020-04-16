import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentDataProvider } from '../payment.provider';
import { CreditDataProvider } from '../credit.provider';
import { ObservableModel } from 'src/app/utlities/observablemodel';

@Component({
    selector: 'app-payment-history',
    templateUrl: './payment-history.view.html',
    styleUrls: ['./payment-history.scss']
})
export class PaymentHistoryComponent implements OnInit {
    public paymentHistory$: Observable<any>;
    public types: any;
    public isNewPayment: boolean;
    public formGroup: FormGroup;

    constructor(private paymentDataProvider: PaymentDataProvider,
                private creditDataProvider: CreditDataProvider) {

    }

    ngOnInit() {
        this.types = this.creditDataProvider.getCache();
        this.paymentHistory$ = this.paymentDataProvider.getPayments();
        this.isNewPayment = false;

        const formBuilder = new FormBuilder();
        this.formGroup = formBuilder.group({
            'owner': new FormControl({ value: undefined, disabled: true }, Validators.required),
            'transactionType': new FormControl({ value: undefined, disabled: true }, Validators.required),
            'transactionMsg': new FormControl({ value: '', disabled: true }, Validators.required),
            'paymentType': new FormControl({ value: undefined, disabled: true }, Validators.required),
            'paymentDate': new FormControl({ value: undefined, disabled: true }, Validators.required),
            'paidAmount': new FormControl({ value: '', disabled: true }, Validators.required),
            'comment': new FormControl({ value: '', disabled: true })
        });
    }

    public onPaymentSelect(payment: any) {
        this.formGroup.patchValue({
            'owner': this.getOwner(payment.aptNumber),
            'transactionType': this.getTransactionType(payment.transactionType),
            'transactionMsg': payment.transactionMsg,
            'paymentType': this.getPaymentType(payment.paymentType),
            'paymentDate': payment.paymentDate,
            'paidAmount': payment.paidAmount,
            'comment': payment.comment
        });
    }

    private getOwner(aptNumber: string) {
        const owners$ = <ObservableModel<any[]>>this.types.owners;
        return owners$.value.find(t => t.number === aptNumber);
    }

    private getTransactionType(transType: string) {
        const tranTypes$ = <ObservableModel<any[]>>this.types.transactionTypes;
        return tranTypes$.value.find(t => t.type === transType);
    }

    private getPaymentType(payType: string) {
        const paymentTypes$ = <ObservableModel<any[]>>this.types.paymentTypes;
        return paymentTypes$.value.find(t => t.type === payType);
    }
}
