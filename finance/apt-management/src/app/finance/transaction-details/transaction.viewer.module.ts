import { NgModule } from '@angular/core';
import { TransactionViewerComponent } from './transaction-viewer.component';
import { NgbModal, NgbModalModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { GridModule } from 'src/app/utlities/grid/grid.module';
import { TransactionTextCellComponent, TransactionDateCellComponent, TransactionSelectCellComponent } from './transaction-viewer-cells';
import { TransactionErrorComponent } from './transaction-error.component';

@NgModule({
    imports: [
        NgbModalModule,
        CommonModule,
        GridModule
    ],
    declarations: [
        TransactionViewerComponent,
        TransactionErrorComponent,
        TransactionTextCellComponent,
        TransactionDateCellComponent,
        TransactionSelectCellComponent
    ],
    providers: [NgbModal, NgbActiveModal],
    entryComponents: [
        TransactionTextCellComponent,
        TransactionDateCellComponent,
        TransactionSelectCellComponent
    ]
})
export class TransactionViewerModule {

}
