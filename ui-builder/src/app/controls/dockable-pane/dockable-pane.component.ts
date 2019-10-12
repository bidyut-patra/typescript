import { Component, OnDestroy, ViewChildren, ComponentFactoryResolver,
         Type, OnChanges, OnInit, SimpleChanges, Input, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { IDockedComponent } from './docked-component';
import { HostPaneDirective } from './host-pane.directive';
import { DockPosition } from './dock-position';

@Component({
    selector: 'app-dockable-pane',
    templateUrl: './dockable-pane.html',
    styleUrls: ['./dockable-pane.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DockablePaneComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
    // The host elements for the components
    @ViewChildren(HostPaneDirective) hostPanes: HostPaneDirective[];

    @Input('position') position: DockPosition;
    @Input('id') id: string;
    @Input('width') width: number;
    @Input('height') height: number;
    @Input('components') components: any[];

    // Keeps component types information
    public dockedComponents: Array<any>;
    public Positions = DockPosition;
    public title: string;
    public footer: string;

    constructor(private factoryResolver: ComponentFactoryResolver,
                private changeRef: ChangeDetectorRef) {
        this.dockedComponents = [];
    }

    /**
     * On Init
     */
    ngOnInit() {
        this.title = 'Pane Header';
        this.footer = 'Pane Footer';
    }

    /**
     * On changes
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges) {
        if (this.components && this.components.length > 0) {
            this.components.forEach(compTypeMetadata => {
                this.dockedComponents.push({
                    id: compTypeMetadata.id,
                    type: compTypeMetadata.type,
                    active: compTypeMetadata.active,
                    instance: undefined
                });
            });
        }
        if (this.width && this.height) {
            this.dockedComponents.forEach(dc => {
                if (dc.instance) {
                    this.setInstanceSize(dc.instance);
                }
            });
        }
    }

    /**
     * Create all the components
     */
    ngAfterViewInit() {
        if (this.hostPanes) {
            this.hostPanes.forEach((hostPane, index) => {
                const dockedComponent = this.dockedComponents[index];
                if (dockedComponent.instance === undefined) {
                    this.setComponent(dockedComponent, hostPane);
                }
            });
        }
    }

    public onChangePosition() {

    }

    public onHide() {

    }

    public onClose() {

    }

    /**
     * On component activated show it
     *
     * @param component
     */
    public onComponentActivated(component: IDockedComponent) {
        this.dockedComponents.forEach(comp => {
            if (comp.instance === component) {
                comp.active = true;
            } else {
                comp.active = false;
            }
            if (comp.active) {
                this.title = component.title;
            }
        });
    }

    /**
     * Creates the component
     *
     * @param dockedComponent
     * @param hostPane
     */
    private setComponent(dockedComponent: any, hostPane: HostPaneDirective) {
        const compType = dockedComponent.type as Type<IDockedComponent>;
        const componentFactory = this.factoryResolver.resolveComponentFactory(compType);
        const hostPaneContainerRef = hostPane.viewContainerRef;
        const component = hostPaneContainerRef.createComponent(componentFactory);
        component.instance.data = {};
        if (dockedComponent.active) {
            this.title = component.instance.title;
        }
        dockedComponent.instance = component.instance;
        if (component.instance.action) {
            component.instance.action.subscribe(event => {
                if (event.type === 'sizeChanged') {
                    // this.height = event.height;
                    // this.width = event.width;
                    //this.setInstanceSize(dockedComponent.instance);
                }
            });
        }
        this.setInstanceSize(dockedComponent.instance);
        this.changeRef.detectChanges();
    }

    private setInstanceSize(dockedCompInstance: any) {
        dockedCompInstance.height = this.height - 55;
        dockedCompInstance.width = this.width - 10;
    }

    /**
     * On destroy
     */
    public ngOnDestroy() {
        this.dockedComponents.splice(0, this.dockedComponents.length);
    }
}

