import { Component, OnInit } from '@angular/core';
import { CreditDataProvider } from './credit.provider';

@Component({
    selector: 'app-credit',
    templateUrl: './credit.view.html',
    styleUrls: ['./credit.style.scss']
})
export class CreditComponent implements OnInit {
    public paymentHistory: any[];
    public paymentLinks: any[];
    public paymentDetails: any;
    public newPayment: any;
    public activeLinkId: string;

    constructor(private creditDataProvider: CreditDataProvider) {
        this.paymentHistory = [];
        this.paymentLinks = [];
    }

    ngOnInit() {
        this.paymentLinks = [
            {
                id: 'newPayment',
                label: 'New Payment'
            },
            {
                id: 'paymentHistory',
                label: 'Payment History'
            }
        ];
        this.activeLinkId = 'newPayment';

        this.creditDataProvider.loadCache(true);
    }

    /**
     * On clicking a link
     *
     * @param paymentLinkId
     */
    public onClick(paymentLinkId: string) {
        this.activeLinkId = paymentLinkId;
    }
}
