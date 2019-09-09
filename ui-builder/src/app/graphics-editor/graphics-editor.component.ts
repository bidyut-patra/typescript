import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ViewChildren, ElementRef, ChangeDetectorRef } from '@angular/core';
import { IDockedComponent } from '../controls/dockable-pane/docked-component';
import { GraphicsObject } from '../graphics-pallet/graphics-object';
import { Guid } from '../lib/misc/guid';
import { GraphEdge } from './models/edge';
import { GraphPoint } from './models/point';
import { GraphPort } from './models/port';
import { GraphNode } from './models/node';
import { GraphBlock, PortSet } from './models/block';
import { EdgeViewModel } from './viewmodels/edgeviewmodel';
import { Graph } from './models/graph';

@Component({
    selector: 'app-graphics-editor',
    templateUrl: './graphics-editor.html',
    styleUrls: ['./graphics-editor.scss']
})
export class GraphicsEditorComponent implements IDockedComponent, OnInit, AfterViewInit, AfterViewChecked {
    @ViewChildren('blockHeaderView') blockHeaderView: ElementRef[];
    @ViewChildren('blockView') blockView: ElementRef[];
    @ViewChild('editorView') editorView: ElementRef;
    @ViewChild('svgView') svgView: ElementRef;

    private initialized = true;
    private canvasCtx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private svg: SVGElement;

