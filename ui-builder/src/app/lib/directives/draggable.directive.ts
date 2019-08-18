import { Directive, ElementRef, OnInit, Input } from '@angular/core';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[draggable]'
})
export class DraggableDirective implements OnInit {
    @Input() data: any;

    constructor(private element: ElementRef<HTMLElement>) {

    }

    ngOnInit() {
        this.element.nativeElement.draggable = true;
        this.element.nativeElement.ondragstart = this.OnDragStart;
        this.element.nativeElement.ondragover = this.OnDragOver;
    }

    private OnDragStart(evt: DragEvent) {
        evt.dataTransfer.setData('text', JSON.stringify(this.data));
    }

    private OnDragOver(evt: DragEvent) {
        evt.preventDefault();
    }
}
