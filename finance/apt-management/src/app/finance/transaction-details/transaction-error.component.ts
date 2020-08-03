import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-transaction-error',
    templateUrl: './transaction-error.html',
    styleUrls: ['./transaction-error.scss']
})
export class TransactionErrorComponent implements OnInit, OnChanges {
    @Input('message') message: string;

    constructor(public activeModal: NgbActiveModal) {

    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {

    }
}
