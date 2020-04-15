import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CreditComponent } from './credit.component';
import { CreditRoutes } from './credit.routes';
import { NewPaymentComponent } from './new-payment/new-payment.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { CreditDataProvider } from './credit.provider';
import { HttpClientModule } from '@angular/common/http';
import { PaymentDataProvider } from './payment.provider';

@NgModule({
    imports: [
        CreditRoutes,
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule
    ],
    exports: [],
    declarations: [
        CreditComponent,
        NewPaymentComponent,
        PaymentHistoryComponent,
        PaymentDetailsComponent
    ],
    providers: [
        CreditDataProvider,
        PaymentDataProvider
    ]
})
export class CreditModule {

}
