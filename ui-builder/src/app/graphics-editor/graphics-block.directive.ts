import { Directive, ViewContainerRef, Input } from '@angular/core';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[graphics-block]'
})
export class GraphicsBlockDirective {
    @Input('index') index: number;

    constructor(public viewContainerRef: ViewContainerRef) {

    }
}
