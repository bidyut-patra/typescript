import { Component, Input, ComponentFactoryResolver, ViewChild, OnInit,
         AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { GridDirective } from './grid.directive';

@Component({
    selector: 'app-grid-cell',
    template: `<div class="grid-cell grid-cell-text">
                <ng-template app-grid-host></ng-template>
              </div>`,
    styleUrls: ['./grid-cell.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridCellComponent implements OnInit, AfterViewInit {
    @Input('column') column;
    @Input('row') row;

    @ViewChild(GridDirective) gridHost: GridDirective;

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
                private changeDetectorRef: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.loadComponent();
    }

    ngAfterViewInit() {

    }

    private loadComponent() {
        if (this.gridHost) {
            const gridCellComponent = this.column.component;
            const factory = this.componentFactoryResolver.resolveComponentFactory<IGridCell>(gridCellComponent);
            const viewContainerRef = this.gridHost.viewContainerRef;
            if (viewContainerRef) {
                viewContainerRef.clear();
                const component = viewContainerRef.createComponent(factory);
                component.instance.column = this.column;
                component.instance.row = this.row;

                this.changeDetectorRef.detectChanges();
            }
        }
    }
}

export interface IGridCell {
    column: any;
    row: any;
}

export interface IEditableCell {
    edit: boolean;
}