    public graph: Graph;
    public nodes: GraphNode[];
    public edgeViewModels: EdgeViewModel[];
    public startPort: GraphPort;
    public endPort: GraphPort;
    public arrowPoints: string;
    public showLine = false;
    public title = 'Graphics Editor';
    public footer = 'Draw Graphics';
    public active = true;
    public data = {};
    public allowedTypes = [GraphicsObject];
    public blocks = [
        {
            id: Guid.guid(),
            marginLeft: 20,
            marginTop: 20,
            header: 'Hello World',
            content: [
                {
                    label: 'Y Input Output',
                    type: 'member',
                    direction: 'InOut',
                    leftPort: {
                        xOffset: 12,
                        yOffset: 65
                    },
                    rightPort: {
                        xOffset: 212,
                        yOffset: 65
                    }
                },
                {
                    label: 'Test Web Graphics',
                    type: 'complex',
                    childs: [
                        {
                            type: 'compartment',
                            childs: [
                                {
                                    label: 'dfjdsjfjdsjfdsf',
                                    type: 'member',
                                    direction: 'InOut',
                                    data: {

                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'compartment',
                    childs: [
                        {
                            label: 'nfndsjfdsjfkjdsfkjdsjfkjds',
                            type: 'member',
                            direction: 'In',
                            data: {

                            }
                        },
                        {
                            label: 'fdkjfdsfdskjfdskjk',
                            type: 'member',
                            direction: 'Out',
                            data: {

                            }
                        }
                    ]
                }
            ]
        },
        {
            id: Guid.guid(),
            marginLeft: 400,
            marginTop: 30,
            header: 'Web Graphics',
            content: [
                {
                    label: 'X Input Output',
                    type: 'member',
                    direction: 'InOut',
                    leftPort: {
                        xOffset: 12,
                        yOffset: 65
                    },
                    rightPort: {
                        xOffset: 212,
                        yOffset: 65
                    }
                },
                {
                    label: 'Hello',
                    type: 'complex',
                    childs: [
                        {
                            type: 'compartment',
                            childs: [
                                {
                                    label: 'dfjdsfsd',
                                    type: 'member',
                                    direction: 'InOut',
                                    data: {

                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'compartment',
                    childs: [
                        {
                            label: 'OnOffDevice',
                            type: 'member',
                            direction: 'In',
                            data: {

                            }
                        },
                        {
                            label: 'Interlock',
                            type: 'member',
                            direction: 'Out',
                            data: {

                            }
                        }
                    ]
                }
            ]
        }
    ];

    constructor(private ref: ChangeDetectorRef) {
        this.nodes = [];
        this.edgeViewModels = [];
        this.graph = new Graph();
    }

    ngOnInit() {
        this.blocks.forEach(b => {
            const node = new GraphBlock(this.graph);
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
        });
    }

    ngAfterViewInit() {
        this.createCanvasElements();
    }

    ngAfterViewChecked() {
        if (this.initialized) {
            this.initializeSvg();
            this.initializeSvgLineDrawing();
            this.enableBlockDragging();
            this.initialized = false;
        }
    }

    private initializeSvg() {
        this.svg = this.svgView.nativeElement;
    }

    private enableBlockDragging() {
        const thisObj = this;
        if (this.blockHeaderView && (this.blockHeaderView.length > 0) && this.blockView && (this.blockView.length > 0)) {
            const editorElement: HTMLElement = this.editorView.nativeElement;

            this.blockHeaderView.forEach((bhV, i) => {
                const blockHeaderElement: HTMLElement = bhV.nativeElement;
                const node = this.nodes[i];

                blockHeaderElement.onmousedown = function(mde) {

                    editorElement.onmousemove = function(mme) {
                        node.Location = new GraphPoint(mme.clientX - 300, mme.clientY - 95);
                        thisObj.edgeViewModels.forEach(edgeViewModel => {
                            edgeViewModel.updateEdge();
                        });
                    };

                    editorElement.onmouseup = function(mue) {
                        editorElement.onmouseup = null;
                        editorElement.onmousemove = null;
                    };

                    editorElement.onmouseleave = function(mle) {
                        editorElement.onmouseup = null;
                        editorElement.onmousemove = null;
                    };
                };
            });
        }
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

    public onMouseDown(mde: MouseEvent, port: GraphPort) {
        this.startPort = port;
        this.showLine = false;
        this.ref.detectChanges();
    }

    public onMouseUp(mue: MouseEvent, port: GraphPort) {
        this.endPort = port;
        // check if a line is connected between ports
        if (this.startPort && this.endPort &&
            this.startPort.CanConnect(this.endPort) &&
            !this.startPort.IsConnectedTo(this.endPort)) {
            // add a line with routing
            const edgeViewModel = new EdgeViewModel(this.graph);
            edgeViewModel.drawEdge(this.startPort, this.endPort);
            this.edgeViewModels.push(edgeViewModel);
            this.showLine = false;
        }
        this.ref.detectChanges();
    }

    public OnEdgeLoad(event: Event, edgeViewModel) {
        (event.srcElement as HTMLElement).focus();
    }

    public onSelectEdge(edgeViewModel: EdgeViewModel) {
        edgeViewModel.selectEdge();
    }

    public onUnselectEdge(edgeViewModel: EdgeViewModel) {
        edgeViewModel.unselectEdge();
    }

    public onKeyDown(event: KeyboardEvent, edgeViewModel: EdgeViewModel) {
        if (event.keyCode === 46) {
            const edgeIndex = this.edgeViewModels.findIndex(evm => evm === edgeViewModel);
            if (edgeIndex >= 0) {
                edgeViewModel.removeEdge();
                this.edgeViewModels.splice(edgeIndex, 1);
            }
        }
    }

    private initializeSvgLineDrawing() {
        const editorElement: HTMLElement = this.svgView.nativeElement;
        const thisObj = this;
        this.blockView.forEach(bhV => {
            const blk = bhV.nativeElement;
            blk.onmousemove = function(mme: MouseEvent) {
                thisObj.addSvgLine(mme);
            };
            blk.onmouseup = function(mme: MouseEvent) {
                thisObj.removeSvgLine();
            };
        });

        editorElement.onmousemove = function(mme: MouseEvent) {
            thisObj.addSvgLine(mme);
        };

        editorElement.onmouseup = function(mme: MouseEvent) {
            thisObj.removeSvgLine();
        };
    }

    private addSvgLine(event: MouseEvent) {
        if (this.startPort && this.detectLeftButton(event)) {
            const dummyPort = new GraphPort(this.graph);
            dummyPort.Location = new GraphPoint(event.clientX - 245, event.clientY - 63);
            this.endPort = dummyPort;
            const x = this.endPort.Location.X;
            const y = this.endPort.Location.Y;
           this.arrowPoints = x + ',' + y + ' ' + x + ',' + (y - 5) + ' ' + (x + 10) + ',' + y + ' ' + x + ',' + (y + 5);
            this.showLine = true;
        } else {
            this.showLine = false;
        }
        this.ref.detectChanges();
    }

    private removeSvgLine() {
        this.startPort = undefined;
        this.endPort = undefined;
        this.showLine = false;
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
