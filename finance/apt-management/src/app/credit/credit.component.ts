import { Component, OnInit } from '@angular/core';
import { CreditDataProvider } from './credit.provider';
import { AppSettings } from 'src/appsettings';

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

    constructor(private creditDataProvider: CreditDataProvider,
                private appSettings: AppSettings) {
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
            },
            {
                id: 'addResidents',
                label: 'Add Residents'
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

        if (this.activeLinkId === 'addResidents') {
            window.open('http://localhost:4300/admin?user=' + this.appSettings.UserToken, '_blank');
        }
    }
}
