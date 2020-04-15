import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-payment-details',
    templateUrl: './payment-details.view.html',
    styleUrls: ['./payment-details.scss']
})
export class PaymentDetailsComponent implements OnInit, OnChanges {
    @Input('payment') payment: any;
    @Input('lists') lists: any;
    @Input('isNewPayment') isNewPayment: boolean;
    @Input('form') form: FormGroup;

    // tslint:disable-next-line:no-output-on-prefix
    @Output('onSave') onSave: EventEmitter<any>;

    constructor() {
        this.onSave = new EventEmitter<any>();
    }

    public get f() {
        return this.form.controls;
    }

    ngOnInit() {
        setInterval(() => {
            this.payment.currentDate = new Date().toLocaleString();
        }, 6000);
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    public onOwnerChange() {

    }

    public onSaveClick() {
        this.onSave.emit(this.payment);
    }
}
