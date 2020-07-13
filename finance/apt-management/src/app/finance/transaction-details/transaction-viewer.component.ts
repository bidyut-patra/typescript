import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentDataProvider } from '../payment.provider';
import { DatePipe } from '@angular/common';

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

    constructor(public activeModal: NgbActiveModal,
                public datePipe: DatePipe,
                public paymentDataProvider: PaymentDataProvider) {
    }

    ngOnInit() {
        this.transactions$ = this.paymentDataProvider.getTransactions(this.files);
        this.cols = [
            {
                displayName: 'Select',
                propertyName: 'selected',
                width: 0.1,
                type: 'boolean'
            },
            {
                displayName: 'Apt Number',
                propertyName: 'aptNumber',
                width: 0.1,
                type: 'number',
                format: (row) => {
                    const conflict = <any[]>row['conflict'];
                    let aptNumber = <string>row['aptNumber'];
                    if (conflict && conflict.length) {
                        aptNumber = '<span class="highlight-conflict">' + conflict.join('/') + '</span>';
                    }
                    return aptNumber;
                }
            },
            {
                displayName: 'Amount',
                propertyName: 'paidAmount',
                width: 0.1,
                type: 'number'
            },
            {
                displayName: 'Type',
                propertyName: 'paymentType',
                width: 0.1,
                type: 'string'
            },
            {
                displayName: 'Payment Date',
                propertyName: 'paymentDate',
                width: 0.1,
                type: 'date',
                format: (row) => this.datePipe.transform(row['paymentDate'], 'dd-MMM-yyyy')
            },
            {
                displayName: 'Transaction Message',
                propertyName: 'transactionMsg',
                width: 0.25,
                type: 'string',
                format: (row) => this.formatCellWithFilterHighlighted(row, 'transactionMsg', 'transactionMsgFilter')
            },
            {
                displayName: 'Comment',
                propertyName: 'comment',
                width: 0.25,
                type: 'string',
                format: (row) => this.formatCellWithFilterHighlighted(row, 'comment', 'commentFilter')
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

    private formatCellWithFilterHighlighted(row: any, field: string, filterField: string) {
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

    private onSave() {
        this.saveTransactions$ = this.paymentDataProvider.saveTransactions();
        this.saveTransactions$.subscribe(r => {
            if (r.length > 0) {
                this.activeModal.close('Close click');
            }
        });
    }
}
