import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { FinanceDataProvider } from '../finance.provider';
import { PaymentDataProvider } from '../payment.provider';
import { ITypes } from '../types';

@Component({
    selector: 'app-new-payment',
    templateUrl: './new-payment.view.html',
    styleUrls: ['./new-payment.scss']
})
export class NewPaymentComponent implements OnInit {
    public types: ITypes;
    public owner$: Observable<any>;
    public balance$: Observable<any>;

    public isNewPayment: boolean;
    public formGroup: FormGroup;

    constructor(private financeDataProvider: FinanceDataProvider,
                private paymentDataProvider: PaymentDataProvider) {

    }

    ngOnInit() {
        this.types = this.financeDataProvider.getTypes();
        this.owner$ = this.paymentDataProvider.getOwner();
        this.balance$ = this.paymentDataProvider.getBalance();
        this.isNewPayment = true;

        const formBuilder = new FormBuilder();
        this.formGroup = formBuilder.group({
            'owner': new FormControl({ value: undefined, disabled: false }, Validators.required),
            'transactionType': new FormControl({ value: undefined, disabled: false }, Validators.required),
            'transactionMsg': new FormControl({ value: '', disabled: false }, Validators.required),
            'paymentType': new FormControl({ value: undefined, disabled: false }, Validators.required),
            'paymentDate': new FormControl({ value: new Date(), disabled: false }, Validators.required),
            'paidAmount': new FormControl({ value: '', disabled: false }, Validators.required),
            'comment': new FormControl({ value: '', disabled: false })
        });

        this.initializeFormGroup();
    }

    private initializeFormGroup() {
        combineLatest([this.owner$, this.types.owners, this.types.paymentTypes, this.types.transactionTypes])
        .subscribe(result => {
            this.formGroup.patchValue({
                'owner': this.getOwner(result[0].number),
                'transactionType': this.getTransactionType('online'),
                'paymentType': this.getPaymentType('quarter')
            });
        });

        this.balance$.subscribe(result => {
            this.formGroup.patchValue({
                'paidAmount': result.totalDue
            });
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

    public onSave(payment: any) {
        if (this.formGroup.valid) {
            const date = new Date();
            this.paymentDataProvider.savePayment({
                aptNumber: this.formGroup.controls['owner'].value.number,
                owner: this.formGroup.controls['owner'].value.name,
                transactionType: this.formGroup.controls['transactionType'].value.type,
                transactionMsg: this.formGroup.controls['transactionMsg'].value,
                paymentType: this.formGroup.controls['paymentType'].value.type,
                paymentDate: this.formGroup.controls['paymentDate'].value,
                paidAmount: this.formGroup.controls['paidAmount'].value,
                comment: this.formGroup.controls['comment'].value,
                createdDate: date.toLocaleString()
            });
        }
    }

    public onOwnerChange(owner: any) {
        if (owner) {
            this.paymentDataProvider.getBalance(owner.number);
        }
    }

    private checkTransactionType(regexPattern: RegExp, propertyName: string): ValidatorFn {
        return (currentControl: AbstractControl): { [key: string]: any } => {
            if (!regexPattern.test(currentControl.value)) {
                return { propertyName: true };
            }
        };
    }
}

