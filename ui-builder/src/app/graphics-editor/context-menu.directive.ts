import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[context-menu]'
})
export class ContextMenuDirective {
    constructor(public viewContainerRef: ViewContainerRef) {

    }
}
