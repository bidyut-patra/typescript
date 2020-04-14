import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-payment-details',
    templateUrl: './payment-details.view.html',
    styleUrls: ['./payment-details.scss']
})
export class PaymentDetailsComponent implements OnInit {
    @Input('payment') payment: any;
    @Input('lists') lists: any;
    @Input('isNewPayment') isNewPayment: boolean;

    public owner: any;
    public tranType: any;
    public payType: any;
    public currentDate: string;

    constructor() {

    }

    ngOnInit() {
        this.payment.currentDate = new Date().toLocaleString();
        setInterval(() => {
            this.payment.currentDate = new Date().toLocaleString();
        }, 6000);
    }
}
