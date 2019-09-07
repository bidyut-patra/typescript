import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ViewChildren, ElementRef, ChangeDetectorRef } from '@angular/core';
import { IDockedComponent } from '../controls/dockable-pane/docked-component';
import { GraphicsObject } from '../graphics-pallet/graphics-object';

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

    public x1 = 0;
    public y1 = 0;
    public x2 = 0;
    public y2 = 0;
    public showLine = false;
    public title = 'Graphics Editor';
    public footer = 'Draw Graphics';
    public active = true;
    public data = {};
    public allowedTypes = [GraphicsObject];
    public blocks = [
        {
            marginLeft: '20px',
            marginTop: '20px',
            header: 'Hello World',
            content: [
                {
                    label: 'Y Input Output',
                    type: 'member',
                    direction: 'InOut'
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
            marginLeft: '400px',
            marginTop: '30px',
            header: 'Web Graphics',
            content: [
                {
                    label: 'X Input Output',
                    type: 'member',
                    direction: 'InOut'
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

    }

    ngOnInit() {

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
        if (this.blockHeaderView && (this.blockHeaderView.length > 0) && this.blockView && (this.blockView.length > 0)) {
            const editorElement: HTMLElement = this.editorView.nativeElement;

            this.blockHeaderView.forEach((bhV, i) => {
                const blockHeaderElement: HTMLElement = bhV.nativeElement;
                const blockElement: HTMLElement = (<any[]>(<any>this.blockView)._results)[i].nativeElement;

                let currentX;
                let currentY;

                blockHeaderElement.onmousedown = function(mde) {
                    // mde = mde || window.event;
                    // mde.preventDefault();

                    currentX = mde.clientX;
                    currentY = mde.clientY;

                    editorElement.onmousemove = function(mme) {
                        // mme = mme || window.event;
                        // mme.preventDefault();

                        const newX = mme.clientX;
                        const newY = mme.clientY;

                        const pos1 = currentX - newX;
                        const pos2 = currentY - newY;

                        currentX = newX;
                        currentY = newY;

                        blockElement.style.marginTop = (newY - 95) + 'px';
                        blockElement.style.marginLeft = (newX - 300) + 'px';
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

    public onMouseDown(mde: MouseEvent) {
        this.x1 = mde.clientX - 245;
        this.y1 = mde.clientY - 63;
        this.showLine = false;
        this.ref.detectChanges();
    }

    public onMouseUp(mue: MouseEvent) {
        this.x2 = mue.clientX - 245;
        this.y2 = mue.clientY - 63;

        // check if a line is connected between ports
        if (this.isStartingPointSet() && this.isEndingPointSet()) {
            // add a line with routing
            const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            let points = <string><any>this.x1 + ',' + <string><any>this.y1;
            points += ' ' + <string><any>(this.x2 / 2) + ',' + <string><any>this.y1;
            points += ' ' + <string><any>(this.x2 / 2) + ',' + <string><any>this.y2;
            points += ' ' + <string><any>this.x2 + ',' + <string><any>this.y2;
            polyline.setAttribute('points', points);
            polyline.style.stroke = 'brown';
            polyline.style.strokeWidth = '1';
            polyline.style.fill = 'none';
            this.svg.appendChild(polyline);
            this.showLine = false;
        }

        this.ref.detectChanges();
    }

    private isStartingPointSet() {
        return this.x1 && this.y1;
    }

    private isEndingPointSet() {
        return this.x2 && this.y2;
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
        if (this.isStartingPointSet() && this.detectLeftButton(event)) {
            this.x2 = event.clientX - 245;
            this.y2 = event.clientY - 63;
            this.showLine = true;
        } else {
            this.showLine = false;
        }
        this.ref.detectChanges();
    }

    private removeSvgLine() {
        this.x1 = undefined;
        this.y1 = undefined;
        this.x2 = undefined;
        this.y2 = undefined;
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
