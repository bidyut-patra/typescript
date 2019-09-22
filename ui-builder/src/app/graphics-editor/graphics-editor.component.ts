import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ViewChildren, ElementRef,
         ChangeDetectorRef, ComponentFactoryResolver, Type, Input } from '@angular/core';
import { Http } from '@angular/http';
import { IDockedComponent } from '../controls/dockable-pane/docked-component';
import { GraphicsObject } from '../graphics-pallet/graphics-object';
import { GraphPoint } from './models/point';
import { GraphPort } from './models/port';
import { GraphNode } from './models/node';
import { EdgeViewModel } from './viewmodels/edgeviewmodel';
import { CommonEventHandler } from '../lib/misc/commonevent.handler';
import { ContextMenuInfo } from './viewmodels/contextmenuinfo';
import { ContextMenuDirective } from './contexr-menu.directive';
import { IContextMenuComponent } from './context-menu-component';
import { BlockContextMenuComponent } from './contextmenus/block-context-menu';
import { EdgeContextMenuComponent } from './contextmenus/edge-context-menu';
import { MemberContextMenuComponent } from './contextmenus/member-context-menu';
import { PortContextMenuComponent } from './contextmenus/port-context-menu';
import { GraphContextMenuComponent } from './contextmenus/graph-context-menu';
import { GraphViewModel } from './viewmodels/graphviewmodel';
import { NodeViewModel } from './viewmodels/nodeviewmodel';
import { PortViewModel } from './viewmodels/portviewmodel';
import { InOutPortViewModel } from './viewmodels/inoutportviewmodel';
import { BlockViewModel } from './viewmodels/blockviewmodel';

@Component({
    selector: 'app-graphics-editor',
    templateUrl: './graphics-editor.html',
    styleUrls: ['./graphics-editor.scss']
})
export class GraphicsEditorComponent implements IDockedComponent, OnInit, AfterViewInit, AfterViewChecked {
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

    public graphViewModel: GraphViewModel;
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
        this.graphViewModel = new GraphViewModel();
        this.contextMenu = new ContextMenuInfo();
    }

    ngOnInit() {
        this.http.get('assets/graphics-data/blocks.json').subscribe(response => {
            this.loadModels(response.json());
        });
    }

    private loadModels(blocks: any) {
        this.graphViewModel.loadNodes(blocks);
        // this.addEdge();
        this.ref.detectChanges();
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
            switch (eventData.action) {
                case 'paste':
                    this.handlePaste(eventData.content, eventData.location);
                    break;
                default:
                    break;
            }
        });
        this.ref.detectChanges();
    }

    private handlePaste(sourceData: any, location: GraphPoint) {
        switch (sourceData.sourceAction) {
            case 'blockCopy':
                const blockViewModel = sourceData.sourceDataContext as BlockViewModel;
                blockViewModel.DataContext.marginLeft = location.X;
                blockViewModel.DataContext.marginTop = location.Y;
                this.graphViewModel.createNode(blockViewModel.DataContext);
                break;
            default:
                break;
        }
    }

    private updateNodeSize() {
        if (this.blockView && (this.blockView.length > 0)) {
            const thisObj = this;
            this.blockView.forEach(bhv => {
                const blockElement = bhv.nativeElement as HTMLElement;
                const node = thisObj.graphViewModel.Nodes.find(n => n.Id === blockElement.id);
                if (node) {
                    node.updateSize(blockElement.clientWidth, blockElement.clientHeight);
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

    public onHeaderMouseDown(event: MouseEvent, node: NodeViewModel) {
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
                node.updateLocation(mme.clientX - 300, mme.clientY - 95);
                thisObj.ref.detectChanges();
            };
        }
    }

    public onBlockMouseUp(event: Event, node: GraphNode) {
        const editorElement: HTMLElement = this.editorView.nativeElement;
        editorElement.onmouseup = null;
        editorElement.onmousemove = null;
        this.graphViewModel.removeDrawingEdge();
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

    public onEditorRightClick(event: MouseEvent) {
        this.showContextMenu(GraphContextMenuComponent, 'Graph Context Menu', this.graphViewModel, event.clientX, event.clientY);
    }

    public onBlockRightClick(event: MouseEvent, nodeViewModel: NodeViewModel) {
        this.showContextMenu(BlockContextMenuComponent, 'Block Context Menu', nodeViewModel, event.clientX, event.clientY);
    }

    public onEdgeRightClick(event: MouseEvent, edgeViewModel: EdgeViewModel) {
        this.showContextMenu(EdgeContextMenuComponent, 'Edge Context Menu', edgeViewModel, event.clientX, event.clientY);
    }

    public onMemberRightClick(event: MouseEvent, inOutPortViewModel: InOutPortViewModel) {
        this.showContextMenu(MemberContextMenuComponent, 'Member Context Menu', inOutPortViewModel, event.clientX, event.clientY);
    }

    public onPortRightClick(event: MouseEvent, portViewModel: PortViewModel) {
        this.showContextMenu(PortContextMenuComponent, 'Port Context Menu', portViewModel, event.clientX, event.clientY);
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

    public onMouseDown(mde: MouseEvent, portViewModel: PortViewModel) {
        this.graphViewModel.setDrawingEdgeSourcePort(portViewModel);
        this.contextMenu.display = false;
        const thisObj = this;
        const editorElement: HTMLElement = this.editorView.nativeElement;
        editorElement.onmousemove = function(mme: MouseEvent) {
            thisObj.createOrUpdateDrawingEdge(mme);
        };

        editorElement.onmouseup = function(mme: MouseEvent) {
            const mouseLocation = thisObj.getGraphPoint(mme.clientX, mme.clientY);
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

    public OnEdgeLoad(event: Event, edgeViewModel: EdgeViewModel) {
        (event.srcElement as HTMLElement).focus();
    }

    public onSelectEdge(event: Event, edgeViewModel: EdgeViewModel) {
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

    public onUnselectEdge(event: KeyboardEvent, edgeViewModel: EdgeViewModel) {
        const ctrlKeyPressed = this.commonEventHandler.CtrlKeyPressed;
        if (ctrlKeyPressed === false) {
            const selectedEdgeViewModels = this.graphViewModel.Edges.filter(evm => evm.selected);
            selectedEdgeViewModels.forEach(selectedEdgeViewModel => {
                selectedEdgeViewModel.toggleEdgeSelection();
            });
        }
    }

    public onKeyDown(event: KeyboardEvent, edgeViewModel: EdgeViewModel) {
        if (event.keyCode === 46) {
            const selectedEdgeViewModels = this.graphViewModel.Edges.filter(evm => evm.selected);
            selectedEdgeViewModels.forEach(selectedEdgeViewModel => {
                this.graphViewModel.removeEdge(selectedEdgeViewModel);
            });
        }
    }

    private createOrUpdateDrawingEdge(event: MouseEvent) {
        if (this.detectLeftButton(event)) {
            const mouseLocation = this.getGraphPoint(event.clientX, event.clientY);
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
