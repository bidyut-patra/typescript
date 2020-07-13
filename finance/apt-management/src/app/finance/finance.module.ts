import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FinanceRoutes } from './finance.routes';
import { FinanceComponent } from './finance.component';
import { FinanceDataProvider } from './finance.provider';
import { PaymentDataProvider } from './payment.provider';
import { NewPaymentComponent } from './new-payment/new-payment.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { TransactionsReader } from './transactions.reader';
import { TransactionViewerComponent } from './transaction-details/transaction-viewer.component';
import { TransactionViewerModule } from './transaction-details/transaction.viewer.module';

@NgModule({
    imports: [
        FinanceRoutes,
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        TransactionViewerModule
    ],
    exports: [],
    declarations: [
        FinanceComponent,
        NewPaymentComponent,
        PaymentHistoryComponent,
        PaymentDetailsComponent,
        TransactionDetailsComponent
    ],
    providers: [
        FinanceDataProvider,
        PaymentDataProvider,
        TransactionsReader
    ],
    entryComponents: [
        TransactionViewerComponent
    ]
})
export class FinanceModule {

}
