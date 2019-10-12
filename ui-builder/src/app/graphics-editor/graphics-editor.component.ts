import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ViewChildren, ElementRef,
         ChangeDetectorRef, ComponentFactoryResolver, Type, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Http } from '@angular/http';
import { Subject, Observable, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { IDockedComponent } from '../controls/dockable-pane/docked-component';
import { GraphicsObject } from '../graphics-pallet/graphics-object';
import { GraphPoint } from './models/point';
import { GraphPort } from './models/port';
import { EdgeViewModel } from './viewmodels/edgeviewmodel';
import { CommonEventHandler } from '../lib/misc/commonevent.handler';
import { ContextMenuInfo } from './viewmodels/contextmenuinfo';
import { ContextMenuDirective } from './context-menu.directive';
import { IContextMenuComponent } from './context-menu-component';
import { EdgeContextMenuComponent } from './contextmenus/edge-context-menu';
import { GraphContextMenuComponent } from './contextmenus/graph-context-menu';
import { GraphViewModel } from './viewmodels/graphviewmodel';
import { NodeViewModel } from './viewmodels/nodeviewmodel';
import { PortViewModel } from './viewmodels/portviewmodel';
import { IActionPayload, IContextMenuPayload } from './graph-node.component';
import { Clipboard } from 'src/app/lib/misc/clipboard';
import { ModelDataProvider } from './modeldataprovider';

@Component({
    selector: 'app-graphics-editor',
    templateUrl: './graphics-editor.html',
    styleUrls: ['./graphics-editor.scss'],
    providers: [ ModelDataProvider ]
})
export class GraphicsEditorComponent implements IDockedComponent, OnInit, OnChanges, AfterViewInit {
    @Input('width') width: number;
    @Input('height') height: number;

    @ViewChild('editorView') editorView: ElementRef;
    @ViewChildren('blockView') blockView: ElementRef[];
    @ViewChild('svgView') svgView: ElementRef;

    @ViewChild(ContextMenuDirective) ctxMenuDirective: ContextMenuDirective;

    private initialized = false;
    private canvasCtx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private svg: SVGElement;
    private commonEventHandler: CommonEventHandler;
    private onDebounceMouseMove = new Subject<{ x: number, y: number }>();

    public graphViewModel: GraphViewModel;
    public startPort: GraphPort;
    public endPort: GraphPort;
    public title = 'Graphics Editor';
    public footer = 'Draw Graphics';
    public active = true;
    public data = {};
    public contextMenu: ContextMenuInfo;
    public types = [ GraphicsObject ];
    public action: EventEmitter<any>;
    public svgWidth: number;
    public svgHeight: number;
    public svgMinWidth: number;
    public svgMinHeight: number;

    constructor(private compResolver: ComponentFactoryResolver,
                private ref: ChangeDetectorRef,
                private modelDataProvider: ModelDataProvider,
                private clipboard: Clipboard) {
        this.graphViewModel = new GraphViewModel();
        this.contextMenu = new ContextMenuInfo();
        this.action = new EventEmitter<any>();
    }

    ngOnInit() {
        const blocksObs = this.modelDataProvider.getBlocks();
        const connectionsObs = this.modelDataProvider.getConnections();

        forkJoin(blocksObs, connectionsObs).subscribe(data => {
            this.graphViewModel.loadNodes(data[0].json());
            this.ref.detectChanges();
            this.graphViewModel.loadEdges(data[1].json());
            this.ref.detectChanges();
        });
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    ngAfterViewInit() {
        this.commonEventHandler = new CommonEventHandler(this.editorView.nativeElement);
        this.commonEventHandler.initialize();
        this.svgWidth = this.width;
        this.svgHeight = this.height;
        this.svgMinWidth = this.width;
        this.svgMinHeight = this.height;

        this.updateSvgArea();

        // this.commonEventHandler.onMouseMove.subscribe(mouseLocation => {
        //     this.ref.detectChanges();
        //     this.onDebounceMouseMove.next(mouseLocation);
        // });

        // this.onDebounceMouseMove.pipe(debounceTime(100)).subscribe(mouseLocation => {
        //     this.ref.detectChanges();
        // });
    }

    private createContextMenu(contextMenu: Type<IContextMenuComponent>, data: any, location: GraphPoint) {
        const compFactory = this.compResolver.resolveComponentFactory(contextMenu);
        const ctxContainerRef = this.ctxMenuDirective.viewContainerRef;
        ctxContainerRef.clear();
        const comp = ctxContainerRef.createComponent(compFactory);
        comp.instance.content = data;
        comp.instance.location = location;
        // tslint:disable-next-line:no-shadowed-variable
        comp.instance.onSelect.subscribe(eventData => {
            switch (eventData.action) {
                case 'paste':
                    this.handlePaste(eventData.content, eventData.location);
                    break;
                default:
                    break;
            }
            this.ref.detectChanges();
        });
        this.ref.detectChanges();
    }

    public handleBlockAction(action: IActionPayload) {
        switch (action.type) {
            case 'contextMenu':
                const payload = action as IContextMenuPayload;
                this.showContextMenu(payload.component, payload.title, payload.context, payload.location.x, payload.location.y);
                break;
            case 'headerMouseDown':
                this.onHeaderMouseDown(<MouseEvent>action.event, action.context);
                break;
            case 'portMouseDown':
                this.onPortMouseDown(<MouseEvent>action.event, action.context);
                break;
            default:
                break;
        }
    }

    private handlePaste(copiedData: any[], location: GraphPoint) {
        for (let i = 0; i < copiedData.length; i++) {
            const sourceData = copiedData[i];
            switch (sourceData.sourceAction) {
                case 'blockCopy':
                    const blockViewModel = sourceData.sourceDataContext as NodeViewModel;
                    blockViewModel.DataContext.marginLeft = location.X;
                    blockViewModel.DataContext.marginTop = location.Y;
                    this.graphViewModel.createNode(blockViewModel.DataContext);
                    break;
                default:
                    break;
            }
        }
    }

    public onHeaderMouseDown(event: MouseEvent, node: NodeViewModel) {
        if (event.button === 0) {
            this.contextMenu.display = false;
            const thisObj = this;
            const editorElement: HTMLElement = this.editorView.nativeElement;
            const mouseDownPoint = thisObj.graphViewModel.getGraphPoint(event.clientX, event.clientY);
            const xOffset = mouseDownPoint.X - node.Location.X;
            const yOffset = mouseDownPoint.Y - node.Location.Y;

            editorElement.onmouseup = function(mue) {
                editorElement.onmouseup = null;
                editorElement.onmousemove = null;
                thisObj.graphViewModel.removeDrawingEdge();
            };

            editorElement.onmouseleave = function(mle) {
                editorElement.onmouseup = null;
                editorElement.onmousemove = null;
                thisObj.graphViewModel.removeDrawingEdge();
            };

            editorElement.onmousemove = function(mme) {
                const mouseLocation = thisObj.graphViewModel.getGraphPoint(mme.clientX, mme.clientY);
                const x = mouseLocation.X - xOffset;
                const y = mouseLocation.Y - yOffset;
                node.updateLocation(x, y);
                thisObj.updateSvgArea();
                thisObj.ref.detectChanges();
            };
        }
    }

    private updateSvgArea() {
        let maxHeight, maxWidth;
        this.graphViewModel.Nodes.forEach(node => {
            if ((maxWidth === undefined) || (maxWidth < node.Node.BottomRight.X)) {
                maxWidth = node.Node.BottomRight.X;
            }
            if ((maxHeight === undefined) || (maxHeight < node.Node.BottomRight.Y)) {
                maxHeight = node.Node.BottomRight.Y;
            }
        });
        this.svgHeight = maxHeight > this.svgMinHeight ? maxHeight + 20 : this.svgMinHeight;
        this.svgWidth = maxWidth > this.svgMinWidth ? maxWidth + 20 : this.svgMinWidth;
        this.ref.detectChanges();
    }

    public onPortMouseDown(mde: MouseEvent, portViewModel: PortViewModel) {
        this.graphViewModel.setDrawingEdgeSourcePort(portViewModel);
        this.contextMenu.display = false;
        const thisObj = this;
        const editorElement: HTMLElement = this.editorView.nativeElement;
        editorElement.onmousemove = function(mme: MouseEvent) {
            thisObj.createOrUpdateDrawingEdge(mme);
        };

        editorElement.onmouseup = function(mme: MouseEvent) {
            const mouseLocation = thisObj.graphViewModel.getGraphPoint(mme.clientX, mme.clientY);
            const nearestPort = thisObj.graphViewModel.getNearestPort(mouseLocation);
            if (nearestPort) {
                thisObj.graphViewModel.convertDrawingEdge(nearestPort);
            } else {
                thisObj.graphViewModel.removeDrawingEdge();
            }
            thisObj.ref.detectChanges();
        };

        this.ref.detectChanges();
    }

    public onDropped(event: any) {
        const droppedLocation = this.graphViewModel.getGraphPoint(event.x - 40, event.y);
        const modelData = this.modelDataProvider.getModel(event.data.type, droppedLocation.X, droppedLocation.Y);

        if (modelData) {
            this.graphViewModel.createNode(modelData);
        }
    }

    public showContextMenu(ctxMenuComponent: Type<IContextMenuComponent>, title: string, dataContext: any, x: number, y: number) {
        event.preventDefault();
        this.contextMenu.title = title;
        this.contextMenu.location = this.graphViewModel.getGraphPoint(x, y);
        this.contextMenu.display = true;
        this.createContextMenu(ctxMenuComponent, dataContext, this.contextMenu.location);
        event.stopPropagation();
    }

    public onEdgeRightClick(event: MouseEvent, edgeViewModel: EdgeViewModel) {
        this.showContextMenu(EdgeContextMenuComponent, 'Edge Context Menu', edgeViewModel, event.clientX, event.clientY);
        this.setEdgeSelection(edgeViewModel);
    }

    public onEdgeSelect(event: Event, edgeViewModel: EdgeViewModel) {
        this.setEdgeSelection(edgeViewModel);
        event.stopPropagation();
    }

    public onEdgeUnselect(event: KeyboardEvent, edgeViewModel: EdgeViewModel) {
        const ctrlKeyPressed = this.commonEventHandler.CtrlKeyPressed;
        if (ctrlKeyPressed === false) {
            const selectedEdgeViewModels = this.graphViewModel.Edges.filter(evm => evm.selected);
            selectedEdgeViewModels.forEach(selectedEdgeViewModel => {
                selectedEdgeViewModel.toggleEdgeSelection();
            });
        }
        event.stopPropagation();
    }

    public onEdgeKeyDown(event: KeyboardEvent, edgeViewModel: EdgeViewModel) {
        if (event.keyCode === 46) {
            const selectedEdgeViewModels = this.graphViewModel.Edges.filter(evm => evm.selected);
            selectedEdgeViewModels.forEach(selectedEdgeViewModel => {
                this.graphViewModel.removeEdge(selectedEdgeViewModel);
            });
        }
    }

    private setEdgeSelection(edgeViewModel: EdgeViewModel) {
        const ctrlKeyPressed = this.commonEventHandler.CtrlKeyPressed;
        if (ctrlKeyPressed) {
            edgeViewModel.toggleEdgeSelection();
        } else {
            const selectedEdgeViewModels = this.graphViewModel.Edges.filter(evm => evm.selected);
            selectedEdgeViewModels.forEach(selectedEdgeViewModel => {
                selectedEdgeViewModel.toggleEdgeSelection();
            });
            edgeViewModel.toggleEdgeSelection();
        }
    }

    public onEditorClick(event: MouseEvent) {
        this.contextMenu.display = false;
    }

    public onEditorRightClick(event: MouseEvent) {
        this.showContextMenu(GraphContextMenuComponent, 'Graph Context Menu', this.graphViewModel, event.clientX, event.clientY);
    }

    public onEditorMouseDown(event: MouseEvent) {

    }

    public onEditorKeyDown(event: KeyboardEvent) {
        const ctrlKeyPressed = this.commonEventHandler.CtrlKeyPressed;
        if (ctrlKeyPressed && (event.keyCode === 86)) {
            const content = this.clipboard.Read();
            const x = this.commonEventHandler.ClickedLocation.x;
            const y = this.commonEventHandler.ClickedLocation.y;
            const location = this.graphViewModel.getGraphPoint(x, y);
            this.handlePaste(content, location);
        }
    }

    private createOrUpdateDrawingEdge(event: MouseEvent) {
        if (this.detectLeftButton(event)) {
            const mouseLocation = this.graphViewModel.getGraphPoint(event.clientX, event.clientY);
            if (this.graphViewModel.DrawingEdge) {
                const neareastPort = this.graphViewModel.getNearestPort(mouseLocation);
                if (neareastPort) {
                    this.graphViewModel.DrawingEdge.updateTargetLocation(neareastPort.X, neareastPort.Y);
                } else {
                    this.graphViewModel.DrawingEdge.updateTargetLocation(mouseLocation.X, mouseLocation.Y);
                }
            } else {
                this.graphViewModel.createDrawingEdge(mouseLocation);
            }
        } else {
            this.graphViewModel.removeDrawingEdge();
        }
        this.ref.detectChanges();
    }

    private detectLeftButton(event: any) {
        if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
            return false;
        } else if ('buttons' in event) {
            return event.buttons === 1;
        } else if ('which' in event) {
            return event.which === 1;
        } else {
            return (event.button === 1 || event.type === 'click');
        }
    }
}
