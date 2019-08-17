import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[host-pane]'
})
export class HostPaneDirective {
    constructor(public viewContainerRef: ViewContainerRef) {

    }
}
