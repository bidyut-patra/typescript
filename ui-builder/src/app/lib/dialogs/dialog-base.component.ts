import { Component, Input, OnInit, OnDestroy, AfterViewInit, ViewContainerRef,
         ComponentFactoryResolver, ElementRef, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-dialog',
    template: '<div><ng-template></ng-template></div>',
    styleUrls: ['./dialog-base.scss']
})
export class DialogBaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input('component') component;

    constructor(public viewContainerRef: ViewContainerRef,
                private compResolver: ComponentFactoryResolver,
                private elementRef: ElementRef,
                private ref: ChangeDetectorRef) {
    }

    ngOnInit() {}

    ngAfterViewInit() {
        this.createDialogComponent();
    }

    private createDialogComponent() {
        const compFactory = this.compResolver.resolveComponentFactory(this.component);
        const blkContainerRef = this.viewContainerRef;
        blkContainerRef.clear();
        const comp = blkContainerRef.createComponent(compFactory);
        this.ref.detectChanges();
    }

    ngOnDestroy() {}
}
