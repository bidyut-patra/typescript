import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ViewChildren, ElementRef,
         ChangeDetectorRef, ComponentFactoryResolver, Type, Input } from '@angular/core';
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

@Component({
    selector: 'app-graphics-editor',
    templateUrl: './graphics-editor.html',
    styleUrls: ['./graphics-editor.scss']
})
export class GraphicsEditorComponent implements IDockedComponent, OnInit, AfterViewInit {
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

    constructor(private compResolver: ComponentFactoryResolver,
                private ref: ChangeDetectorRef,
                private http: Http,
                private clipboard: Clipboard) {
        this.graphViewModel = new GraphViewModel();
        this.contextMenu = new ContextMenuInfo();
    }

    ngOnInit() {
        const blocksObs = this.http.get('assets/graphics-data/blocks.json');
        const connectionsObs = this.http.get('assets/graphics-data/connections.json');

        forkJoin(blocksObs, connectionsObs).subscribe(data => {
            this.graphViewModel.loadNodes(data[0].json());
            this.ref.detectChanges();
            this.graphViewModel.loadEdges(data[1].json());
            this.ref.detectChanges();
        });
    }

    ngAfterViewInit() {
        this.commonEventHandler = new CommonEventHandler(this.editorView.nativeElement);
        this.commonEventHandler.initialize();
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
                thisObj.ref.detectChanges();
            };
        }
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
        let modelData;
        const droppedLocation = this.graphViewModel.getGraphPoint(event.x, event.y);
        switch (event.data.type) {
            case '2ioblock':
                modelData = this.getIOBlockModelData(event.data.type, droppedLocation.X, droppedLocation.Y);
                break;
            case '3ioblock':
                modelData = this.getIOBlockModelData(event.data.type, droppedLocation.X, droppedLocation.Y);
                break;
            default:
                break;
        }

        if (modelData) {
            this.graphViewModel.createNode(modelData);
        }
    }

    private getIOBlockModelData(blockType: string, x: number, y: number) {
        const content = [];
        const ioCounts = (blockType === '2ioblock') ? 2 : (blockType === '3ioblock' ? 3 : 0);
        if (ioCounts > 0) {
            let yFactor = 0;
            for (let i = 1; i <= ioCounts; i++) {
                content.push({
                    label: 'Input Output' + i,
                    type: 'member',
                    direction: 'InOut',
                    leftPort: {
                        id: 'lp' + i,
                        xOffset: 12,
                        yOffset: 64.5 + yFactor
                    },
                    rightPort: {
                        id: 'rp' + i,
                        xOffset: 212,
                        yOffset: 64.5 + yFactor
                    }
                });
                yFactor += 43;
            }
        }

        return {
            type: blockType,
            marginLeft: x,
            marginTop: y,
            header: blockType,
            content: content
        };
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
