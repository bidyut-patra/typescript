import { Directive, ViewContainerRef, Input, AfterViewInit, EventEmitter,
         ComponentFactoryResolver, Type, ChangeDetectorRef, Output, ElementRef } from '@angular/core';
import { IGraphNodeComponent, IActionPayload } from './graph-node.component';
import { BlockComponent } from './blocks/block.component';
import { NodeViewModel } from './viewmodels/nodeviewmodel';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[graph-node]'
})
export class GraphNodeDirective implements AfterViewInit {
    @Input('index') index: number;
    @Input('data') data: NodeViewModel;
    @Input('component') component: Type<IGraphNodeComponent>;
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onAction: EventEmitter<IActionPayload>;

    constructor(public viewContainerRef: ViewContainerRef,
                private compResolver: ComponentFactoryResolver,
                private elementRef: ElementRef,
                private ref: ChangeDetectorRef) {
        this.onAction = new EventEmitter<IActionPayload>();
    }

    ngAfterViewInit() {
        this.createGraphicsBlock();
        const outerBlock = this.elementRef.nativeElement as HTMLElement;
        if (outerBlock && outerBlock.nextSibling && outerBlock.nextSibling.lastChild) {
            const innerBlock = outerBlock.nextSibling.lastChild as HTMLElement;
            this.data.updateSize(innerBlock.clientWidth, innerBlock.clientHeight);
        }
    }

    private createGraphicsBlock() {
        const compFactory = this.compResolver.resolveComponentFactory(this.component);
        const blkContainerRef = this.viewContainerRef;
        blkContainerRef.clear();
        const comp = blkContainerRef.createComponent(compFactory);
        comp.instance.data = this.data;
        comp.instance.tabIndex = this.index;
        comp.instance.onAction.subscribe(action  => {
            this.onAction.emit(action);
        });
        this.ref.detectChanges();
    }
}
