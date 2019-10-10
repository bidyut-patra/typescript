import { Directive, ElementRef, OnInit, Input, Type, ViewContainerRef, Output, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { GraphicsObject } from 'src/app/graphics-pallet/graphics-object';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[droppable]'
})
export class DroppableDirective implements OnInit, AfterViewInit, OnDestroy {
    @Input() allowedTypes: Type<any>[];
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onDropped = new EventEmitter<any>();

    constructor(private element: ElementRef<HTMLElement>,
                private ref: ViewContainerRef) {

    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.element.nativeElement.ondrop = (evt: DragEvent) => {
            const jsonTxt = evt.dataTransfer.getData('text');
            const data = JSON.parse(jsonTxt);
            this.onDropped.emit({
                data: data,
                x: evt.x,
                y: evt.y
            });
        };
        this.element.nativeElement.ondragover = (evt: DragEvent) => {
            evt.preventDefault();
        };
    }

    ngOnDestroy() {
        this.element.nativeElement.ondrop = undefined;
        this.element.nativeElement.ondragover = undefined;
    }
}
