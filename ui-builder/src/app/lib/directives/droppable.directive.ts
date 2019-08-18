import { Directive, ElementRef, OnInit, Input, Type, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { GraphicsObject } from 'src/app/graphics-pallet/graphics-object';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[droppable]'
})
export class DroppableDirective implements OnInit {
    @Input() allowedTypes: Type<any>[];
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onDropped = new EventEmitter<any>();

    constructor(private element: ElementRef<HTMLElement>,
                private ref: ViewContainerRef) {

    }

    ngOnInit() {
        this.element.nativeElement.ondrop = this.OnDrop;
        this.element.nativeElement.ondragover = this.OnDragOver;
    }

    OnDrop(evt: DragEvent) {
        const txt = evt.dataTransfer.getData('text');
        //const data = JSON.parse(txt);
        //this.onDropped.emit({});
    }

    private OnDragOver(evt: DragEvent) {
        evt.preventDefault();
    }
}
