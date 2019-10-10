import { Directive, ElementRef, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[draggable]'
})
export class DraggableDirective implements OnInit, AfterViewInit, OnDestroy {
    @Input() data: any;

    constructor(private element: ElementRef<HTMLElement>) {

    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        const thisObj = this;
        this.element.nativeElement.draggable = true;
        this.element.nativeElement.ondragstart = (evt: DragEvent) => {
            evt.dataTransfer.setData('text', JSON.stringify(thisObj.data));
        };
        this.element.nativeElement.ondragover = (evt: DragEvent) => {
            evt.preventDefault();
        };
    }

    ngOnDestroy() {
        this.element.nativeElement.ondragstart = undefined;
        this.element.nativeElement.ondragover = undefined;
    }
}
