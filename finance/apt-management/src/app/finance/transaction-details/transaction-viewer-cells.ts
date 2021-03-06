import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { IGridCell, IEditableCell } from 'src/app/utlities/grid/grid-cell';

@Component({
    selector: 'app-transaction-date-cell',
    template: `<div>
                {{row[column.propertyName] | date: 'd-MMM-yyyy'}}
              </div>`
})
export class TransactionDateCellComponent implements IGridCell {
    @Input('row') row: any;
    @Input('column') column: any;

    constructor() {}
}

@Component({
    selector: 'app-transaction-check-cell',
    template: `<div>
                <input type="checkbox"/>
              </div>`
})
export class TransactionSelectCellComponent implements IGridCell {
    @Input('row') row: any;
    @Input('column') column: any;

    constructor() {}
}

@Component({
    selector: 'app-transaction-text-cell',
    template: `<div class="text-cell" (dblclick)="onEdit()">
                <div *ngIf="!edit && column.format" class="text-cell" [innerHtml]="column.format(row)"></div>
                <div *ngIf="!edit && !column.format" class="text-cell">{{row[column.propertyName]}}</div>
                <input #inp *ngIf="edit" type="text" class="text-cell"
                (blur)="onBlur()"
                (keyup)="onKeyUp($event)"
                [value]="row[column.propertyName]" />
              </div>`,
    styles: [
        `.text-cell { width: 100%; min-height: 50px; }`
    ]
})
export class TransactionTextCellComponent implements IGridCell, IEditableCell {
    @Input('row') row: any;
    @Input('column') column: any;

    @ViewChild('inp') inp: ElementRef;

    public edit: boolean;

    constructor() {
        this.edit = false;
    }

    public onEdit() {
        this.edit = true;
        setTimeout(() => this.inp.nativeElement.focus(), 0);
    }

    public onBlur() {
        this.edit = false;
    }

    public onKeyUp(e: KeyboardEvent) {
        const value = (<any>e.target).value;
        this.row[this.column.propertyName] = value;
    }
}
