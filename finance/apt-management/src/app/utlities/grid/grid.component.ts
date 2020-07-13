import { Component, Input, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
declare var $: any;

@Component({
    selector: 'app-grid',
    templateUrl: './grid.html',
    styleUrls: ['./grid.scss']
})
export class GridComponent implements OnInit, AfterViewInit {
    @Input('columns') columns: any[];
    @Input('rows') rows: any[];
    @Input('config') config: any;

    @ViewChild('gridView') gridView: ElementRef;

    public gridState: any;

    constructor() {}

    ngOnInit() {
        if (this.gridView) {
            const totalColumnWidth = $(this.gridView.nativeElement).width();
            this.columns.forEach(column => {
                column.pixelWidth = totalColumnWidth * column.width + 'px';
            });
        }

        this.gridState = {
            selectedRows: [],
            selectedColumns: [],
            sortedColumn: {
                col: undefined,
                sortingDirection: 'DESC'
            },
            columnFilters: []
        };
    }

    ngAfterViewInit() {

    }

    public onRowClick(row: any) {
        this.clearSelectedColumns();
        const selectedRows = <any[]>this.gridState.selectedRows;
        if (this.config.selectMultipleRows) {
            if (selectedRows.indexOf(row) < 0) {
                selectedRows.push(row);
            }
        } else if (this.config.selectSingleRow) {
            this.clearSelectedRows();
            selectedRows.push(row);
        } else {

        }
    }

    private clearSelectedRows() {
        const selectedRows = <any[]>this.gridState.selectedRows;
        selectedRows.splice(0, selectedRows.length);
    }

    public onColumnClick(column: any) {
        this.clearSelectedRows();
        const selectedColumns = <any[]>this.gridState.selectedColumns;
        if (this.config.selectMultipleColumns) {
            if (selectedColumns.indexOf(column) < 0) {
                selectedColumns.push(column);
            }
        } else if (this.config.selectSingleColumn) {
            this.clearSelectedColumns();
            selectedColumns.push(column);
        } else {

        }
        this.sortColumn(column);
    }

    private clearSelectedColumns() {
        const selectedColumns = <any[]>this.gridState.selectedColumns;
        selectedColumns.splice(0, selectedColumns.length);
    }

    private sortColumn(column: any) {
        const sortedColumn = <any>this.gridState.sortedColumn;
        if (sortedColumn.col) {
            if (sortedColumn.col === column) {
                const sortDir = sortedColumn.sortingDirection;
                sortedColumn.sortingDirection = sortDir === 'DESC' ? 'ASC' : 'DESC';
            } else {
                sortedColumn.col = column;
                sortedColumn.sortingDirection = 'DESC';
            }
        } else {
            sortedColumn.col = column;
            sortedColumn.sortingDirection = 'DESC';
        }

        if (sortedColumn.col) {
            const colProperty = sortedColumn.col.propertyName;
            const colType = sortedColumn.col.type;
            const sortDir = sortedColumn.sortingDirection;
            this.rows.sort((r1, r2) => {
                let row1 = r1[colProperty];
                let row2 = r2[colProperty];

                if (colType === 'date') {
                    row1 = new Date(row1);
                    row2 = new Date(row2);
                }

                if (row1 > row2) {
                    return sortDir === 'DESC' ? 1 : -1;
                } else if (row1 < row2) {
                    return sortDir === 'ASC' ? 1 : -1;
                } else {
                    return 0;
                }
            });
        }
    }

    public isRowSelected(row: any) {
        const selectedRows = <any[]>this.gridState.selectedRows;
        return selectedRows.indexOf(row) >= 0;
    }

    public isColumnSelected(column: any) {
        const selectedColumns = <any[]>this.gridState.selectedColumns;
        return selectedColumns.indexOf(column) >= 0;
    }

    public isColumnSorted(column: any, sorDir: string) {
        const sortedColumn = <any>this.gridState.sortedColumn;
        return (sortedColumn.col === column) && (sortedColumn.sortingDirection === sorDir);
    }
}
