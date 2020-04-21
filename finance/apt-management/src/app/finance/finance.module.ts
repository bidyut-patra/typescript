import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FinanceComponent } from './finance.component';
import { FinanceRoutes } from './finance.routes';
import { NewPaymentComponent } from './new-payment/new-payment.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { FinanceDataProvider } from './finance.provider';
import { HttpClientModule } from '@angular/common/http';
import { PaymentDataProvider } from './payment.provider';

@NgModule({
    imports: [
        FinanceRoutes,
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule
    ],
    exports: [],
    declarations: [
        FinanceComponent,
        NewPaymentComponent,
        PaymentHistoryComponent,
        PaymentDetailsComponent
    ],
    providers: [
        FinanceDataProvider,
        PaymentDataProvider
    ]
})
export class FinanceModule {

}
