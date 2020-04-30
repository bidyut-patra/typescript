import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subject, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { PaymentDataProvider } from '../payment.provider';
import { FinanceDataProvider } from '../finance.provider';
import { ITypes } from '../types';
import { ObservableModel } from 'src/app/utlities/observablemodel';

@Component({
    selector: 'app-payment-history',
    templateUrl: './payment-history.view.html',
    styleUrls: ['./payment-history.scss']
})
export class PaymentHistoryComponent implements OnInit {
    public types: ITypes;
    public paymentHistory$: ObservableModel<any[]>;
    public isNewPayment: boolean;
    public formGroup: FormGroup;

    @ViewChild('searchField') searchField: ElementRef;

    private debounce: Subject<{}> = new Subject<{}>();

    constructor(private paymentDataProvider: PaymentDataProvider,
                private financeDataProvider: FinanceDataProvider) {

    }

    ngOnInit() {
        this.types = this.financeDataProvider.getTypes();
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

        fromEvent(this.searchField.nativeElement, 'keyup').pipe(
            map((event: any) => event.target.value),
            filter(res => res.length >= 3),
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(text => {
            this.paymentDataProvider.getPayments(text);
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
        const owners$ = this.types.owners;
        return owners$.value.find(t => t.number === aptNumber);
    }

    private getTransactionType(transType: string) {
        const tranTypes$ = this.types.transactionTypes;
        return tranTypes$.value.find(t => t.type === transType);
    }

    private getPaymentType(payType: string) {
        const paymentTypes$ = this.types.paymentTypes;
        return paymentTypes$.value.find(t => t.type === payType);
    }
}
