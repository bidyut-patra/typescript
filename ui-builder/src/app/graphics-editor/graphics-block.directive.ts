import { Directive, ViewContainerRef, Input, AfterViewInit, EventEmitter,
         ComponentFactoryResolver, Type, ChangeDetectorRef, Output } from '@angular/core';
import { IGraphicsBlockComponent, IActionPayload } from './graphics-block-component';
import { BlockComponent } from './blocks/block.component';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[graphics-block]'
})
export class GraphicsBlockDirective implements AfterViewInit {
    @Input('index') index: number;
    @Input('data') data: any;
    @Input('component') component: Type<IGraphicsBlockComponent>;
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onAction: EventEmitter<IActionPayload>;

    constructor(public viewContainerRef: ViewContainerRef,
                private compResolver: ComponentFactoryResolver,
                private ref: ChangeDetectorRef) {
        this.onAction = new EventEmitter<IActionPayload>();
    }

    ngAfterViewInit() {
        this.createGraphicsBlock();
    }

    private createGraphicsBlock() {
        this.component = BlockComponent;
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
