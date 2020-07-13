import { NgModule } from '@angular/core';
import { TransactionViewerComponent } from './transaction-viewer.component';
import { NgbModal, NgbModalModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { GridModule } from 'src/app/utlities/grid/grid.module';

@NgModule({
    imports: [
        NgbModalModule,
        CommonModule,
        GridModule],
    declarations: [TransactionViewerComponent],
    providers: [NgbModal, NgbActiveModal]
})
export class TransactionViewerModule {

}
