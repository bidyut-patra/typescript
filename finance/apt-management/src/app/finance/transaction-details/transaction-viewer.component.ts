import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentDataProvider } from '../payment.provider';
import { DatePipe } from '@angular/common';
import { TransactionTextCellComponent, TransactionSelectCellComponent, TransactionDateCellComponent } from './transaction-viewer-cells';
import { TransactionErrorComponent } from './transaction-error.component';

@Component({
    selector: 'app-transaction-viewer',
    templateUrl: './transaction-viewer.html',
    styleUrls: ['./transaction-viewer.scss'],
    providers: [DatePipe],
    encapsulation: ViewEncapsulation.None
})
export class TransactionViewerComponent implements OnInit {
    @Input('files') files: any[];

    public transactions$: Observable<any[]>;
    public saveTransactions$: Observable<any[]>;

    public configurations: any = {};
    public cols: any[];

    constructor(public paymentDataProvider: PaymentDataProvider,
                public activeModal: NgbActiveModal,
                public modalService: NgbModal,
                public datePipe: DatePipe) {
    }

    ngOnInit() {
        this.transactions$ = this.paymentDataProvider.getTransactions(this.files);
        this.cols = [
            {
                displayName: 'Select',
                propertyName: 'selected',
                width: 0.1,
                type: 'boolean',
                component: TransactionSelectCellComponent
            },
            {
                displayName: 'Apt Number',
                propertyName: 'aptNumber',
                width: 0.1,
                type: 'number',
                component: TransactionTextCellComponent,
                format: (row) => {
                    const aptNumber = <number>row['aptNumber'];
                    if (aptNumber) {
                        if (this.paymentDataProvider.findApt(aptNumber)) {
                            return '<span class="missing-apt-no">' + aptNumber + '</span>';
                        } else {
                            return aptNumber;
                        }
                    } else {
                        return '<span class="missing-apt-no">-</span>';
                    }
                }
            },
            {
                displayName: 'Amount',
                propertyName: 'paidAmount',
                width: 0.1,
                type: 'number',
                component: TransactionTextCellComponent
            },
            {
                displayName: 'Type',
                propertyName: 'paymentType',
                width: 0.1,
                type: 'string',
                component: TransactionTextCellComponent
            },
            {
                displayName: 'Payment Date',
                propertyName: 'paymentDate',
                width: 0.1,
                type: 'date',
                component: TransactionDateCellComponent
            },
            {
                displayName: 'Transaction Message',
                propertyName: 'transactionMsg',
                width: 0.25,
                type: 'string',
                component: TransactionTextCellComponent,
                format: (row) => this.formatCell(row, 'transactionMsg', 'transactionMsgFilter')
            },
            {
                displayName: 'Comment',
                propertyName: 'comment',
                width: 0.25,
                type: 'string',
                component: TransactionTextCellComponent,
                format: (row) => this.formatCell(row, 'comment', 'commentFilter')
            }
        ];

        this.configurations = {
            selectSingleRow: true,
            selectMultipleRows: false,
            selectSingleCell: true,
            selectMultipleCells: false,
            selectSingleColumn: true,
            selectMultipleColumns: false
        };
    }

    private formatCell(row: any, field: string, filterField: string) {
        let cell = <string>row[field];
        const cellFilter = <string[]>row[filterField];
        if (cellFilter) {
            cellFilter.forEach(f => {
                if (f.indexOf('\\s+') > 0) {
                    const replacement = this.replaceString(f, '\\s+', ' ');
                    const span = '<span class="highlight-filter">' + replacement + '</span>';
                    cell = cell.replace(new RegExp(f), span);
                } else {
                    cell = cell.replace(f, '<span class="highlight-filter">' + f + '</span>');
                }
            });
        }
        return cell;
    }

    private replaceString(text: string, search: string, replacement: string) {
        while (text.indexOf(search) > 0) {
            text = text.replace(search, replacement);
        }
        return text;
    }

    public onSave() {
        const ownersIdentified = this.paymentDataProvider.areOwnersIdentified();
        const validOwnersIdentified = this.paymentDataProvider.areValidOwnersIdentified();
        const ownersUnique = this.paymentDataProvider.areOwnersUnique();
        if (ownersIdentified && validOwnersIdentified && ownersUnique) {
            this.saveTransactions$ = this.paymentDataProvider.saveTransactions();
            this.saveTransactions$.subscribe(r => {
                if (r.length > 0) {
                    this.activeModal.close('Close click');
                }
            });
        } else if (ownersIdentified === false) {
            this.showMessage('All the owners are not identified');
        } else if (validOwnersIdentified === false) {
            this.showMessage('Some of the owners identified are not valid');
        }  else if (ownersUnique === false) {
            this.showMessage('All the owners are not unique');
        } else {
            this.showMessage('Some of the owners are either not identified or invalid and also, not unque');
        }
    }

    private showMessage(message: string) {
        const compRef = this.modalService.open(TransactionErrorComponent);
        const compInstance = <TransactionErrorComponent>compRef.componentInstance;
        compInstance.message = message;
    }
}
