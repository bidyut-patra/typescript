import { Component, OnInit } from '@angular/core';
import { FinanceDataProvider } from './finance.provider';
import { AppSettings } from 'src/appsettings';

@Component({
    selector: 'app-finance',
    templateUrl: './finance.view.html',
    styleUrls: ['./finance.style.scss']
})
export class FinanceComponent implements OnInit {
    public paymentHistory: any[];
    public paymentLinks: any[];
    public paymentDetails: any;
    public newPayment: any;
    public activeLinkId: string;

    constructor(private financeDataProvider: FinanceDataProvider,
                private appSettings: AppSettings) {
        this.paymentHistory = [];
        this.paymentLinks = [];
    }

    ngOnInit() {

        if (this.appSettings.IsAdmin) {
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
                    id: 'paymentReport',
                    label: 'Payment Report'
                },
                {
                    id: 'newExpense',
                    label: 'New Expense'
                },
                {
                    id: 'expenseHistory',
                    label: 'Expense History'
                },
                {
                    id: 'expenseReport',
                    label: 'Expense Report'
                },
                {
                    id: 'addResident',
                    label: 'Add Resident'
                }
            ];
        } else {
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
        }

        this.activeLinkId = 'newPayment';
        this.financeDataProvider.loadTypes(true);
    }

    /**
     * On clicking a link
     *
     * @param paymentLinkId
     */
    public onClick(paymentLinkId: string) {
        this.activeLinkId = paymentLinkId;

        if (this.activeLinkId === 'addResident') {
            window.open('http://localhost:4300/admin?user=' + this.appSettings.UserToken, '_blank');
        }
    }
}
