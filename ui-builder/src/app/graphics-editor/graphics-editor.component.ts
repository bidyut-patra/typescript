import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ViewChildren, ElementRef,
         ChangeDetectorRef, ComponentFactoryResolver, Type } from '@angular/core';
import { Http } from '@angular/http';
import { IDockedComponent } from '../controls/dockable-pane/docked-component';
import { GraphicsObject } from '../graphics-pallet/graphics-object';
import { Guid } from '../lib/misc/guid';
import { GraphPoint } from './models/point';
import { GraphPort } from './models/port';
import { GraphNode } from './models/node';
import { GraphBlock, PortSet } from './models/block';
import { EdgeViewModel } from './viewmodels/edgeviewmodel';
import { Graph } from './models/graph';
import { GraphSize } from './models/size';
import { CommonEventHandler } from '../lib/misc/commonevent.handler';
import { ContextMenuInfo } from './viewmodels/contextmenuinfo';
import { ContextMenuDirective } from './contexr-menu.directive';
import { IContextMenuComponent } from './context-menu-component';
import { GraphElement } from './models/element';
import { BlockContextMenuComponent } from './contextmenus/block-context-menu';
import { EdgeContextMenuComponent } from './contextmenus/edge-context-menu';
import { MemberContextMenuComponent } from './contextmenus/member-context-menu';
import { PortContextMenuComponent } from './contextmenus/port-context-menu';
import { GraphContextMenuComponent } from './contextmenus/graph-context-menu';

@Component({
    selector: 'app-graphics-editor',
    templateUrl: './graphics-editor.html',
    styleUrls: ['./graphics-editor.scss']
})
export class GraphicsEditorComponent implements IDockedComponent, OnInit, AfterViewInit, AfterViewChecked {
    @ViewChild('editorView') editorView: ElementRef;
    @ViewChildren('blockView') blockView: ElementRef[];
    @ViewChild('svgView') svgView: ElementRef;
    @ViewChild(ContextMenuDirective) ctxMenuDirective: ContextMenuDirective;

    private initialized = false;
    private canvasCtx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private svg: SVGElement;
    private commonEventHandler: CommonEventHandler;

    public graph: Graph;
    public nodes: GraphNode[];
    public edgeViewModels: EdgeViewModel[];
    public drawingEdgeViewModel: EdgeViewModel;
    public startPort: GraphPort;
    public endPort: GraphPort;
    public title = 'Graphics Editor';
    public footer = 'Draw Graphics';
    public active = true;
    public data = {};
    public allowedTypes = [GraphicsObject];
    public contextMenu: ContextMenuInfo;

    constructor(private compResolver: ComponentFactoryResolver,
                private ref: ChangeDetectorRef,
                private http: Http) {
        this.nodes = [];
        this.edgeViewModels = [];
        this.graph = new Graph();
        this.contextMenu = new ContextMenuInfo();
    }

    ngOnInit() {
        this.http.get('assets/graphics-data/blocks.json').subscribe(response => {
            this.loadModels(response.json());
        });
    }

    private loadModels(blocks: any) {
        blocks.forEach(b => {
            this.addNode(b);
        });
        this.addEdge();
        this.ref.detectChanges();
    }

    private addEdge() {
        const sourcePort = this.nodes[0].Ports[1];
        const targetPort = this.nodes[1].Ports[2];

        const edgeVm = new EdgeViewModel(this.graph);
        edgeVm.createEdge(sourcePort, targetPort);
        this.edgeViewModels.push(edgeVm);
    }

    private addNode(b: any) {
        const node = new GraphBlock(this.graph);
        node.Id = Guid.guid();
        node.DataContext = b;
        node.Location = new GraphPoint(b.marginLeft, b.marginTop);
        b.content.forEach(c => {
            if (c.type === 'member') {
                if (c.direction === 'InOut') {
                    const leftPort = new GraphPort(this.graph);
                    leftPort.Location = new GraphPoint(c.leftPort.xOffset, c.leftPort.yOffset);
                    leftPort.DataContext = c;
                    node.addPort(leftPort);

                    const rightPort = new GraphPort(this.graph);
                    rightPort.Location = new GraphPoint(c.rightPort.xOffset, c.rightPort.yOffset);
                    rightPort.DataContext = c;
                    node.addPort(rightPort);

                    const portSet = new PortSet();
                    portSet.DataContext = c;
                    portSet.LeftPort = leftPort;
                    portSet.RightPort = rightPort;

                    node.PortSetList.push(portSet);
                }
            }
        });
        this.nodes.push(node);
    }

