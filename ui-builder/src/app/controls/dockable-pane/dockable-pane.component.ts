import { Component, OnDestroy, ViewChildren, ComponentFactoryResolver,
         Type, AfterViewChecked, OnChanges, OnInit, SimpleChanges, Input, ChangeDetectorRef } from '@angular/core';
import { IDockedComponent } from './docked-component';
import { HostPaneDirective } from './host-pane.directive';
import { DockPosition } from './dock-position';

@Component({
    selector: 'app-dockable-pane',
    templateUrl: './dockable-pane.html',
    styleUrls: ['./dockable-pane.scss']
})
export class DockablePaneComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
    @Input('position') position: DockPosition;
    @Input('id') id: string;
    @Input('width') width: number;
    @Input('height') height: number;

    // The host elements for the components
    @ViewChildren('host-pane') hostPanes: HostPaneDirective[];

    // Keeps component types information
    private dockedComponents: Array<Type<IDockedComponent>>;
    public Positions = DockPosition;
    public title: string;

    constructor(private factoryResolver: ComponentFactoryResolver,
                private changeRef: ChangeDetectorRef) {
        this.dockedComponents = [];
    }

    ngOnInit() {
        this.title = 'Pane title';
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    ngAfterViewChecked() {

    }

    public onChangePosition() {

    }

    public OnHide() {

    }

    public onClose() {

    }

    public addComponent(component: Type<IDockedComponent>) {
        if (component != null) {
            this.dockedComponents.push(component);
        }
    }

    public activateComponent(cIndex: number) {
        if (cIndex >= 0) {
            this.setComponent(this.dockedComponents[cIndex], this.hostPanes[cIndex]);
        }
    }

    private setComponent(activeComp: Type<IDockedComponent>, hostPane: HostPaneDirective) {
        const componentFactory = this.factoryResolver.resolveComponentFactory(activeComp);
        const hostPaneContainerRef = hostPane.viewContainerRef;
        const component = hostPaneContainerRef.createComponent(componentFactory);
        component.instance.data = {};
        this.changeRef.detectChanges();
    }

    public removeComponent(component: Type<IDockedComponent>) {
        if (component != null) {
            const componentIndex = this.dockedComponents.indexOf(component);
            if (componentIndex >= 0) {
                this.dockedComponents.splice(componentIndex, 1);
            }
        }
    }

    public ngOnDestroy() {
        this.dockedComponents.splice(0, this.dockedComponents.length);
    }
}

