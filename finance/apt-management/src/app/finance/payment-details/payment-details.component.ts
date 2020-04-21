import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-payment-details',
    templateUrl: './payment-details.view.html',
    styleUrls: ['./payment-details.scss']
})
export class PaymentDetailsComponent implements OnInit, OnChanges {
    @Input('balance') balance: any;
    @Input('types') types: any;
    @Input('isNewPayment') isNewPayment: boolean;
    @Input('form') form: FormGroup;

    @ViewChild('transactionInput') transactionInput;

    // tslint:disable-next-line:no-output-on-prefix
    @Output('onSave') onSave: EventEmitter<any>;
    // tslint:disable-next-line:no-output-on-prefix
    @Output('onOwnerChange') onOwnerChange: EventEmitter<any>;

    public submitted: boolean;
    public nullValue: any;
    public payment: any;

    constructor() {
        this.onSave = new EventEmitter<any>();
        this.onOwnerChange = new EventEmitter<any>();
    }

    public get f() {
        return this.form.controls;
    }

    ngOnInit() {
        this.payment = {};
        this.payment.currentDate = new Date().toLocaleString();

        setInterval(() => {
            this.payment.currentDate = new Date().toLocaleString();
        }, 6000);

        this.nullValue = null;
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    public onResetClick() {
        this.submitted = false;
        this.form.reset();
    }

    public onSaveClick() {
        this.submitted = true;
        this.onSave.emit(this.payment);
    }

    public onOwnerSelect(owner: any) {
        this.onOwnerChange.emit(owner);
    }
}