    ngAfterViewInit() {
        this.createCanvasElements();
        this.commonEventHandler = new CommonEventHandler(this.editorView.nativeElement);
        this.commonEventHandler.initialize();
    }

    ngAfterViewChecked() {
        if (!this.initialized) {
            this.initializeSvg();
            this.initialized = true;
        }
        setTimeout(() => this.updateNodeSize(), 1000);
    }

    private initializeContextMenu(contextMenu: Type<IContextMenuComponent>, data: any, location: GraphPoint) {
        const compFactory = this.compResolver.resolveComponentFactory(contextMenu);
        const ctxContainerRef = this.ctxMenuDirective.viewContainerRef;
        ctxContainerRef.clear();
        const comp = ctxContainerRef.createComponent(compFactory);
        comp.instance.content = data;
        comp.instance.location = location;
        // tslint:disable-next-line:no-shadowed-variable
        comp.instance.onSelect.subscribe(eventData => {
            if (eventData.action === 'paste') {
                if (eventData.content.sourceAction === 'blockCopy') {
                    eventData.content.sourceDataContext.marginLeft = eventData.location.X;
                    eventData.content.sourceDataContext.marginTop = eventData.location.Y;
                    this.addNode(eventData.content.sourceDataContext);
                }
            }
        });
        this.ref.detectChanges();
    }

    private updateNodeSize() {
        if (this.blockView && (this.blockView.length > 0)) {
            const thisObj = this;
            this.blockView.forEach(bhv => {
                const blockElement = bhv.nativeElement as HTMLElement;
                const node = thisObj.nodes.find(n => n.Id === blockElement.id);
                if (node) {
                    node.Size = new GraphSize(blockElement.clientWidth, blockElement.clientHeight);
                }
            });
        }
    }

    private initializeSvg() {
        this.svg = this.svgView.nativeElement;
    }

    public onEditorClick(event: Event) {
        this.contextMenu.display = false;
    }

    public onHeaderMouseDown(event: MouseEvent, node: GraphNode) {
        if (event.button === 0) {
            this.contextMenu.display = false;
            const thisObj = this;
            const editorElement: HTMLElement = this.editorView.nativeElement;

            editorElement.onmouseup = function(mue) {
                editorElement.onmouseup = null;
                editorElement.onmousemove = null;
            };

            editorElement.onmouseleave = function(mle) {
                editorElement.onmouseup = null;
                editorElement.onmousemove = null;
            };

            editorElement.onmousemove = function(mme) {
                node.Location = new GraphPoint(mme.clientX - 300, mme.clientY - 95);
                thisObj.edgeViewModels.forEach(edgeViewModel => {
                    edgeViewModel.updateEdge();
                });
                thisObj.ref.detectChanges();
            };
        }
    }

    public onBlockMouseUp(event: Event, node: GraphNode) {
        const editorElement: HTMLElement = this.editorView.nativeElement;
        editorElement.onmouseup = null;
        editorElement.onmousemove = null;
        this.drawingEdgeViewModel = undefined;
    }

    private initializeCanvas() {
        this.canvas = document.querySelector('canvas');
        this.canvas.style.width = '500px';
        this.canvas.style.height = '500px';
        this.canvasCtx = this.canvas.getContext('2d');
        this.canvasCtx.scale(1, 1);
    }

    private createCanvasElements() {

        function drawRect(prevPos, pos, prevSize, size) {
            if (prevPos && prevSize) {
                this.canvasCtx.clearRect(prevPos, prevPos, prevSize, prevSize);
            }
            this.canvasCtx.fillStyle = 'green';
            this.canvasCtx.fillRect(pos, pos, size, size);
        }

        let previousSize;
        let previousPosition;
        let zoomIn = false;
        let zoomOut = true;

        function draw() {

            let size = 16;
            const factor = 1.2;
            const minSize = 16;
            const maxSize = 300;

            if (previousSize) {
                if (zoomIn) {
                    size = previousSize / factor;
                    zoomIn = size > minSize;
                    zoomOut = size <= minSize;
                }
                if (zoomOut) {
                    size = previousSize * factor;
                    zoomIn = size > maxSize;
                    zoomOut = size < maxSize;
                }
            }
            const position = 250 - Math.floor(size / 2);
            drawRect(previousPosition, position, previousSize, size);
            previousSize = size;
            previousPosition = position;
        }

        // setInterval(() => {
        //     draw();
        // }, 100);

        // canvasCtx.beginPath();
        // canvasCtx.arc(80, 20, 10, 10, 20, false);
        // canvasCtx.lineTo(80, 20);
        // canvasCtx.strokeStyle = 'lightblue';
        // canvasCtx.stroke();
    }

