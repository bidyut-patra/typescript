import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[app-grid-host]'
})
export class GridDirective {
    constructor(public viewContainerRef: ViewContainerRef) {

    }
}
