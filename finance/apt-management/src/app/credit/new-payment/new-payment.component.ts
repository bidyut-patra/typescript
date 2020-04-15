import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CreditDataProvider } from '../credit.provider';
import { PaymentDataProvider } from '../payment.provider';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
    selector: 'app-new-payment',
    templateUrl: './new-payment.view.html',
    styleUrls: ['./new-payment.scss']
})
export class NewPaymentComponent implements OnInit {
    public payment$: Observable<any>;
    public lists: any;
    public isNewPayment: boolean;
    public formGroup: FormGroup;

    constructor(private creditDataProvider: CreditDataProvider,
                private paymentDataProvider: PaymentDataProvider) {

    }

    ngOnInit() {
        this.lists = this.creditDataProvider.getCache();
        this.payment$ = this.paymentDataProvider.getNewPayment();
        this.isNewPayment = true;

        const formBuilder = new FormBuilder();
        this.formGroup = formBuilder.group({
            'owner': new FormControl({}, Validators.required),
            'transactionType': new FormControl({}, Validators.required),
            'transactionMsg': new FormControl('', Validators.required),
            'paymentType': new FormControl({}, Validators.required),
            'paymentDate': new FormControl(new Date().getDate(), Validators.required),
            'paidAmount': new FormControl('', Validators.required),
            'comment': new FormControl('')
        });

        this.initializeFormGroup();
    }

    private initializeFormGroup() {
        this.payment$.subscribe(result => {
            this.formGroup.patchValue({
                'owner': result
            });
        });
    }

    public onSave(payment: any) {
        if (this.formGroup.valid) {
            this.paymentDataProvider.savePayment({});
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