    public onDropped(graphObject: GraphicsObject) {
        alert(graphObject.type);
    }

    private getNearestPort(mouseLocation: GraphPoint, sourcePort: GraphPort): GraphPort {
        let nearestPort: GraphPort;
        let refMinDistance: number;
        const region = 50;
        for (let i = 0; (i < this.nodes.length) && !nearestPort; i++) {
            const node = this.nodes[i];
            if (sourcePort.Owner !== node) {
                for (let j = 0; (j < node.Ports.length); j++) {
                    const port = node.Ports[j];
                    const xPosDiff = Math.abs(port.Location.X - mouseLocation.X);
                    const yPosDiff = Math.abs(port.Location.Y - mouseLocation.Y);
                    const newDistance = xPosDiff + yPosDiff;
                    const nearestPortFound = newDistance < (region * 2);
                    if (nearestPortFound) {
                        if (refMinDistance === undefined) {
                            nearestPort = port;
                            refMinDistance = newDistance;
                        } else if (refMinDistance > newDistance) {
                            nearestPort = port;
                            refMinDistance = newDistance;
                        } else {
                            // No change in nearest port
                        }
                    }
                }
            }
        }
        return nearestPort;
    }

    public onEditorRightClick(event: MouseEvent) {
        this.showContextMenu(GraphContextMenuComponent, 'Graph Context Menu', this.graph.DataContext, event.clientX, event.clientY);
    }

    public onBlockRightClick(event: MouseEvent, node: GraphNode) {
        this.showContextMenu(BlockContextMenuComponent, 'Block Context Menu', node.DataContext, event.clientX, event.clientY);
    }

    public onEdgeRightClick(event: MouseEvent, edge: EdgeViewModel) {
        this.showContextMenu(EdgeContextMenuComponent, 'Edge Context Menu', edge.edge, event.clientX, event.clientY);
    }

    public onMemberRightClick(event: MouseEvent, portSet: PortSet) {
        this.showContextMenu(MemberContextMenuComponent, 'Member Context Menu', portSet.DataContext, event.clientX, event.clientY);
    }

    public onPortRightClick(event: MouseEvent, port: GraphPort) {
        this.showContextMenu(PortContextMenuComponent, 'Port Context Menu', port.DataContext, event.clientX, event.clientY);
    }

    private showContextMenu(ctxMenuComponent: Type<IContextMenuComponent>, title: string, dataContext: any, x: number, y: number) {
        event.preventDefault();
        this.contextMenu.title = title;
        this.contextMenu.location = this.getGraphPoint(x, y);
        this.contextMenu.display = true;
        this.initializeContextMenu(ctxMenuComponent, dataContext, this.contextMenu.location);
        event.stopPropagation();
    }

    private getGraphPoint(clientX: number, clientY: number) {
        const x = this.getMouseXPos(clientX);
        const y = this.getMouseYPos(clientY);
        return new GraphPoint(x, y);
    }

    private getMouseXPos(clientX: number): number {
        return clientX - 245;
    }

    private getMouseYPos(clientY: number): number {
        return clientY - 63;
    }

    public onMouseDown(mde: MouseEvent, port: GraphPort) {
        this.startPort = port;
        this.contextMenu.display = false;
        const thisObj = this;
        const editorElement: HTMLElement = this.editorView.nativeElement;
        editorElement.onmousemove = function(mme: MouseEvent) {
            thisObj.createOrUpdateDrawingEdge(mme);
        };

        editorElement.onmouseup = function(mme: MouseEvent) {
            const mouseLocation = thisObj.getGraphPoint(mme.clientX, mme.clientY);
            const nearestPort = thisObj.getNearestPort(mouseLocation, thisObj.drawingEdgeViewModel.edge.Source);
            if (nearestPort) {
                thisObj.drawEdge(nearestPort);
            } else {
                thisObj.removeDrawingEdge();
            }
        };

        this.ref.detectChanges();
    }

    public onMouseUp(mue: MouseEvent, port: GraphPort) {
        this.drawEdge(port);
    }

    private drawEdge(port: GraphPort) {
        this.endPort = port;

        if ((this.startPort === this.endPort) ||
            (this.endPort.Owner === undefined)) {
            this.drawingEdgeViewModel = undefined;
        }

        // check if a line is connected between ports
        if (this.startPort && this.endPort &&
            this.startPort.CanConnect(this.endPort)) {
            // add a line with routing
            const edgeViewModel = new EdgeViewModel(this.graph);
            edgeViewModel.createEdge(this.startPort, this.endPort);
            this.edgeViewModels.push(edgeViewModel);
            this.drawingEdgeViewModel = undefined;
        }

        this.ref.detectChanges();
    }

    public OnEdgeLoad(event: Event, edgeViewModel: EdgeViewModel) {
        (event.srcElement as HTMLElement).focus();
    }

    public onSelectEdge(event: Event, edgeViewModel: EdgeViewModel) {
        const ctrlKeyPressed = this.commonEventHandler.CtrlKeyPressed;
        if (ctrlKeyPressed) {
            edgeViewModel.toggleEdgeSelection();
        } else {
            const selectedEdgeViewModels = this.edgeViewModels.filter(evm => evm.selected);
            selectedEdgeViewModels.forEach(selectedEdgeViewModel => {
                selectedEdgeViewModel.toggleEdgeSelection();
            });
            edgeViewModel.toggleEdgeSelection();
        }
    }

    public onUnselectEdge(event: KeyboardEvent, edgeViewModel: EdgeViewModel) {
        const ctrlKeyPressed = this.commonEventHandler.CtrlKeyPressed;
        if (ctrlKeyPressed === false) {
            const selectedEdgeViewModels = this.edgeViewModels.filter(evm => evm.selected);
            selectedEdgeViewModels.forEach(selectedEdgeViewModel => {
                selectedEdgeViewModel.toggleEdgeSelection();
            });
        }
    }

    public onKeyDown(event: KeyboardEvent, edgeViewModel: EdgeViewModel) {
        if (event.keyCode === 46) {
            const selectedEdgeViewModels = this.edgeViewModels.filter(evm => evm.selected);
            selectedEdgeViewModels.forEach(selectedEdgeViewModel => {
                const edgeIndex = this.edgeViewModels.findIndex(evm => evm === selectedEdgeViewModel);
                if (edgeIndex >= 0) {
                    selectedEdgeViewModel.removeEdge();
                    this.edgeViewModels.splice(edgeIndex, 1);
                }
            });
        }
    }

    private createOrUpdateDrawingEdge(event: MouseEvent) {
        if (this.startPort && this.detectLeftButton(event)) {
            const locationOfTargetPort = this.getGraphPoint(event.clientX, event.clientY);
            if (this.drawingEdgeViewModel) {
                const mouseLocation = this.getGraphPoint(event.clientX, event.clientY);
                const neareastPort = this.getNearestPort(mouseLocation, this.drawingEdgeViewModel.edge.Source);
                if (neareastPort) {
                    this.drawingEdgeViewModel.edge.Target.Location = neareastPort.Location;
                    this.drawingEdgeViewModel.updateEdge();
                } else {
                    this.drawingEdgeViewModel.edge.Target.Location = locationOfTargetPort;
                    this.drawingEdgeViewModel.updateEdge();
                }
            } else {
                this.endPort = new GraphPort(this.graph);
                this.endPort.Location = locationOfTargetPort;
                this.drawingEdgeViewModel = new EdgeViewModel(this.graph);
                this.drawingEdgeViewModel.createEdge(this.startPort, this.endPort);
            }
        } else {
            this.drawingEdgeViewModel = undefined;
        }
        this.ref.detectChanges();
    }

    private removeDrawingEdge() {
        this.startPort = undefined;
        this.endPort = undefined;
        this.drawingEdgeViewModel = undefined;
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

    private drawLine(x1: number, y1: number, x2: number, y2: number) {
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasCtx.lineWidth = 1;
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(x1, y1);
        this.canvasCtx.lineTo(x2, y2);
        this.canvasCtx.strokeStyle = '#FF0000';
        this.canvasCtx.stroke();
    }
}
